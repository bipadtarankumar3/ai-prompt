const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const config = require('./app/config/env');
const db = require('./app/config/database');
const logger = require('./app/utils/logger');
const errorHandler = require('./app/middlewares/error.middleware');

// Routes
const authRoutes = require('./app/routes/auth.routes');
const modelRoutes = require('./app/routes/model.routes');
const collectionRoutes = require('./app/routes/collection.routes');
const blogRoutes = require('./app/routes/blog.routes');
const settingsRoutes = require('./app/routes/settings.routes');
const generateRoutes = require('./app/routes/generate.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/prompt-collections', collectionRoutes);
app.use('/api/blog-posts', blogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/generate', generateRoutes);

// Error middleware
app.use(errorHandler);

// Database Initialization (Schema + Seed)
async function initializeDatabase() {
  try {
    logger.info('Initializing database schema...');
    
    // 1. Run migrations
    const schemaPath = path.join(__dirname, 'app', 'models', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schemaSql);
    logger.info('Schema migration complete.');

    // 2. Check if users table is empty. If so, seed!
    const userCheck = await db.query('SELECT count(*) FROM users');
    const userCount = parseInt(userCheck.rows[0].count, 10);
    
    if (userCount === 0) {
      logger.info('Database empty. Seeding default data...');
      
      // Seed User
      const passwordHash = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (name, email, password, email_verified_at) VALUES ($1, $2, $3, NOW())',
        ['Admin', 'admin@example.com', passwordHash]
      );
      logger.info('Seeded default user (admin@example.com / admin123).');

      // Seed Settings
      const settings = [
        ['global_ai_active', 'true'],
        ['about_title', 'About Revoxera AI'],
        ['about_description', 'We build interface layers that simplify speaking to AI. Our goal is to transform simple, raw thoughts into robust prompt architectures instantly.'],
        ['about_story_title', 'The Story of Revoxera AI'],
        ['about_story_content', 'Revoxera AI was founded in 2026 by a small group of software engineers and content creators who realized that writing effective prompts was becoming a bottleneck. While large language models were growing exponentially in capability, getting them to produce consistent, structured outputs remained a tedious trial-and-error process.\n\nWe realized that effective prompting requires roleplaying, delimiter structures, explicit output rules, and detailed tone adjustments. We built Revoxera AI to automate these prompt patterns, translating brief inputs into complete prompt layouts with a single click.'],
        ['site_logo_text', 'REVOXERA'],
        ['site_logo_image', ''],
        ['footer_description', 'Precision-crafted developer tools designed to streamline your daily programming, formatting, and design workflows.'],
        ['footer_copyright', '© 2026 Revoxera. Built for Developers & Creators.'],
        ['default_theme_mode', 'dark'],
        ['seo_home_title', 'Revoxera AI — World-Class AI Prompt Generator'],
        ['seo_home_description', 'Generate, improve, and rewrite AI prompts instantly with Revoxera AI. Powered by Gemini 2.5 and Hugging Face. Support for ChatGPT, Midjourney, Coding, Marketing, SEO, and more.'],
        ['seo_home_keywords', 'AI prompt generator, ChatGPT prompts, Midjourney prompts, prompt engineering, AI tools, prompt improver'],
        ['seo_generator_title', 'AI Prompt Generator Tool — Revoxera AI'],
        ['seo_generator_description', 'Optimize your prompts for OpenAI ChatGPT, Gemini, HuggingFace models using our customizable settings.'],
        ['seo_generator_keywords', 'prompt generator, AI prompt creator, GPT-4 prompt, Gemini instructions'],
        ['seo_collections_title', 'Prompt Collections Gallery — Revoxera AI'],
        ['seo_collections_description', 'Browse ready-to-use prompt templates for coding, marketing, design, and content writing.'],
        ['seo_collections_keywords', 'prompt templates, prompt examples, copy paste prompts'],
        ['seo_blog_title', 'Revoxera AI Blog — Prompt Engineering Guides'],
        ['seo_blog_description', 'Expert insights, articles, and guidelines for mastering LLM prompt engineering, parameters, and AI workflows.'],
        ['seo_blog_keywords', 'AI blog, prompt engineering blog, LLM updates'],
        ['seo_about_title', 'About Us — Revoxera AI'],
        ['seo_about_description', 'Learn about our mission to build interface layers that simplify speaking to AI models.'],
        ['seo_about_keywords', 'about revoxera, company mission, dynamic prompts team']
      ];

      for (const [key, val] of settings) {
        await db.query(
          'INSERT INTO settings (set_key, set_value) VALUES ($1, $2) ON CONFLICT (set_key) DO NOTHING',
          [key, val]
        );
      }

      // Seed AI Models
      const models = [
        ['GPT-4o Mini', 'openai', 'gpt-4o-mini', true],
        ['Gemini 2.5 Flash', 'gemini', 'gemini-2.5-flash', true],
        ['Qwen 2.5 7B', 'huggingface', 'Qwen/Qwen2.5-7B-Instruct', true],
        ['Mistral 7B', 'huggingface', 'mistralai/Mistral-7B-Instruct-v0.3', true],
        ['DeepSeek R1', 'huggingface', 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', true],
        ['Phi 3.5 Mini', 'huggingface', 'microsoft/Phi-3.5-mini-instruct', true],
        ['Zephyr 7B', 'huggingface', 'HuggingFaceH4/zephyr-7b-beta', true]
      ];

      for (const [name, provider, api_model_code, is_active] of models) {
        await db.query(
          'INSERT INTO ai_models (am_name, am_provider, am_api_model_code, am_is_active) VALUES ($1, $2, $3, $4)',
          [name, provider, api_model_code, is_active]
        );
      }

      // Seed Prompt Collections
      const promptCollections = [
        ['Advanced Code Refactoring', 'You are an expert software engineer. Refactor the following code to be clean, modular, and optimized for performance. Provide explanations of your improvements:\n\n[INSERT CODE HERE]', 'Coding'],
        ['SEO Blog Outline Generator', 'You are a professional SEO content strategist. Create a comprehensive blog outline for the keyword "[KEYWORD]" targeting the audience "[AUDIENCE]". Include headers (H1, H2, H3), search intent classification, and suggested LSI keywords for each section.', 'SEO'],
        ['Email Campaign Copywriter', 'You are a SaaS marketing copywriter. Write a 3-part email nurture sequence for users who signed up for a trial of our tool but did not subscribe yet. Keep the tone helpful, persuasive, and highlight value propositions.', 'Marketing'],
        ['Midjourney Cinematic Lighting Prompt', 'Close-up portrait of a futuristic cyberpunk traveler in neon-lit rain-slicked Tokyo streets, 8k resolution, cinematic lighting, shot on 35mm lens, photorealistic, intricate details --ar 16:9 --style raw', 'Design'],
        ['Clean CSS Flexbox Layout', 'Create a highly modern clean HTML/CSS CSS Flexbox layout for a pricing table with 3 cards (Basic, Pro, Enterprise). Make it look like a premium SaaS dashboard with elegant dark background and purple glows.', 'Coding']
      ];

      for (const [title, prompt_text, category] of promptCollections) {
        await db.query(
          'INSERT INTO prompt_collections (pc_title, pc_prompt_text, pc_category) VALUES ($1, $2, $3)',
          [title, prompt_text, category]
        );
      }

      // Seed Blog Posts
      const blogPosts = [
        [
          'Mastering Midjourney v6: The Ultimate Prompting Guide',
          'Unlock the full power of Midjourney v6 with parameters, camera specifications, structural weight, and style modifiers. Learn how to write photorealistic instructions, manage aspect ratios, and tweak raw style parameters.',
          'Unlock the full power of Midjourney v6 with parameters, camera specifications, structural weight, and style modifiers.',
          'Design',
          'Sarah Chen',
          '6 min read',
          'mastering-midjourney-v6-the-ultimate-prompting-guide'
        ],
        [
          'How to Write AI Prompts That Rank #1 on Google',
          'Discover the prompt structures behind writing SEO-optimized blogs, headings hierarchy, meta tags, and structured formats. Learn how to give exact context constraints to Gemini or GPT to build readable and search engine optimized text.',
          'Discover the prompt structures behind writing SEO-optimized blogs, headings hierarchy, meta tags, and structured formats.',
          'SEO & Content',
          'Alex Carter',
          '5 min read',
          'how-to-write-ai-prompts-that-rank-1-on-google'
        ],
        [
          'The Rise of Open-Source LLMs: Qwen vs. Mistral',
          'An in-depth benchmark comparison of open-source models, highlighting their instruction-following strengths and performance tags. We review Qwen 2.5 7B, Mistral 7B, and DeepSeek Distilled models, mapping them to real-world usage cost-benefits.',
          'An in-depth benchmark comparison of open-source models, highlighting their instruction-following strengths and performance tags.',
          'Engineering',
          'David Vance',
          '8 min read',
          'the-rise-of-open-source-llms-qwen-vs-mistral'
        ]
      ];

      for (const [title, content, excerpt, category, author, read_time, slug] of blogPosts) {
        await db.query(
          'INSERT INTO blog_posts (bp_title, bp_content, bp_excerpt, bp_category, bp_author, bp_read_time, bp_slug) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [title, content, excerpt, category, author, read_time, slug]
        );
      }

      logger.info('Database seeding complete.');
    } else {
      logger.info('Database already seeded. Skipping default records creation.');
    }

    // Ensure existing settings in DB are updated to clear out cyberpunk text
    await db.query(
      "UPDATE settings SET set_value = '© 2026 Revoxera. Built for Developers & Creators.' WHERE set_key = 'footer_copyright' AND set_value LIKE '%Neural Architecture%'"
    );
  } catch (err) {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

// Start Server after database is ready
initializeDatabase().then(() => {
  const PORT = config.port;
  app.listen(PORT, () => {
    logger.info(`Express Server running on port ${PORT}...`);
  });
});
