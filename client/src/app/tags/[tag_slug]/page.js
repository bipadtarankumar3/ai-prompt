import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowRight, Tag } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://aiprompt.revoxera.com';

export async function generateMetadata({ params }) {
  const { tag_slug } = await params;
  const tagName = tag_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `${tagName} AI Prompts — Browse Prompts Tagged "${tagName}"`,
    description: `Discover AI prompts tagged with "${tagName}". Browse ${tagName} prompt templates and examples for ChatGPT, Claude, Gemini, and other AI models.`,
    keywords: [`${tagName} prompts`, `${tagName} AI prompts`, `${tagName} prompt templates`, 'AI prompt tags'],
    alternates: { canonical: `${BASE_URL}/tags/${tag_slug}` },
    openGraph: {
      title: `${tagName} AI Prompts | Revoxera AI`,
      description: `Browse AI prompts tagged with "${tagName}".`,
      url: `${BASE_URL}/tags/${tag_slug}`,
      siteName: 'Revoxera AI',
      type: 'website',
    },
  };
}

export default async function TagPage({ params, searchParams }) {
  const { tag_slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1', 10);
  const tagName = tag_slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  let prompts = [];
  let total = 0;
  let totalPages = 1;

  try {
    const res = await fetch(
      `${API_URL}/api/prompt-collections/tag/${encodeURIComponent(tag_slug)}?page=${page}&limit=12`,
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const json = await res.json();
      const result = json.data || json;
      prompts = result.data || [];
      total = result.total || 0;
      totalPages = result.totalPages || 1;
    }
  } catch (err) {
    console.error(`[TagPage] SSR fetch failed for tag: ${tag_slug}`, err);
  }

  // If tag doesn't exist or has no prompts, show 404
  if (prompts.length === 0 && page === 1) {
    notFound();
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tags', item: `${BASE_URL}/tags` },
      { '@type': 'ListItem', position: 3, name: tagName, item: `${BASE_URL}/tags/${tag_slug}` },
    ],
  };

  return (
    <main className="min-h-screen hero-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />

      <div className="mt-16 md:mt-20 py-20 px-4 container relative">
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40 font-medium mb-10">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/prompt-collections" className="hover:text-amber-400 transition-colors">Prompts</Link>
            <span>/</span>
            <span className="text-white/60">#{tag_slug}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Tag size={20} className="text-amber-400" />
              <span className="text-xs font-mono text-white/40">#{tag_slug}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              <span className="gradient-text">{tagName}</span> AI Prompts
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
              Browse {total} AI prompt{total !== 1 ? 's' : ''} tagged with "{tagName}". Discover templates, examples, and professional prompts for your workflows.
            </p>
          </header>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {prompts.map(item => (
              <Link key={item.id} href={`/prompt/${item.slug}`}>
                <article className="glass-card p-5 h-full flex flex-col hover:border-amber-500/25 transition-all duration-300 card-hover group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-mono text-white/30">{item.copy_count} copies</span>
                  </div>

                  <h2 className="text-xs font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 flex-1 mb-3">
                    {item.description}
                  </p>

                  {/* Other tags on this prompt */}
                  {Array.isArray(item.tags) && item.tags.filter(t => t !== tag_slug).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.filter(t => t !== tag_slug).slice(0, 3).map(t => (
                        <Link
                          key={t}
                          href={`/tags/${t}`}
                          onClick={e => e.stopPropagation()}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/40 hover:text-white/70 transition-colors font-mono"
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-amber-400/70 text-[10px] font-medium pt-3 border-t border-white/5 mt-auto">
                    <ArrowRight size={10} />
                    <span>View Prompt</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Tag page pagination" className="flex justify-center gap-3">
              {page > 1 && (
                <Link href={`/tags/${tag_slug}?page=${page - 1}`}
                  className="px-4 py-2 glass-card text-xs text-white/70 hover:text-white transition-colors">
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-xs text-white/40">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/tags/${tag_slug}?page=${page + 1}`}
                  className="px-4 py-2 glass-card text-xs text-white/70 hover:text-white transition-colors">
                  Next →
                </Link>
              )}
            </nav>
          )}

          {/* Explore Links */}
          <section aria-label="Explore more" className="mt-16 pt-10 border-t border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Explore by Category</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {['chatgpt-prompts', 'claude-prompts', 'coding-prompts', 'seo-prompts', 'image-prompts'].map(slug => (
                <Link key={slug} href={`/${slug}`}>
                  <div className="glass-card p-3 text-center hover:border-amber-500/20 transition-all">
                    <span className="text-[10px] font-semibold text-white/60 hover:text-white capitalize">
                      {slug.replace('-prompts', '')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
