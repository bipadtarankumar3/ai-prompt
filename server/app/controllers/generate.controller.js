const aiService = require('../services/ai.service');
const settingsService = require('../services/settings.service');
const modelService = require('../services/model.service');
const { error } = require('../helpers/response.helper');
const logger = require('../utils/logger');

// Simple Rate Limiting In-Memory
const rateLimitMap = new Map();
const RATE_LIMIT = 20;       // max requests
const RATE_WINDOW = 60000;   // per 60 seconds

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;

  record.count += 1;
  rateLimitMap.set(ip, record);
  return true;
}

class GenerateController {
  async generate(req, res, next) {
    try {
      // 1. Check master AI toggle
      const isAIActive = await settingsService.getSetting('global_ai_active');
      if (isAIActive !== 'true') {
        return error(res, 'AI generation features are temporarily disabled by the administrator.', 403);
      }

      // 2. Rate limiting by IP
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (!checkRateLimit(ip)) {
        return error(res, 'Rate limit exceeded. Please wait a minute before trying again.', 429);
      }

      const { userInput, category, tone, mode, provider, modelCode, chatHistory } = req.body;

      // 3. Validation
      if (!userInput || typeof userInput !== 'string' || userInput.trim().length < 3) {
        return error(res, 'Please provide a valid prompt idea (at least 3 characters).', 400);
      }
      if (userInput.trim().length > 2000) {
        return error(res, 'Input is too long. Please keep it under 2000 characters.', 400);
      }

      // 4. Validate and check active status of selected provider/model
      const activeModels = await modelService.getActiveModels();
      const matchedModel = activeModels.find(
        m => m.provider === provider && m.api_model_code === modelCode
      );

      if (!matchedModel) {
        return error(res, 'Selected AI model/provider is not currently active or available.', 400);
      }

      logger.info(`Running generation using ${provider}:${modelCode}...`);

      // 5. Build chat history limit
      const historyLimit = require('../config/env').maxChatHistoryLimit;
      const maxHistoryMessages = historyLimit * 2;
      const slicedHistory = (chatHistory || []).slice(-maxHistoryMessages);

      // 6. Call service
      const result = await aiService.generate({
        userInput,
        category,
        tone,
        mode,
        provider,
        modelCode,
        chatHistory: slicedHistory
      });

      return res.status(200).json({
        success: true,
        result: result.text,
        tokensUsed: result.tokensUsed,
        provider,
        model: modelCode
      });
    } catch (err) {
      logger.error('Failed to generate prompt', err);
      return error(res, err.message || 'An unexpected error occurred during prompt generation.', 500);
    }
  }
}

module.exports = new GenerateController();
