/**
 * /sitemaps/[type].xml — Named sitemaps for static pages, categories, guides, templates, examples
 * Dynamic route: type = static | categories | guides | templates | examples
 *
 * Moved from /sitemap/[type] to /sitemaps/[type] to avoid conflict with
 * Next.js reserved "sitemap" metadata route (uses __metadata_id__ internally).
 */

const BASE_URL = 'https://aiprompt.revoxera.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function buildXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

const STATIC_ROUTES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/generator', priority: '0.9', changefreq: 'weekly' },
  { path: '/prompt-collections', priority: '0.9', changefreq: 'daily' },
  { path: '/templates', priority: '0.8', changefreq: 'daily' },
  { path: '/examples', priority: '0.8', changefreq: 'daily' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/careers', priority: '0.5', changefreq: 'monthly' },
  { path: '/changelog', priority: '0.6', changefreq: 'weekly' },
  { path: '/docs', priority: '0.7', changefreq: 'weekly' },
  { path: '/api-reference', priority: '0.7', changefreq: 'weekly' },
  { path: '/compare', priority: '0.6', changefreq: 'monthly' },
  { path: '/community', priority: '0.5', changefreq: 'weekly' },
];

const CATEGORY_ROUTES = [
  'chatgpt-prompts', 'claude-prompts', 'gemini-prompts',
  'coding-prompts', 'seo-prompts', 'marketing-prompts',
  'business-prompts', 'image-prompts', 'video-prompts',
];

export async function GET(request, { params }) {
  const { type } = await params;
  const now = new Date().toISOString();
  let xml;

  switch (type.replace('.xml', '')) {
    case 'static': {
      const urls = STATIC_ROUTES.map(({ path, priority, changefreq }) => ({
        url: `${BASE_URL}${path}`,
        lastmod: now,
        changefreq,
        priority,
      }));
      xml = buildXml(urls);
      break;
    }

    case 'categories': {
      const urls = CATEGORY_ROUTES.map(slug => ({
        url: `${BASE_URL}/${slug}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.8',
      }));
      xml = buildXml(urls);
      break;
    }

    case 'guides': {
      let blogs = [];
      try {
        const res = await fetch(`${API_URL}/api/blog-posts`, { next: { revalidate: 3600 } });
        if (res.ok) {
          const json = await res.json();
          blogs = json.data || json || [];
        }
      } catch {}
      const urls = blogs.map(post => ({
        url: `${BASE_URL}/blog/${post.slug || post.bp_slug}`,
        lastmod: new Date(post.bp_published_at || post.published_at || now).toISOString(),
        changefreq: 'monthly',
        priority: '0.6',
      }));
      xml = buildXml(urls.length ? urls : [{ url: `${BASE_URL}/guides`, lastmod: now, changefreq: 'weekly', priority: '0.7' }]);
      break;
    }

    case 'templates': {
      let items = [];
      try {
        const res = await fetch(`${API_URL}/api/prompt-collections/type/template?limit=1000`, { next: { revalidate: 3600 } });
        if (res.ok) {
          const json = await res.json();
          items = json.data?.data || json.data || [];
        }
      } catch {}
      const urls = items.map(item => ({
        url: `${BASE_URL}/prompt/${item.slug}`,
        lastmod: new Date(item.updated_at || item.created_at || now).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      }));
      xml = buildXml(urls.length ? urls : [{ url: `${BASE_URL}/templates`, lastmod: now, changefreq: 'weekly', priority: '0.8' }]);
      break;
    }

    case 'examples': {
      let items = [];
      try {
        const res = await fetch(`${API_URL}/api/prompt-collections/type/example?limit=1000`, { next: { revalidate: 3600 } });
        if (res.ok) {
          const json = await res.json();
          items = json.data?.data || json.data || [];
        }
      } catch {}
      const urls = items.map(item => ({
        url: `${BASE_URL}/prompt/${item.slug}`,
        lastmod: new Date(item.updated_at || item.created_at || now).toISOString(),
        changefreq: 'monthly',
        priority: '0.7',
      }));
      xml = buildXml(urls.length ? urls : [{ url: `${BASE_URL}/examples`, lastmod: now, changefreq: 'weekly', priority: '0.8' }]);
      break;
    }

    default:
      return new Response('Not Found', { status: 404 });
  }

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
