-- Drop existing tables cascading to refresh schema
DROP TABLE IF EXISTS users, admins, settings, ai_models, prompt_collections, blog_posts, saved_prompts, user_limits, api_keys, analytics_events CASCADE;

-- Users table (no prefix)
CREATE TABLE users (
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

-- Settings table (set_ prefix)
CREATE TABLE settings (
    set_key VARCHAR(50) PRIMARY KEY,
    set_value TEXT NOT NULL
);

-- AI Models table (am_ prefix)
CREATE TABLE ai_models (
    am_id SERIAL PRIMARY KEY,
    am_name VARCHAR(100) NOT NULL,
    am_provider VARCHAR(50) NOT NULL,
    am_api_model_code VARCHAR(100) NOT NULL,
    am_is_active BOOLEAN DEFAULT TRUE,
    am_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompt Collections table (pc_ prefix)
CREATE TABLE prompt_collections (
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

-- Blog Posts table (bp_ prefix)
CREATE TABLE blog_posts (
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

-- Saved Prompts table (sp_ prefix)
CREATE TABLE saved_prompts (
    sp_id SERIAL PRIMARY KEY,
    sp_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    sp_prompt_id INTEGER REFERENCES prompt_collections(pc_id) ON DELETE CASCADE,
    sp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sp_user_id, sp_prompt_id)
);

-- User Limits table (ul_ prefix)
CREATE TABLE user_limits (
    ul_id SERIAL PRIMARY KEY,
    ul_user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    ul_limit_count INTEGER DEFAULT 20,
    ul_used_count INTEGER DEFAULT 0,
    ul_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day'
);

-- API Keys table (ak_ prefix)
CREATE TABLE api_keys (
    ak_id SERIAL PRIMARY KEY,
    ak_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ak_key VARCHAR(255) UNIQUE NOT NULL,
    ak_is_active BOOLEAN DEFAULT TRUE,
    ak_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events table (ae_ prefix)
CREATE TABLE analytics_events (
    ae_id BIGSERIAL PRIMARY KEY,
    ae_event_type VARCHAR(50) NOT NULL,
    ae_target_id VARCHAR(255) DEFAULT NULL,
    ae_ip VARCHAR(45) DEFAULT NULL,
    ae_metadata JSONB DEFAULT '{}'::jsonb,
    ae_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
