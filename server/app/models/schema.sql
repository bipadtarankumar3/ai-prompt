-- Drop existing tables cascading to refresh schema
DROP TABLE IF EXISTS users, admins, settings, ai_models, prompt_collections, blog_posts CASCADE;

-- Users table (no prefix)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
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
    pc_title VARCHAR(255) NOT NULL,
    pc_prompt_text TEXT NOT NULL,
    pc_category VARCHAR(100) NOT NULL,
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
