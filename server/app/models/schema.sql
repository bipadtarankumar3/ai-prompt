-- =====================================================================
-- REVOXERA AI — DATABASE SCHEMA (v2 — Non-Destructive Migration)
-- =====================================================================
-- Pattern: CREATE TABLE IF NOT EXISTS (idempotent, preserves data)
--          ALTER TABLE ... ADD COLUMN IF NOT EXISTS (safe for prod)
-- DO NOT add DROP TABLE for tables containing production data.
-- =====================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    remember_token VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    set_key VARCHAR(50) PRIMARY KEY,
    set_value TEXT NOT NULL
);

-- AI Models table
CREATE TABLE IF NOT EXISTS ai_models (
    am_id SERIAL PRIMARY KEY,
    am_name VARCHAR(100) NOT NULL,
    am_provider VARCHAR(50) NOT NULL,
    am_api_model_code VARCHAR(100) NOT NULL,
    am_is_active BOOLEAN DEFAULT TRUE,
    am_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompt Collections table
CREATE TABLE IF NOT EXISTS prompt_collections (
    pc_id SERIAL PRIMARY KEY,
    pc_slug VARCHAR(255) UNIQUE NOT NULL,
    pc_title VARCHAR(255) NOT NULL,
    pc_prompt_text TEXT NOT NULL,
    pc_category VARCHAR(100) NOT NULL,
    pc_description TEXT,
    pc_example_inputs TEXT,
    pc_example_outputs TEXT,
    pc_use_cases JSONB DEFAULT '[]'::jsonb,
    pc_faqs JSONB DEFAULT '[]'::jsonb,
    pc_copy_count INTEGER DEFAULT 0,
    pc_view_count INTEGER DEFAULT 0,
    pc_is_featured BOOLEAN DEFAULT FALSE,
    pc_is_premium BOOLEAN DEFAULT FALSE,
    pc_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- NON-DESTRUCTIVE MIGRATIONS: prompt_collections SEO columns (v2)
-- These are safe to run on existing production databases
-- =====================================================================
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_meta_title VARCHAR(70) DEFAULT NULL;
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_meta_description VARCHAR(165) DEFAULT NULL;
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_variations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_type VARCHAR(20) DEFAULT 'prompt';
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_ai_model_target VARCHAR(50) DEFAULT NULL;
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_difficulty VARCHAR(20) DEFAULT 'beginner';
ALTER TABLE prompt_collections ADD COLUMN IF NOT EXISTS pc_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_pc_type ON prompt_collections(pc_type);
CREATE INDEX IF NOT EXISTS idx_pc_category ON prompt_collections(pc_category);
CREATE INDEX IF NOT EXISTS idx_pc_tags_gin ON prompt_collections USING GIN(pc_tags);
CREATE INDEX IF NOT EXISTS idx_pc_featured_copies ON prompt_collections(pc_is_featured, pc_copy_count DESC);
CREATE INDEX IF NOT EXISTS idx_pc_slug ON prompt_collections(pc_slug);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    bp_id SERIAL PRIMARY KEY,
    bp_title VARCHAR(255) NOT NULL,
    bp_content TEXT NOT NULL,
    bp_excerpt VARCHAR(500) NOT NULL,
    bp_category VARCHAR(100) NOT NULL,
    bp_author VARCHAR(100) NOT NULL,
    bp_read_time VARCHAR(50) NOT NULL,
    bp_slug VARCHAR(255) UNIQUE NOT NULL,
    bp_image_url VARCHAR(500) DEFAULT NULL,
    bp_published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Prompts table
CREATE TABLE IF NOT EXISTS saved_prompts (
    sp_id SERIAL PRIMARY KEY,
    sp_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    sp_prompt_id INTEGER REFERENCES prompt_collections(pc_id) ON DELETE CASCADE,
    sp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sp_user_id, sp_prompt_id)
);

-- User Limits table
CREATE TABLE IF NOT EXISTS user_limits (
    ul_id SERIAL PRIMARY KEY,
    ul_user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    ul_limit_count INTEGER DEFAULT 20,
    ul_used_count INTEGER DEFAULT 0,
    ul_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day'
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    ak_id SERIAL PRIMARY KEY,
    ak_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ak_key VARCHAR(255) UNIQUE NOT NULL,
    ak_is_active BOOLEAN DEFAULT TRUE,
    ak_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
    ae_id BIGSERIAL PRIMARY KEY,
    ae_event_type VARCHAR(50) NOT NULL,
    ae_target_id VARCHAR(255) DEFAULT NULL,
    ae_ip VARCHAR(45) DEFAULT NULL,
    ae_metadata JSONB DEFAULT '{}'::jsonb,
    ae_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- NEW SEO TABLES (v2)
-- =====================================================================

-- Tags index table — powers /tags/[tag-slug] SEO pages
CREATE TABLE IF NOT EXISTS prompt_tags (
    pt_id SERIAL PRIMARY KEY,
    pt_slug VARCHAR(100) UNIQUE NOT NULL,
    pt_name VARCHAR(100) NOT NULL,
    pt_count INTEGER DEFAULT 0,
    pt_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Per-prompt daily analytics — granular insight for admin dashboard
CREATE TABLE IF NOT EXISTS prompt_analytics (
    pa_id BIGSERIAL PRIMARY KEY,
    pa_prompt_id INTEGER REFERENCES prompt_collections(pc_id) ON DELETE CASCADE,
    pa_date DATE NOT NULL,
    pa_views INTEGER DEFAULT 0,
    pa_copies INTEGER DEFAULT 0,
    pa_shares INTEGER DEFAULT 0,
    pa_runs INTEGER DEFAULT 0,
    UNIQUE (pa_prompt_id, pa_date)
);

CREATE INDEX IF NOT EXISTS idx_pa_prompt_date ON prompt_analytics(pa_prompt_id, pa_date DESC);
