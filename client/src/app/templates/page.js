import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Copy, ExternalLink, Sparkles, Terminal, BookOpen } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://aiprompt.revoxera.com';

export const metadata = {
  title: 'AI Prompt Templates — Copy-Ready Templates for ChatGPT, Claude & More',
  description: 'Browse our library of production-ready AI prompt templates. Structured, variable-driven templates for ChatGPT, Claude, Gemini, Midjourney, and professional workflows. Free to copy.',
  keywords: ['AI prompt templates', 'ChatGPT templates', 'prompt template library', 'AI templates', 'prompt engineering templates', 'copy paste AI templates'],
  alternates: { canonical: `${BASE_URL}/templates` },
  openGraph: {
    title: 'AI Prompt Templates — Revoxera AI',
    description: 'Production-ready prompt templates for all AI models. Copy and customize instantly.',
    url: `${BASE_URL}/templates`,
    siteName: 'Revoxera AI',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'AI Prompt Templates' }],
  },
};

const CATEGORY_FILTERS = ['All', 'ChatGPT', 'Claude', 'Gemini', 'Coding', 'SEO', 'Marketing', 'Business', 'Image', 'Video'];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Templates', item: `${BASE_URL}/templates` },
  ],
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Prompt Templates — Revoxera AI',
  description: 'Structured, variable-driven AI prompt templates for professional workflows.',
  url: `${BASE_URL}/templates`,
};

/**
 * Extracts unique [VARIABLE] placeholders from prompt text.
 * @param {string} text - The prompt text containing variables
 * @returns {string[]} Array of unique variable names
 */
function extractVariables(text) {
  if (!text) return [];
  const matches = text.match(/\[[A-Z_]+\]/g) || [];
  return [...new Set(matches)];
}

export default async function TemplatesPage({ searchParams }) {
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1', 10);
  const category = sp?.category || '';

  let templates = [];
  let total = 0;
  let totalPages = 1;

  try {
    // Fetch templates (pc_type = 'template') OR fall back to all prompts
    const params = new URLSearchParams({ page, limit: 18 });
    const res = await fetch(`${API_URL}/api/prompt-collections/type/template?${params}`, {
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const json = await res.json();
      const result = json.data || json;
      templates = result.data || [];
      total = result.total || 0;
      totalPages = result.totalPages || 1;
    }

    // If no templates in DB yet, fall back to all prompts
    if (templates.length === 0) {
      const fallback = await fetch(`${API_URL}/api/prompt-collections?limit=18&page=${page}`, {
        next: { revalidate: 300 }
      });
      if (fallback.ok) {
        const json = await fallback.json();
        templates = json.data || [];
        total = templates.length;
      }
    }
  } catch (err) {
    console.error('[TemplatesPage] SSR fetch failed:', err);
  }

  // Apply category filter if provided
  if (category && category !== 'All') {
    templates = templates.filter(t => t.category?.toLowerCase() === category.toLowerCase());
  }

  return (
    <main className="min-h-screen hero-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <Navbar />

      <div className="mt-16 md:mt-20 py-20 px-4 container relative">
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40 font-medium mb-10">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Templates</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-14">
            <p className="section-label mb-3">Template Library</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5">
              AI Prompt <span className="gradient-text">Templates</span>
            </h1>
            <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed">
              Structured, variable-driven prompt templates for professional AI workflows. Each template uses <code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono text-xs">[VARIABLE]</code> placeholders for easy customization. Copy and adapt instantly.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/30 font-medium">
              <span>✦ {total > 0 ? total + '+' : ''} Templates</span>
              <span>✦ Variable-Driven</span>
              <span>✦ Free to Copy</span>
            </div>
          </header>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORY_FILTERS.map(cat => (
              <Link
                key={cat}
                href={cat === 'All' ? '/templates' : `/templates?category=${cat}`}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  (category === cat || (cat === 'All' && !category))
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Templates Grid */}
          {templates.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-white/60">No templates found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(item => (
                <Link key={item.id} href={`/prompt/${item.slug}`}>
                  <article className="glass-card p-6 h-full flex flex-col hover:border-amber-500/25 transition-all duration-300 card-hover group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                        {item.category}
                      </span>
                      <span className="text-[9px] font-mono text-white/30">{item.copy_count?.toLocaleString()} uses</span>
                    </div>

                    <h2 className="text-sm font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Variable count badge */}
                    {(() => {
                      const vars = extractVariables(item.prompt_text);
                      if (vars.length === 0) return null;
                      
                      return (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {vars.slice(0, 3).map(v => (
                            <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/15 text-violet-400 font-mono">
                              {v}
                            </span>
                          ))}
                          {vars.length > 3 && (
                            <span className="text-[9px] text-white/30">+{vars.length - 3} more</span>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-2 text-amber-400/70 text-[10px] font-medium mt-auto pt-3 border-t border-white/5">
                      <ArrowRight size={11} />
                      <span>Use Template</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Templates pagination" className="flex justify-center gap-3 mt-12">
              {page > 1 && (
                <Link href={`/templates?page=${page - 1}${category ? `&category=${category}` : ''}`}
                  className="px-4 py-2 glass-card text-xs text-white/70 hover:text-white transition-colors">
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-xs text-white/40">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/templates?page=${page + 1}${category ? `&category=${category}` : ''}`}
                  className="px-4 py-2 glass-card text-xs text-white/70 hover:text-white transition-colors">
                  Next →
                </Link>
              )}
            </nav>
          )}

          {/* Related Links */}
          <section aria-label="Explore more" className="mt-20 pt-10 border-t border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/examples', label: 'Prompt Examples' },
                { href: '/guides', label: 'AI Guides' },
                { href: '/chatgpt-prompts', label: 'ChatGPT Prompts' },
                { href: '/generator', label: 'AI Generator' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}>
                  <div className="glass-card p-4 hover:border-amber-500/20 transition-all group flex items-center justify-between">
                    <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{label}</span>
                    <ArrowRight size={12} className="text-white/30 group-hover:text-amber-400 transition-colors" />
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
