const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function sitemap() {
  const baseUrl = 'https://aiprompt.revoxera.com';

  // 1. Fetch prompt collections to generate dynamic URLs
  let collections = [];
  try {
    const res = await fetch(`${API_URL}/api/prompt-collections`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      collections = data.data || data || [];
    }
  } catch (err) {
    console.error('Sitemap generator failed to fetch collections:', err);
  }

  // 2. Fetch blog posts to generate dynamic URLs
  let blogs = [];
  try {
    const res = await fetch(`${API_URL}/api/blog-posts`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      blogs = data.data || data || [];
    }
  } catch (err) {
    console.error('Sitemap generator failed to fetch blog posts:', err);
  }

  // 3. Static main pages
  const staticRoutes = [
    '',
    '/generator',
    '/prompt-collections',
    '/blog',
    '/about',
    '/pricing',
    '/contact',
    '/careers',
    '/changelog',
    '/docs',
    '/api-reference',
    '/templates',
    '/compare',
    '/dashboard',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 4. Category Pages
  const categories = [
    'chatgpt-prompts',
    'claude-prompts',
    'gemini-prompts',
    'coding-prompts',
    'seo-prompts',
    'marketing-prompts',
    'business-prompts',
    'image-prompts',
    'video-prompts'
  ].map(cat => ({
    url: `${baseUrl}/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 5. Dynamic Prompt Pages: /prompt/[slug]
  const promptRoutes = collections.map(item => ({
    url: `${baseUrl}/prompt/${item.slug || item.id}`,
    lastModified: new Date(item.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 6. Dynamic Blog Pages: /blog/[slug]
  const blogRoutes = blogs.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.bp_published_at || post.published_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categories, ...promptRoutes, ...blogRoutes];
}
