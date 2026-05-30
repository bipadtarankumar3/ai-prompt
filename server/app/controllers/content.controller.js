const collectionRepository = require('../repositories/collection.repository');
const contentGeneration = require('../services/contentGeneration.service');
const { success, error } = require('../helpers/response.helper');
const logger = require('../utils/logger');

class ContentController {
  /**
   * GET /api/content/gaps
   * Returns prompts that are missing enrichment data (tags, FAQs, meta).
   */
  async getGaps(req, res, next) {
    try {
      const all = await collectionRepository.findAll();
      const gaps = all.filter(p => contentGeneration.needsEnrichment(p));
      return success(res, {
        total: all.length,
        needsEnrichment: gaps.length,
        prompts: gaps.map(p => ({ id: p.id, slug: p.slug, title: p.title, category: p.category })),
      }, 'Content gaps identified');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/content/generate-batch
   * Admin-triggered: enriches all prompts that are missing content.
   * Processes in batches of 10 to avoid memory spikes.
   */
  async generateBatch(req, res, next) {
    try {
      const all = await collectionRepository.findAll();
      const toEnrich = all.filter(p => contentGeneration.needsEnrichment(p));

      if (toEnrich.length === 0) {
        return success(res, { enriched: 0, message: 'All prompts are already enriched.' }, 'No gaps found');
      }

      let enriched = 0;
      let failed = 0;
      const errors = [];

      // Process in batches of 10
      const BATCH_SIZE = 10;
      for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
        const batch = toEnrich.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (prompt) => {
          try {
            const enrichedData = contentGeneration.enrichPrompt(prompt);
            await collectionRepository.update(prompt.id, {
              ...prompt,
              use_cases: prompt.use_cases || [],
              tags: enrichedData.tags,
              faqs: enrichedData.faqs,
              variations: enrichedData.variations,
              meta_title: enrichedData.meta_title,
              meta_description: enrichedData.meta_description,
            });
            enriched++;
            logger.info(`[ContentGen] Enriched prompt: ${prompt.slug}`);
          } catch (err) {
            failed++;
            errors.push({ slug: prompt.slug, error: err.message });
            logger.error(`[ContentGen] Failed to enrich prompt ${prompt.slug}:`, err);
          }
        }));
      }

      return success(res, {
        total: toEnrich.length,
        enriched,
        failed,
        errors: errors.slice(0, 10), // Return first 10 errors
      }, `Batch enrichment complete: ${enriched} enriched, ${failed} failed`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/content/generate-prompt
   * Generates a new prompt record from a title + category.
   * Admin-triggered content creation endpoint.
   */
  async generatePrompt(req, res, next) {
    try {
      const { title, category, description, prompt_text } = req.body;

      if (!title || !category || !prompt_text) {
        return res.status(400).json({ success: false, message: 'title, category, and prompt_text are required' });
      }

      // Build slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const promptData = {
        slug,
        title,
        category,
        prompt_text,
        description: description || '',
        is_featured: false,
        is_premium: false,
        type: 'prompt',
      };

      // Generate enrichment data
      const enriched = contentGeneration.enrichPrompt(promptData);
      const fullData = { ...promptData, ...enriched, use_cases: [], example_inputs: '', example_outputs: '' };

      const created = await collectionRepository.create(fullData);
      logger.info(`[ContentGen] Created new enriched prompt: ${slug}`);

      return success(res, created, 'Prompt created and enriched successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/content/enrich/:id
   * Enrich a single prompt by ID.
   */
  async enrichSingle(req, res, next) {
    try {
      const prompt = await collectionRepository.findById(req.params.id);
      if (!prompt) return res.status(404).json({ success: false, message: 'Prompt not found' });

      const enrichedData = contentGeneration.enrichPrompt(prompt);
      const updated = await collectionRepository.update(prompt.id, {
        ...prompt,
        use_cases: prompt.use_cases || [],
        tags: enrichedData.tags,
        faqs: enrichedData.faqs,
        variations: enrichedData.variations,
        meta_title: enrichedData.meta_title,
        meta_description: enrichedData.meta_description,
      });

      return success(res, updated, 'Prompt enriched successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContentController();
