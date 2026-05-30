/**
 * contentGeneration.service.js
 * 
 * Programmatic content enrichment service for prompt_collections.
 * Generates: FAQs, tags, variations, meta_title, meta_description
 * 
 * Rules:
 * - Semantic variation (no copy-paste duplicates)
 * - Unique metadata per prompt
 * - Anti-hallucination (template-based, not free-form)
 */

const CATEGORY_TAG_SEEDS = {
  chatgpt: ['chatgpt', 'gpt4', 'openai', 'llm', 'text-generation', 'language-model'],
  claude: ['claude', 'anthropic', 'claude-sonnet', 'claude-opus', 'constitutional-ai'],
  gemini: ['gemini', 'google-ai', 'bard', 'palm', 'multimodal'],
  coding: ['coding', 'programming', 'developer', 'software', 'code-generation', 'api'],
  seo: ['seo', 'search-engine', 'google-ranking', 'meta-tags', 'content-optimization'],
  marketing: ['marketing', 'copywriting', 'ads', 'conversion', 'social-media', 'branding'],
  business: ['business', 'strategy', 'entrepreneur', 'management', 'consulting', 'b2b'],
  image: ['image-generation', 'midjourney', 'stable-diffusion', 'dalle', 'visual-ai', 'art'],
  video: ['video', 'youtube', 'script-writing', 'tiktok', 'content-creation', 'reels'],
};

const FAQ_TEMPLATES = [
  {
    question: (title, category) => `What is the best way to use the "${title}" prompt?`,
    answer: (title, category) =>
      `To get the best results from the "${title}" prompt, replace all [VARIABLE] placeholders with your specific context. The more specific and detailed your variable inputs are, the higher quality output you will receive from ${category} models.`,
  },
  {
    question: (title, category) => `Which AI models work best with the "${title}" prompt?`,
    answer: (title, category) =>
      `This prompt is optimized for ${category} workflows. It produces excellent results with modern large language models including ${
        category === 'Image' || category === 'Video'
          ? 'Midjourney v6, DALL-E 3, and Stable Diffusion XL'
          : 'GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro'
      }. Results may vary between models based on their instruction-following capabilities.`,
  },
  {
    question: (title, category) => `Can I customize the "${title}" prompt for my specific needs?`,
    answer: (title, category) =>
      `Absolutely. This prompt uses a [VARIABLE] substitution pattern that makes customization straightforward. Simply identify the bracketed placeholders and replace them with your specific values. You can also use the Revoxera AI Prompt Generator to refine and optimize the prompt further.`,
  },
  {
    question: (title, category) => `How do I improve the output quality from this ${category} prompt?`,
    answer: (title, category) =>
      `To improve output quality: (1) Be as specific as possible when filling in variables, (2) Add context about your target audience or goal, (3) Specify the desired output format explicitly, (4) Run the prompt through the Revoxera AI Optimizer for automatic enhancement.`,
  },
];

const VARIATION_TEMPLATES = [
  {
    title: 'Concise Version',
    suffix: '\n\nKeep your response brief and under 150 words. Use bullet points where possible.',
  },
  {
    title: 'Detailed Version',
    suffix: '\n\nProvide a comprehensive, detailed response with examples, explanations, and actionable next steps. Aim for thoroughness.',
  },
  {
    title: 'Formal Tone',
    suffix: '\n\nMaintain a professional, formal tone throughout. Avoid casual language. Use industry-standard terminology.',
  },
];

class ContentGenerationService {
  /**
   * Generate tags for a prompt based on category + title keywords.
   */
  generateTags(prompt) {
    const categoryKey = (prompt.category || '').toLowerCase().trim();
    
    // 1. Start with seed tags specific to the category
    const seedTags = CATEGORY_TAG_SEEDS[categoryKey] || [categoryKey, 'ai-prompt'];

    // 2. Extract keywords from the prompt's title
    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'for', 'of', 'to', 'in', 'on', 'with', 'by', 'from', 'is', 'are']);
    const titleTags = (prompt.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .split(/\s+/) // Split by whitespace
      .filter(w => w.length > 3 && !stopWords.has(w)) // Ignore short words and stop words
      .slice(0, 4) // Take only top 4 words
      .map(w => w.replace(/\s+/g, '-')); // Format as tag-friendly strings

    // 3. Combine seed tags and title tags, remove duplicates, and limit to 8 max
    const allTags = [...new Set([...seedTags.slice(0, 4), ...titleTags])].slice(0, 8);
    return allTags;
  }

  /**
   * Generate 2-3 FAQs for a prompt using template-based variation.
   */
  generateFAQs(prompt) {
    if (Array.isArray(prompt.faqs) && prompt.faqs.length >= 2) {
      return prompt.faqs; // Already has FAQs, don't overwrite
    }

    const existingFAQs = Array.isArray(prompt.faqs) ? prompt.faqs : [];
    const templates = FAQ_TEMPLATES.filter(
      t => !existingFAQs.some(f =>
        f.question.toLowerCase().includes(prompt.title.toLowerCase().slice(0, 20))
      )
    ).slice(0, 3 - existingFAQs.length);

    const newFAQs = templates.map(t => ({
      question: t.question(prompt.title, prompt.category),
      answer: t.answer(prompt.title, prompt.category),
    }));

    return [...existingFAQs, ...newFAQs];
  }

  /**
   * Generate prompt variations (tone/length variants).
   */
  generateVariations(prompt) {
    if (Array.isArray(prompt.variations) && prompt.variations.length > 0) {
      return prompt.variations; // Already has variations
    }

    // Generate 2 variations max
    return VARIATION_TEMPLATES.slice(0, 2).map(v => ({
      title: v.title,
      prompt_text: (prompt.prompt_text || '') + v.suffix,
    }));
  }

  /**
   * Generate a unique SEO meta title (50-60 chars target).
   */
  generateMetaTitle(prompt) {
    if (prompt.meta_title) return prompt.meta_title;

    const base = prompt.title || '';
    const category = prompt.category || '';

    // Semantic variants to avoid duplicate titles across the site
    const patterns = [
      () => `${base} — ${category} Prompt Template`,
      () => `Best ${category} Prompt: ${base}`,
      () => `${base} | ${category} AI Prompt`,
      () => `${base} — Free ${category} Prompt`,
    ];

    // Find the first pattern that yields a title with a good SEO length (40-70 characters)
    for (const pattern of patterns) {
      const title = pattern();
      if (title.length >= 40 && title.length <= 70) return title;
    }

    // Fallback if none of the patterns matched the ideal length
    return `${base} — ${category} Prompt`.slice(0, 70);
  }

  /**
   * Generate a unique SEO meta description (150-165 chars target).
   */
  generateMetaDescription(prompt) {
    if (prompt.meta_description) return prompt.meta_description;

    const title = prompt.title || '';
    const category = prompt.category || '';
    const desc = (prompt.description || '').slice(0, 80);

    const patterns = [
      () => `Use the "${title}" ${category} prompt template. ${desc}. Copy free on Revoxera AI.`,
      () => `${title}: A professional ${category} AI prompt. ${desc}. Free to copy and optimize.`,
      () => `Copy this ${category} prompt: "${title}". ${desc}. Works with ChatGPT, Claude & more.`,
    ];

    for (const pattern of patterns) {
      const d = pattern();
      if (d.length >= 130 && d.length <= 165) return d;
    }

    return `${title} — ${category} prompt template. Copy and use with ChatGPT, Claude, or Gemini. Free on Revoxera AI.`.slice(0, 165);
  }

  /**
   * Enrich a single prompt with all generated content.
   * Returns the fields to update (does NOT write to DB — caller does that).
   */
  enrichPrompt(prompt) {
    return {
      tags: this.generateTags(prompt),
      faqs: this.generateFAQs(prompt),
      variations: this.generateVariations(prompt),
      meta_title: this.generateMetaTitle(prompt),
      meta_description: this.generateMetaDescription(prompt),
    };
  }

  /**
   * Check if a prompt needs enrichment.
   */
  needsEnrichment(prompt) {
    return (
      !prompt.tags || prompt.tags.length === 0 ||
      !prompt.faqs || prompt.faqs.length < 2 ||
      !prompt.meta_title ||
      !prompt.meta_description
    );
  }
}

module.exports = new ContentGenerationService();
