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