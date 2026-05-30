import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Terminal, CheckCircle, ArrowRightLeft, BookOpen } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://aiprompt.revoxera.com';

export const metadata = {
  title: 'AI Prompt Examples — Real Input & Output Examples for AI Models',
  description: 'See real-world AI prompt examples with actual inputs and expected outputs for ChatGPT, Claude, Gemini, Midjourney, and more. Learn by example, copy instantly.',
  keywords: ['AI prompt examples', 'ChatGPT examples', 'prompt input output examples', 'AI prompt output', 'prompt engineering examples'],
  alternates: { canonical: `${BASE_URL}/examples` },
  openGraph: {
    title: 'AI Prompt Examples — Input & Output Showcase | Revoxera AI',
    description: 'Real AI prompt examples showing exact inputs and expected outputs. Learn from the best.',
    url: `${BASE_URL}/examples`,
    siteName: 'Revoxera AI',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'AI Prompt Examples' }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Examples', item: `${BASE_URL}/examples` },
  ],
};

export default async function ExamplesPage() {
  // Fetch prompts that have both example_inputs and example_outputs
  let examples = [];

  try {
    const res = await fetch(`${API_URL}/api/prompt-collections`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      const all = json.data || json || [];
      // Filter to prompts that have examples (the "input → output" showcase)
      examples = all.filter(p => p.example_inputs && p.example_outputs);
    }
  } catch (err) {
    console.error('[ExamplesPage] SSR fetch failed:', err);
  }

  return (
    <main className="min-h-screen hero-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />

      <div className="mt-16 md:mt-20 py-20 px-4 container relative">
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40 font-medium mb-10">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/60">Examples</span>
          </nav>

          {/* Header */}
          <header className="text-center mb-14">
            <p className="section-label mb-3">Learn by Example</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-5">
              AI Prompt <span className="gradient-text">Examples</span>
            </h1>
            <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed">
              Real-world AI prompt examples showing exact variable inputs and the quality output you can expect. Learn how to structure prompts by studying proven examples.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/30 font-medium">
              <span>✦ Input → Output Format</span>
              <span>✦ Verified Examples</span>
              <span>✦ Copy Instantly</span>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-14">
            {[
              { label: 'Total Examples', value: examples.length + '+' },
              { label: 'AI Models Covered', value: '7+' },
              { label: 'Categories', value: '9' },
            ].map(({ label, value }) => (
              <div key={label} className="glass-card p-5 text-center">
                <div className="text-2xl font-extrabold text-amber-400 mb-1">{value}</div>
                <div className="text-xs text-white/40 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Examples List */}
          {examples.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-white/60">Examples coming soon.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {examples.map(item => (
                <article key={item.id} className="glass-card overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                          {item.category}
                        </span>
                        <ArrowRightLeft size={12} className="text-white/20" />
                        <span className="text-[10px] text-white/30 font-medium">Input → Output Example</span>
                      </div>
                      <Link href={`/prompt/${item.slug}`}>
                        <h2 className="text-base font-bold text-white hover:text-amber-300 transition-colors cursor-pointer">
                          {item.title}
                        </h2>
                      </Link>
                    </div>
                    <Link
                      href={`/prompt/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                    >
                      Full Prompt <ArrowRight size={10} />
                    </Link>
                  </div>

                  {/* Input / Output side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-5 border-r border-b md:border-b-0 border-white/5">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Example Input Variables
                      </div>
                      <pre className="bg-black/20 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 border border-white/5 whitespace-pre-wrap overflow-x-auto">
                        {item.example_inputs}
                      </pre>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Expected Quality Output
                      </div>
                      <pre className="bg-black/20 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-350 border border-white/5 whitespace-pre-wrap overflow-x-auto max-h-48">
                        {item.example_outputs}
                      </pre>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(item.tags) && item.tags.slice(0, 4).map(tag => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/prompt/${item.slug}`}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      Copy Prompt <ArrowRight size={10} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Internal Links */}
          <section aria-label="Explore more" className="mt-20 pt-10 border-t border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { href: '/templates', label: 'Prompt Templates' },
                { href: '/guides', label: 'AI Guides' },
                { href: '/prompt-collections', label: 'All Prompts' },
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
