/**
 * /sitemaps/prompts/[page].xml — Paginated prompt sitemaps
 * 1000 prompts per sitemap file. Scales to millions.
 *
 * Moved from /sitemap/prompts/[page] to /sitemaps/prompts/[page] to avoid
 * conflict with Next.js reserved "sitemap" metadata route handling.
 */

const BASE_URL = 'https://aiprompt.revoxera.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const LIMIT = 1000;

export async function GET(request, { params }) {
  const { page } = await params;
  const pageNum = parseInt(page?.replace('.xml', ''), 10);

  if (isNaN(pageNum) || pageNum < 1) {
    return new Response('Invalid page', { status: 400 });
  }

  let slugs = [];
  try {
    const res = await fetch(
      `${API_URL}/api/prompt-collections/sitemap?page=${pageNum}&limit=${LIMIT}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      slugs = json.data?.slugs || [];
    }
  } catch (err) {
    console.error(`[PromptSitemap] Failed to fetch page ${pageNum}:`, err);
  }

  if (slugs.length === 0 && pageNum > 1) {
    return new Response('Not Found', { status: 404 });
  }

  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map(({ slug, updated_at }) => `  <url>
    <loc>${BASE_URL}/prompt/${slug}</loc>
    <lastmod>${updated_at ? new Date(updated_at).toISOString() : now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
