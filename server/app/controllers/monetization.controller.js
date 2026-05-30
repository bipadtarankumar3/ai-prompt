const db = require('../config/database');
const { success, error } = require('../helpers/response.helper');
const crypto = require('crypto');

class MonetizationController {
  // Saved Prompts
  async getSavedPrompts(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await db.query(
        `SELECT pc.pc_id as id, pc.pc_slug as slug, pc.pc_title as title, 
                pc.pc_prompt_text as prompt_text, pc.pc_category as category,
                pc.pc_description as description
         FROM prompt_collections pc
         JOIN saved_prompts sp ON pc.pc_id = sp.sp_prompt_id
         WHERE sp.sp_user_id = $1 ORDER BY sp.sp_created_at DESC`,
        [userId]
      );
      return success(res, result.rows, 'Saved prompts fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async toggleSavePrompt(req, res, next) {
    try {
      const userId = req.user.id;
      const { promptId } = req.body;

      if (!promptId) {
        return error(res, 'Prompt ID is required', 400);
      }

      // Check if already saved
      const check = await db.query(
        'SELECT * FROM saved_prompts WHERE sp_user_id = $1 AND sp_prompt_id = $2',
        [userId, promptId]
      );

      if (check.rows.length > 0) {
        // Unsavoury! Delete it
        await db.query(
          'DELETE FROM saved_prompts WHERE sp_user_id = $1 AND sp_prompt_id = $2',
          [userId, promptId]
        );
        return success(res, { saved: false }, 'Prompt unsaved successfully');
      } else {
        // Save it!
        await db.query(
          'INSERT INTO saved_prompts (sp_user_id, sp_prompt_id) VALUES ($1, $2)',
          [userId, promptId]
        );
        return success(res, { saved: true }, 'Prompt saved successfully');
      }
    } catch (err) {
      next(err);
    }
  }

  // User Limits
  async getUserLimits(req, res, next) {
    try {
      const userId = req.user.id;
      let result = await db.query(
        'SELECT * FROM user_limits WHERE ul_user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        // Seed a default limits row
        const seed = await db.query(
          'INSERT INTO user_limits (ul_user_id, ul_limit_count, ul_used_count) VALUES ($1, 20, 0) RETURNING *',
          [userId]
        );
        return success(res, {
          limit_count: seed.rows[0].ul_limit_count,
          used_count: seed.rows[0].ul_used_count,
          reset_at: seed.rows[0].ul_reset_at
        }, 'User limits fetched successfully');
      }

      const row = result.rows[0];
      // Check if reset period is passed
      if (new Date() > new Date(row.ul_reset_at)) {
        const resetResult = await db.query(
          `UPDATE user_limits 
           SET ul_used_count = 0, ul_reset_at = NOW() + INTERVAL '1 day' 
           WHERE ul_user_id = $1 RETURNING *`,
          [userId]
        );
        return success(res, {
          limit_count: resetResult.rows[0].ul_limit_count,
          used_count: resetResult.rows[0].ul_used_count,
          reset_at: resetResult.rows[0].ul_reset_at
        }, 'User limits reset and fetched successfully');
      }

      return success(res, {
        limit_count: row.ul_limit_count,
        used_count: row.ul_used_count,
        reset_at: row.ul_reset_at
      }, 'User limits fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  // API Keys
  async getApiKeys(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await db.query(
        'SELECT ak_id as id, ak_key as key, ak_is_active as is_active, ak_created_at as created_at FROM api_keys WHERE ak_user_id = $1 ORDER BY ak_id DESC',
        [userId]
      );
      // Mask key for safety except suffix
      const maskedKeys = result.rows.map(row => ({
        ...row,
        key: `${row.key.slice(0, 12)}...${row.key.slice(-4)}`
      }));
      return success(res, maskedKeys, 'API keys fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async generateApiKey(req, res, next) {
    try {
      const userId = req.user.id;
      const rawKey = `rev_live_${crypto.randomBytes(24).toString('hex')}`;
      
      const result = await db.query(
        'INSERT INTO api_keys (ak_user_id, ak_key) VALUES ($1, $2) RETURNING ak_id as id, ak_key as key, ak_is_active as is_active, ak_created_at as created_at',
        [userId, rawKey]
      );
      return success(res, result.rows[0], 'API key generated successfully. Save this key somewhere safe as it will not be displayed again.', 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MonetizationController();
