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
const analyticsRoutes = require('./app/routes/analytics.routes');
const monetizationRoutes = require('./app/routes/monetization.routes');
const contentRoutes = require('./app/routes/content.routes');

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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api/content', contentRoutes);

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
        'INSERT INTO users (name, email, password, role, email_verified_at) VALUES ($1, $2, $3, $4, NOW())',
        ['Admin', 'admin@example.com', passwordHash, 'admin']
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

      // Seed Prompt Collections (Programmatic SEO & Categorized templates)
      const promptCollections = [
        {
          slug: 'chatgpt-prompt-for-email-writing',
          title: 'ChatGPT Prompt for Professional Email Writing',
          prompt_text: 'Write a professional email from a [SENDER_TITLE] to [RECIPIENT_TITLE] addressing the topic of [TOPIC]. The email should maintain a [TONE] tone. Outline clear action items and specify any next steps. Keep the length under [LENGTH] sentences.',
          category: 'ChatGPT',
          description: 'An optimized email drafting template engineered to format professional communication. Generates action-oriented text suitable for client relations, cold sales, internal memos, or business collaboration.',
          example_inputs: 'Sender: Senior Product Manager\nRecipient: Marketing Lead\nTopic: Launch delay of feature X\nTone: Professional but collaborative\nLength: 5 sentences',
          example_outputs: 'Subject: Update on Feature X Launch & Next Steps\n\nHi Sarah,\n\nI want to share a brief update regarding our Feature X release schedule. Due to additional validation requirements, we are adjusting our launch date by two weeks. This will ensure we deliver the polished experience our users expect.\n\nCould we reschedule our sync to next Tuesday? Let me know if that works.\n\nBest,\nDavid',
          use_cases: ['Cold outbound outreach campaigns', 'Customer support communications', 'Internal team delay notifications', 'Executive update drafting'],
          faqs: [
            { question: 'How can I adjust the tone of the email?', answer: 'You can alter the [TONE] parameter to options like Persuasive, Direct, Urgent, or Empathetic to match your needs.' },
            { question: 'Does this template work for cold emailing?', answer: 'Yes, setting the recipient details and topic to highlight value propositions works exceptionally well.' }
          ],
          copy_count: 1420,
          view_count: 5310,
          is_featured: true,
          is_premium: false
        },
        {
          slug: 'sql-query-generator-prompt',
          title: 'Natural Language SQL Query Generator',
          prompt_text: 'Act as an expert SQL query builder. Translate the following natural language request into a clean, optimized SQL query for a database running [DB_DIALECT].\n\nDatabase Schema:\n[SCHEMA_DETAILS]\n\nRequest:\n[USER_REQUEST]\n\nOutput only the SQL code wrapped in sql markdown blocks with a brief explanation of how it joins tables.',
          category: 'Coding',
          description: 'Translate English instructions into high-performance SQL queries. Supports complex joins, aggregate subqueries, windows functions, and syntax for PostgreSQL, MySQL, MS SQL, and BigQuery.',
          example_inputs: 'Request: Find top 5 users who spent the most in 2025\nDialect: PostgreSQL\nSchema: users (id, name), orders (id, user_id, amount, created_at)',
          example_outputs: '```sql\nSELECT u.id, u.name, SUM(o.amount) AS total_spent\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.created_at >= \'2025-01-01\' AND o.created_at <= \'2025-12-31\'\nGROUP BY u.id, u.name\nORDER BY total_spent DESC\nLIMIT 5;\n```',
          use_cases: ['Data analytics dashboard query crafting', 'Fast reporting table extraction', 'Syntax translation between database dialects', 'Developer onboarding query templates'],
          faqs: [
            { question: 'Which databases are supported by this generator prompt?', answer: 'This prompt works for any relational SQL database, including PostgreSQL, MySQL, SQLite, Oracle, and MS SQL Server.' },
            { question: 'Can it handle schema references?', answer: 'Yes. Simply paste your table columns in the [SCHEMA_DETAILS] block to get accurate queries.' }
          ],
          copy_count: 980,
          view_count: 3200,
          is_featured: true,
          is_premium: false
        },
        {
          slug: 'youtube-script-prompt',
          title: 'YouTube Script Writer & Hook Outline',
          prompt_text: 'Write a complete engaging YouTube script for a video titled "[TITLE]".\nTarget Audience: [AUDIENCE]\nTone: [TONE]\n\nInclude a 30-second scroll-stopping hook, three main learning points with visual guidance instructions, a natural mid-video engagement call, and a strong outro directing viewers to watch a related video.',
          category: 'Video',
          description: 'Generate high-retention video script outlines designed to hook viewers in the first 30 seconds and increase average watch time.',
          example_inputs: 'Title: Top 5 AI tools of 2026\nAudience: Tech enthusiasts\nTone: Energetic & informative',
          example_outputs: '[Visual: Fast-paced montage of AI tools]\nHook: 90% of people are using AI wrong. In this video, we review the top 5 tools that will actually save you 10+ hours a week in 2026. No filler, let\'s jump in!',
          use_cases: ['Educational video outlining', 'Short-form TikTok / Reels script ideas', 'Voiceover scripts for tutorial videos', 'Marketing explainer video production'],
          faqs: [
            { question: 'How long should the resulting script be?', answer: 'The prompt is optimized to produce outlines and scripts between 5 to 15 minutes in length.' }
          ],
          copy_count: 730,
          view_count: 2450,
          is_featured: false,
          is_premium: false
        },
        {
          slug: 'claude-advanced-system-prompt',
          title: 'Claude 3.5 System Prompt for Coding Agents',
          prompt_text: 'You are Claude, a senior full-stack AI engineer. You write dry, optimized, and fully-typed TypeScript code. Adhere strictly to these parameters:\n- Keep methods short and single-purpose\n- Implement error handling on every level\n- Output clean file structures in XML tags <file path="..."></file>\n- Avoid placeholders at all costs.',
          category: 'Claude',
          description: 'Configure Anthropic Claude 3.5 Sonnet to behave as a senior developer agent, ensuring it outputs production-ready TypeScript code with XML tag structural boundaries.',
          example_inputs: 'Request: Build a lightweight caching class.',
          example_outputs: '<file path="cache.ts">\nclass Cache<T> {\n  private store = new Map<string, { val: T; exp: number }>();\n  ...\n}\n</file>',
          use_cases: ['AI coder subagent configuration', 'Autonomous code editors pipeline setup', 'Strict programming formatting overrides'],
          faqs: [
            { question: 'Will this system instruction prevent code truncation?', answer: 'Yes. Enforcing XML tagging encourages the model to close code blocks completely.' }
          ],
          copy_count: 1120,
          view_count: 4100,
          is_featured: true,
          is_premium: true
        },
        {
          slug: 'gemini-data-analyst-agent',
          title: 'Gemini Agent for JSON Data Analytics',
          prompt_text: 'Analyze the following JSON structured report. Highlight statistically significant outliers, anomalies, and positive trends in [METRIC] over the timeframe. Return a clean markdown report containing a 3-sentence summary, a visual table of key metrics, and bulleted recommendations.\n\nJSON Report:\n[JSON_DATA]',
          category: 'Gemini',
          description: 'Instruct Google Gemini models to act as an automated data analyst, parsing large JSON schemas and building readable reports.',
          example_inputs: 'Metric: Active user churn\nJSON_DATA: [{"month": "Jan", "churn": 2.1}, {"month": "Feb", "churn": 4.8}]',
          example_outputs: '# Data Analysis Report\n- **Churn Spike**: Churn rose significantly in Feb (+128%).\n- **Recommendation**: Audit pricing change implemented in late Jan.',
          use_cases: ['Automatic log file audit', 'Financial reporting summarization', 'Database performance analysis reporting'],
          faqs: [
            { question: 'Does this template support nested JSON structures?', answer: 'Yes. Gemini models have very large contexts and easily parse heavily nested JSON configurations.' }
          ],
          copy_count: 560,
          view_count: 1900,
          is_featured: false,
          is_premium: false
        },
        {
          slug: 'seo-meta-tag-optimizer',
          title: 'SEO Meta Description & Title Optimizer',
          prompt_text: 'Generate 5 high-CTR combinations of Title tags and Meta descriptions for the primary keyword "[KEYWORD]" and target page intent "[INTENT]". Keep Title tags between 50-60 characters and Meta descriptions between 150-160 characters. Highlight emotional triggers, keywords, and secondary call-to-actions in each choice.',
          category: 'SEO',
          description: 'Instantly generate search-optimized, high click-through-rate meta tags matching Google guidelines.',
          example_inputs: 'Keyword: best wireless headphones\nIntent: Commercial comparison',
          example_outputs: 'Title 1: Top 5 Best Wireless Headphones of 2026 (Reviewed)\nMeta 1: Looking for the best wireless headphones? Check out our comparison of sound, battery, and price. Find your perfect pair today!',
          use_cases: ['Blog post programmatic tag writing', 'E-commerce product SEO scale optimization', 'Landing pages metadata A/B testing'],
          faqs: [
            { question: 'What is the optimal character length for search tags?', answer: 'Search engines typically display the first 50-60 characters of titles and 150-160 characters of meta descriptions.' }
          ],
          copy_count: 1340,
          view_count: 3600,
          is_featured: true,
          is_premium: false
        },
        {
          slug: 'facebook-ad-copywriter',
          title: 'High-Converting Facebook Ad Copywriter',
          prompt_text: 'Write 3 Facebook ad copy variations targeting [AUDIENCE] interested in [PRODUCT_NAME].\nVariation 1: Hook-Story-Offer (long-form)\nVariation 2: Short & Punchy benefit list\nVariation 3: Question-Agitate-Solve framework\n\nInclude suggested emojis, visual overlay text ideas, and clear call-to-action details.',
          category: 'Marketing',
          description: 'A structured copywriting framework engineered to write high-engagement social media ad copy targeting specific user personas.',
          example_inputs: 'Product: Revoxera Prompt Builder\nAudience: Busy startup founders\nOffer: Try for free today',
          example_outputs: '🔥 Startup founders: Stop wasting hours typing prompts that miss. \n\nIntroducing Revoxera AI - generate professional instructions instantly. Try free today!',
          use_cases: ['Paid traffic ad creation', 'E-commerce copy testing', 'Conversion rate optimization (CRO) testing'],
          faqs: [],
          copy_count: 850,
          view_count: 2150,
          is_featured: false,
          is_premium: false
        },
        {
          slug: 'elevator-pitch-generator',
          title: 'Executive Elevator Pitch Outline Builder',
          prompt_text: 'Build an executive 30-second elevator pitch using the following startup metrics:\n- Industry: [INDUSTRY]\n- Problem: [PROBLEM]\n- Solution: [SOLUTION]\n- Market Size: [MARKET_SIZE]\n\nKeep the pitch under 120 words. Format it in a way that is conversational, punchy, and highlights the clear financial opportunity.',
          category: 'Business',
          description: 'Generate concise, investor-ready business pitches that articulate your value proposition quickly and elegantly.',
          example_inputs: 'Industry: Biotech\nProblem: Clinical trial matching takes months\nSolution: AI matches patients in hours\nMarket: $15B annually',
          example_outputs: 'Clinical trials are the bottleneck of medicine, costing billions. We built an AI matching database that cuts onboarding from months to hours. Targeting a $15B market, we are ready to scale.',
          use_cases: ['Founder pitch preparation', 'Networking event speech writing', 'Executive summaries introduction writing'],
          faqs: [],
          copy_count: 420,
          view_count: 1250,
          is_featured: false,
          is_premium: false
        },
        {
          slug: 'midjourney-v6-photorealistic-portrait',
          title: 'Midjourney v6 Photorealistic Portrait Studio',
          prompt_text: 'A professional close-up studio portrait of a [SUBJECT], soft Rembrandt lighting, shot on 85mm f/1.2 lens, neutral grey background, photorealistic texture, sharp focus on eyes, 8k resolution, award-winning photography --ar 3:4 --style raw --v 6.0',
          category: 'Image',
          description: 'A premium photorealistic studio portrait prompt formula configured for Midjourney v6 parameters and aspect ratios.',
          example_inputs: 'Subject: Elderly smiling ceramic artist',
          example_outputs: 'A professional close-up studio portrait of a Elderly smiling ceramic artist, soft Rembrandt lighting, shot on 85mm f/1.2 lens... --ar 3:4 --style raw --v 6.0',
          use_cases: ['AI portrait headshot creation', 'Social media stock asset development', 'Creative graphic design studio generation'],
          faqs: [
            { question: 'What is the purpose of the "--style raw" parameter?', answer: 'It reduces Midjourney v6\'s default stylistic bias, producing more natural, photographic textures.' }
          ],
          copy_count: 1980,
          view_count: 6700,
          is_featured: true,
          is_premium: false
        }
      ];

      for (const item of promptCollections) {
        await db.query(
          `INSERT INTO prompt_collections (
            pc_slug, pc_title, pc_prompt_text, pc_category, 
            pc_description, pc_example_inputs, pc_example_outputs, 
            pc_use_cases, pc_faqs, pc_copy_count, pc_view_count, 
            pc_is_featured, pc_is_premium
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            item.slug, item.title, item.prompt_text, item.category,
            item.description, item.example_inputs, item.example_outputs,
            JSON.stringify(item.use_cases), JSON.stringify(item.faqs),
            item.copy_count, item.view_count, item.is_featured, item.is_premium
          ]
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
