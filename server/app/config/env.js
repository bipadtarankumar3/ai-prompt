const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env in the server folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'ai_prompts'
  },
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtsecret123!',
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  hfToken: process.env.HF_TOKEN,
  maxChatHistoryLimit: parseInt(process.env.MAX_CHAT_HISTORY_LIMIT || '5', 10)
};
