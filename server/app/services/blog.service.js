const blogRepository = require('../repositories/blog.repository');

class BlogService {
  async getAllBlogs() {
    return blogRepository.findAll();
  }

  async getBlogById(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw new Error('Blog post not found');
    return blog;
  }

  async getBlogBySlug(slug) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw new Error('Blog post not found');
    return blog;
  }

  async createBlog(data) {
    if (!data.title || !data.content || !data.excerpt || !data.category || !data.author) {
      throw new Error('Title, content, excerpt, category, and author are required');
    }
    
    // Automatically generate slug if not provided
    if (!data.slug) {
      data.slug = this.slugify(data.title);
    } else {
      data.slug = this.slugify(data.slug);
    }

    // Determine read time if not provided (e.g. ~200 words per min)
    if (!data.read_time) {
      const words = data.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      data.read_time = `${minutes} min read`;
    }

    return blogRepository.create(data);
  }

  async updateBlog(id, data) {
    await this.getBlogById(id);

    if (data.title && !data.slug) {
      data.slug = this.slugify(data.title);
    } else if (data.slug) {
      data.slug = this.slugify(data.slug);
    }

    if (data.content && !data.read_time) {
      const words = data.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200));
      data.read_time = `${minutes} min read`;
    }

    return blogRepository.update(id, data);
  }

  async deleteBlog(id) {
    await this.getBlogById(id);
    return blogRepository.delete(id);
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
}

module.exports = new BlogService();
