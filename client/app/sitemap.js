import { clientApi } from './utils/clientApi';
import { TEMPLATES } from './utils/templates';

// Ensure this sitemap is rendered dynamically on request
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://aiprompt.revoxera.com';

  // 1. Static Core Pages
  const staticRoutes = [
    '',
    '/generator',
    '/prompt-collections',
    '/blog',
    '/about',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
    '/cookie-policy',
    '/refund-policy',
    '/docs',
    '/changelog',
    '/careers',
    '/press',
    '/community',
    '/api-reference',
    '/templates',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Blog Routes
  let blogRoutes = [];
  try {
    const blogs = await clientApi.fetchBlogs();
    if (Array.isArray(blogs)) {
      blogRoutes = blogs.map((post) => ({
        url: `${baseUrl}/blog/${post.slug || post.bp_slug}`,
        lastModified: new Date(post.published_at || post.bp_published_at || new Date()).toISOString().split('T')[0],
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error('Sitemap Generator: Failed to fetch blog routes:', err);
  }

  // 3. Dynamic Prompt Category Routes
  // Aggregate categories from templates and database collections
  const uniqueCategories = new Set(TEMPLATES.map(t => t.category));
  let collections = [];
  try {
    collections = await clientApi.fetchCollections();
    if (Array.isArray(collections)) {
      collections.forEach((c) => {
        if (c.category) {
          uniqueCategories.add(c.category);
        }
      });
    }
  } catch (err) {
    console.error('Sitemap Generator: Failed to fetch collections for categories:', err);
  }

  const categoryRoutes = Array.from(uniqueCategories).map((cat) => {
    const slug = `${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompts`;
    return {
      url: `${baseUrl}/${slug}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily',
      priority: 0.7,
    };
  });

  // 4. Dynamic Prompt Detail Routes
  const detailRoutes = collections.map((item) => {
    const cat = item.category || 'general';
    const catSlug = `${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompts`;
    return {
      url: `${baseUrl}/${catSlug}/${item.id || item.pc_id}`,
      lastModified: new Date(item.created_at || item.pc_created_at || new Date()).toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...detailRoutes];
}
