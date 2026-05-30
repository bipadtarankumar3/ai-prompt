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