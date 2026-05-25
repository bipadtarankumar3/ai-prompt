const blogService = require('../services/blog.service');
const { success, error } = require('../helpers/response.helper');

class BlogController {
  async getAll(req, res, next) {
    try {
      const blogs = await blogService.getAllBlogs();
      return success(res, blogs, 'Blog posts fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      return success(res, blog, 'Blog post fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug);
      return success(res, blog, 'Blog post fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const blog = await blogService.createBlog(req.body);
      return success(res, blog, 'Blog post created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);
      return success(res, blog, 'Blog post updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await blogService.deleteBlog(req.params.id);
      return success(res, { id: req.params.id }, 'Blog post deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BlogController();
