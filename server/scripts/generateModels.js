const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../app/models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const models = {
  'User.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  email_verified_at: { type: DataTypes.DATE, defaultValue: null },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.STRING(50), defaultValue: 'user' },
  remember_token: { type: DataTypes.STRING(100), defaultValue: null },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
`,
  'Setting.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  set_key: { type: DataTypes.STRING(50), primaryKey: true },
  set_value: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Setting;
`,
  'AiModel.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AiModel = sequelize.define('AiModel', {
  am_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  am_name: { type: DataTypes.STRING(100), allowNull: false },
  am_provider: { type: DataTypes.STRING(50), allowNull: false },
  am_api_model_code: { type: DataTypes.STRING(100), allowNull: false },
  am_is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'ai_models',
  timestamps: true,
  createdAt: 'am_created_at',
  updatedAt: false
});

module.exports = AiModel;
`,
  'PromptCollection.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PromptCollection = sequelize.define('PromptCollection', {
  pc_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pc_slug: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  pc_title: { type: DataTypes.STRING(255), allowNull: false },
  pc_prompt_text: { type: DataTypes.TEXT, allowNull: false },
  pc_category: { type: DataTypes.STRING(100), allowNull: false },
  pc_description: { type: DataTypes.TEXT },
  pc_example_inputs: { type: DataTypes.TEXT },
  pc_example_outputs: { type: DataTypes.TEXT },
  pc_use_cases: { type: DataTypes.JSONB, defaultValue: [] },
  pc_faqs: { type: DataTypes.JSONB, defaultValue: [] },
  pc_tags: { type: DataTypes.JSONB, defaultValue: [] },
  pc_variations: { type: DataTypes.JSONB, defaultValue: [] },
  pc_copy_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  pc_view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  pc_is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  pc_is_premium: { type: DataTypes.BOOLEAN, defaultValue: false },
  pc_type: { type: DataTypes.STRING(20), defaultValue: 'prompt' },
  pc_ai_model_target: { type: DataTypes.STRING(50) },
  pc_difficulty: { type: DataTypes.STRING(20), defaultValue: 'beginner' },
  pc_meta_title: { type: DataTypes.STRING(70) },
  pc_meta_description: { type: DataTypes.STRING(165) },
}, {
  tableName: 'prompt_collections',
  timestamps: true,
  createdAt: 'pc_created_at',
  updatedAt: 'pc_updated_at'
});

module.exports = PromptCollection;
`,
  'BlogPost.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
  bp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bp_title: { type: DataTypes.STRING(255), allowNull: false },
  bp_content: { type: DataTypes.TEXT, allowNull: false },
  bp_excerpt: { type: DataTypes.STRING(500), allowNull: false },
  bp_category: { type: DataTypes.STRING(100), allowNull: false },
  bp_author: { type: DataTypes.STRING(100), allowNull: false },
  bp_read_time: { type: DataTypes.STRING(50), allowNull: false },
  bp_slug: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  bp_image_url: { type: DataTypes.STRING(500) },
  bp_published_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'blog_posts',
  timestamps: true,
  createdAt: 'bp_created_at',
  updatedAt: false
});

module.exports = BlogPost;
`,
  'SavedPrompt.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SavedPrompt = sequelize.define('SavedPrompt', {
  sp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sp_user_id: { type: DataTypes.BIGINT, allowNull: false },
  sp_prompt_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'saved_prompts',
  timestamps: true,
  createdAt: 'sp_created_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['sp_user_id', 'sp_prompt_id'] }]
});

module.exports = SavedPrompt;
`,
  'UserLimit.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLimit = sequelize.define('UserLimit', {
  ul_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ul_user_id: { type: DataTypes.BIGINT, unique: true, allowNull: false },
  ul_limit_count: { type: DataTypes.INTEGER, defaultValue: 20 },
  ul_used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  ul_reset_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("CURRENT_TIMESTAMP + INTERVAL '1 day'") },
}, {
  tableName: 'user_limits',
  timestamps: false
});

module.exports = UserLimit;
`,
  'ApiKey.js': `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
  ak_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ak_user_id: { type: DataTypes.BIGINT, allowNull: false },
  ak_key: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  ak_is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'api_keys',
  timestamps: true,
  createdAt: 'ak_created_at',
  updatedAt: false
});

module.exports = ApiKey;
`,
  'index.js': `
const { sequelize } = require('../config/database');

const User = require('./User');
const Setting = require('./Setting');
const AiModel = require('./AiModel');
const PromptCollection = require('./PromptCollection');
const BlogPost = require('./BlogPost');
const SavedPrompt = require('./SavedPrompt');
const UserLimit = require('./UserLimit');
const ApiKey = require('./ApiKey');

// Associations
User.hasMany(SavedPrompt, { foreignKey: 'sp_user_id', onDelete: 'CASCADE' });
SavedPrompt.belongsTo(User, { foreignKey: 'sp_user_id' });

PromptCollection.hasMany(SavedPrompt, { foreignKey: 'sp_prompt_id', onDelete: 'CASCADE' });
SavedPrompt.belongsTo(PromptCollection, { foreignKey: 'sp_prompt_id' });

User.hasOne(UserLimit, { foreignKey: 'ul_user_id', onDelete: 'CASCADE' });
UserLimit.belongsTo(User, { foreignKey: 'ul_user_id' });

User.hasMany(ApiKey, { foreignKey: 'ak_user_id', onDelete: 'CASCADE' });
ApiKey.belongsTo(User, { foreignKey: 'ak_user_id' });

module.exports = {
  sequelize,
  User,
  Setting,
  AiModel,
  PromptCollection,
  BlogPost,
  SavedPrompt,
  UserLimit,
  ApiKey
};
`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content.trim());
  console.log('Created model:', filename);
}
console.log('All models created successfully.');
