/**
 * /sitemap-index.xml — Master sitemap index
 * References all child sitemaps. Submitted to Google Search Console.
 * Scales automatically as prompt count grows.
 */

const BASE_URL = 'https://aiprompt.revoxera.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  // Get total prompt count to determine how many paginated prompt sitemaps we need
  let totalPrompts = 0;
  try {
    const res = await fetch(`${API_URL}/api/prompt-collections/sitemap?page=1&limit=1`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const json = await res.json();
      totalPrompts = json.data?.total || 0;
    }
  } catch {}

  const PROMPTS_PER_SITEMAP = 1000;
  const promptSitemapCount = Math.max(1, Math.ceil(totalPrompts / PROMPTS_PER_SITEMAP));
  const now = new Date().toISOString();

  const sitemaps = [
    // Static pages sitemap
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/static</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    // Categories sitemap
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/categories</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    // Guides sitemap (blog posts used as guides)
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/guides</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    // Templates sitemap
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/templates</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    // Examples sitemap
    `  <sitemap>
    <loc>${BASE_URL}/sitemaps/examples</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    // Paginated prompt sitemaps
    ...Array.from({ length: promptSitemapCount }, (_, i) =>
      `  <sitemap>
    <loc>${BASE_URL}/sitemaps/prompts/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
