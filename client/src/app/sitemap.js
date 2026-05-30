/**
 * sitemap.js — Next.js built-in sitemap (kept for compatibility)
 * 
 * Note: The primary sitemap architecture uses the sitemap index pattern:
 *   /sitemap-index.xml  → Master index (submit this to Google Search Console)
 *   /sitemap/static.xml → Static pages
 *   /sitemap/categories.xml → Category pages
 *   /sitemap/guides.xml → Blog/guide posts
 *   /sitemap/templates.xml → Template prompts
 *   /sitemap/examples.xml → Example prompts
 *   /sitemap/prompts/[page].xml → Paginated prompt pages (1000 per file)
 * 
 * This file generates a lightweight compatibility sitemap pointing to the
 * index and key surfaces, for tools that only read /sitemap.xml.
 */

const BASE_URL = 'https://aiprompt.revoxera.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function sitemap() {
  // Fetch prompts for dynamic URLs
  let collections = [];
  try {
    const res = await fetch(`${API_URL}/api/prompt-collections/sitemap?page=1&limit=500`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const json = await res.json();
      collections = json.data?.slugs || [];
    }
  } catch {}

  // Fetch blog posts
  let blogs = [];
  try {
    const res = await fetch(`${API_URL}/api/blog-posts`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      blogs = json.data || json || [];
    }
  } catch {}

  const now = new Date();

  const staticRoutes = [
    '', '/generator', '/prompt-collections', '/templates', '/examples',
    '/guides', '/blog', '/about', '/pricing', '/contact',
    '/careers', '/changelog', '/docs', '/api-reference', '/compare', '/community',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryRoutes = [
    'chatgpt-prompts', 'claude-prompts', 'gemini-prompts',
    'coding-prompts', 'seo-prompts', 'marketing-prompts',
    'business-prompts', 'image-prompts', 'video-prompts',
  ].map(cat => ({
    url: `${BASE_URL}/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const promptRoutes = collections.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/prompt/${slug}`,
    lastModified: updated_at ? new Date(updated_at) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogRoutes = blogs.map(post => ({
    url: `${BASE_URL}/blog/${post.slug || post.bp_slug}`,
    lastModified: new Date(post.bp_published_at || post.published_at || now),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...promptRoutes, ...blogRoutes];
}
