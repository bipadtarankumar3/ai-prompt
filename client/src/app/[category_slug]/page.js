import { notFound } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryPageClient from '../components/CategoryPageClient';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Star, Clock, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://aiprompt.revoxera.com';

// ── Category metadata map ────────────────────────────────────────────────────
const CATEGORY_META = {
  chatgpt: {
    displayName: 'ChatGPT',
    intro: 'Discover the most powerful ChatGPT prompts engineered by prompt experts. From professional email drafting to complex reasoning tasks, these templates are optimized for GPT-4o and GPT-4 Turbo to deliver consistent, high-quality outputs every time.',
    faqs: [
      { question: 'What are the best ChatGPT prompts for productivity?', answer: 'ChatGPT prompts for productivity typically include role-assignment instructions, structured output requirements, and specific tone/length constraints. Our library covers email writing, meeting summaries, task planning, and content creation workflows.' },
      { question: 'How do I write a ChatGPT system prompt?', answer: 'An effective system prompt assigns a clear role (e.g., "You are a senior marketing strategist"), defines the output format, specifies constraints, and includes examples. Browse our ChatGPT prompts library for professionally engineered templates.' },
      { question: 'Are these ChatGPT prompts compatible with GPT-4o?', answer: 'Yes. All prompts in our ChatGPT category are tested and optimized for GPT-4o, GPT-4 Turbo, and GPT-3.5 Turbo. They follow OpenAI prompt engineering best practices.' },
    ],
    relatedCategories: ['claude-prompts', 'coding-prompts', 'marketing-prompts'],
    relatedCategoryNames: ['Claude Prompts', 'Coding Prompts', 'Marketing Prompts'],
  },
  claude: {
    displayName: 'Claude',
    intro: 'Expert-engineered prompts for Anthropic Claude 3.5 Sonnet, Claude 3 Opus, and Claude Haiku. These templates leverage Claude\'s unique Constitutional AI and extended context window to produce reliable, nuanced outputs for complex analytical tasks.',
    faqs: [
      { question: 'What makes Claude prompts different from ChatGPT prompts?', answer: 'Claude responds especially well to XML-tagged output structures, explicit reasoning chains, and Constitutional AI alignment. Our Claude prompts use these unique capabilities for superior code generation, document analysis, and long-form writing.' },
      { question: 'Can I use these prompts with Claude Haiku?', answer: 'Yes. Most prompts in our Claude library are compatible across Claude models. Some complex reasoning templates perform best on Claude 3.5 Sonnet or Opus due to their superior instruction-following.' },
    ],
    relatedCategories: ['chatgpt-prompts', 'coding-prompts', 'business-prompts'],
    relatedCategoryNames: ['ChatGPT Prompts', 'Coding Prompts', 'Business Prompts'],
  },
  gemini: {
    displayName: 'Gemini',
    intro: 'Production-ready prompts for Google Gemini 1.5 Pro, Gemini 2.0 Flash, and Gemini Ultra. These templates are optimized for Gemini\'s multimodal capabilities, massive context windows, and Google-specific API parameters.',
    faqs: [
      { question: 'Do these prompts work with Gemini 2.0 Flash?', answer: 'Yes. Our Gemini prompts are tested with Gemini 1.5 Pro, 2.0 Flash, and 2.5 Pro. They leverage Gemini\'s extended context window for data analysis, document processing, and complex instruction following.' },
      { question: 'Can Gemini prompts handle JSON output?', answer: 'Absolutely. Google Gemini supports structured output formats including JSON. Our Gemini templates include explicit output structure instructions with examples for reliable parsing.' },
    ],
    relatedCategories: ['chatgpt-prompts', 'claude-prompts', 'image-prompts'],
    relatedCategoryNames: ['ChatGPT Prompts', 'Claude Prompts', 'Image Prompts'],
  },
  coding: {
    displayName: 'Coding',
    intro: 'Precision-crafted coding prompts for software engineers, data scientists, and DevOps engineers. From natural language SQL generation to architecture review templates, our coding prompts produce production-ready code with proper error handling, type safety, and documentation.',
    faqs: [
      { question: 'What programming languages do these coding prompts support?', answer: 'Our coding prompts support all major languages including Python, JavaScript/TypeScript, SQL, Go, Rust, Java, and C#. Each template specifies language and framework context for accurate code generation.' },
      { question: 'Can I use these prompts for code review?', answer: 'Yes. We have dedicated code review prompts that instruct AI to check for security vulnerabilities, performance bottlenecks, SOLID principles violations, and documentation gaps.' },
    ],
    relatedCategories: ['chatgpt-prompts', 'claude-prompts', 'business-prompts'],
    relatedCategoryNames: ['ChatGPT Prompts', 'Claude Prompts', 'Business Prompts'],
  },
  seo: {
    displayName: 'SEO',
    intro: 'Data-driven SEO prompts for content marketers, technical SEO specialists, and digital agencies. Generate high-CTR meta tags, keyword clusters, semantic content outlines, internal linking strategies, and schema markup instructions with battle-tested AI templates.',
    faqs: [
      { question: 'How do AI prompts help with SEO content creation?', answer: 'SEO-optimized AI prompts structure content briefs with target keywords, semantic variations, heading hierarchies, word count targets, and E-E-A-T signals. This produces content that ranks better by following proven SEO frameworks consistently.' },
      { question: 'Can these prompts generate meta descriptions that rank?', answer: 'Yes. Our SEO meta tag prompts generate title tags within 50-60 characters and meta descriptions within 150-160 characters, incorporating target keywords naturally while maintaining high CTR-driving emotional triggers.' },
    ],
    relatedCategories: ['marketing-prompts', 'business-prompts', 'chatgpt-prompts'],
    relatedCategoryNames: ['Marketing Prompts', 'Business Prompts', 'ChatGPT Prompts'],
  },
  marketing: {
    displayName: 'Marketing',
    intro: 'High-converting marketing prompts for growth marketers, copywriters, and brand strategists. Generate compelling ad copy, email sequences, landing page frameworks, social media campaigns, and conversion-optimized content using proven copywriting formulas.',
    faqs: [
      { question: 'What copywriting frameworks do these marketing prompts use?', answer: 'Our marketing prompts use proven frameworks including AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solve), Hook-Story-Offer, and Feature-Benefit-Proof. These systematic approaches produce higher conversion rates than generic prompts.' },
      { question: 'Are these prompts suitable for social media advertising?', answer: 'Yes. We have dedicated templates for Facebook Ads, Google Ads, LinkedIn sponsored content, and TikTok/Reels scripts. Each template includes platform-specific character limits and format guidelines.' },
    ],
    relatedCategories: ['seo-prompts', 'business-prompts', 'chatgpt-prompts'],
    relatedCategoryNames: ['SEO Prompts', 'Business Prompts', 'ChatGPT Prompts'],
  },
  business: {
    displayName: 'Business',
    intro: 'Strategic business prompts for executives, entrepreneurs, consultants, and analysts. Generate investor-ready pitch decks, financial reports, business plans, competitive analysis frameworks, and professional communications that demonstrate executive-level thinking.',
    faqs: [
      { question: 'Can AI prompts help with business plan creation?', answer: 'Yes. Our business plan prompts guide AI to generate executive summaries, market analysis, financial projections, competitive landscape assessments, and go-to-market strategies following standard VC-ready frameworks.' },
      { question: 'Are these prompts useful for consulting deliverables?', answer: 'Absolutely. Many consultants use our business prompts to accelerate creation of SWOT analyses, McKinsey-style frameworks, strategic recommendation slides, and client-ready executive reports.' },
    ],
    relatedCategories: ['marketing-prompts', 'seo-prompts', 'coding-prompts'],
    relatedCategoryNames: ['Marketing Prompts', 'SEO Prompts', 'Coding Prompts'],
  },
  image: {
    displayName: 'Image',
    intro: 'Professional image generation prompts for Midjourney, DALL-E 3, Stable Diffusion XL, and Adobe Firefly. These templates include precise camera specifications, lighting setups, style references, aspect ratios, and model-specific parameters for photorealistic and artistic AI imagery.',
    faqs: [
      { question: 'Which image AI models do these prompts support?', answer: 'Our image prompts are optimized for Midjourney v6, DALL-E 3, Stable Diffusion XL, Adobe Firefly, and Leonardo AI. Each prompt includes model-specific parameters like --ar, --style, CFG scale, and sampler settings.' },
      { question: 'How do I write Midjourney v6 prompts for photorealistic results?', answer: 'Effective Midjourney v6 prompts include subject description, lighting type (Rembrandt, golden hour), lens/camera spec (85mm f/1.2), style reference, and --style raw parameter. Browse our Midjourney prompt templates for ready-to-use examples.' },
    ],
    relatedCategories: ['video-prompts', 'chatgpt-prompts', 'marketing-prompts'],
    relatedCategoryNames: ['Video Prompts', 'ChatGPT Prompts', 'Marketing Prompts'],
  },
  video: {
    displayName: 'Video',
    intro: 'Structured video production prompts for YouTube creators, video marketers, and content studios. Generate high-retention scripts, hook frameworks, B-roll shot lists, voiceover copy, and YouTube SEO descriptions that maximize watch time and subscriber conversion.',
    faqs: [
      { question: 'Can these prompts help with YouTube video scripts?', answer: 'Yes. Our YouTube script prompts generate complete outlines with scroll-stopping 30-second hooks, three main content segments with visual instruction cues, mid-video engagement prompts, and strong subscriber CTAs.' },
      { question: 'Do these video prompts work for short-form content?', answer: 'Yes. We have dedicated templates for TikTok, Instagram Reels, and YouTube Shorts optimized for < 60-second attention-grabbing formats with rapid-fire hooks and single clear CTA.' },
    ],
    relatedCategories: ['image-prompts', 'marketing-prompts', 'chatgpt-prompts'],
    relatedCategoryNames: ['Image Prompts', 'Marketing Prompts', 'ChatGPT Prompts'],
  },
};

// ── Slug → Category mapping ──────────────────────────────────────────────────
function mapSlugToCategory(slug) {
  if (!slug || !slug.endsWith('-prompts')) return null;
  const raw = slug.slice(0, -8).toLowerCase();
  const meta = CATEGORY_META[raw];
  if (meta) return { key: raw, ...meta };
  // Generic fallback for future categories
  const displayName = raw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    key: raw,
    displayName,
    intro: `Browse our curated collection of ${displayName} prompts. Professionally engineered templates ready to copy and deploy across your AI workflows.`,
    faqs: [],
    relatedCategories: [],
    relatedCategoryNames: [],
  };
}

// ── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { category_slug } = await params;
  const cat = mapSlugToCategory(category_slug);
  if (!cat) return { title: 'Not Found | Revoxera AI' };

  const title = `${cat.displayName} Prompts — Best ${cat.displayName} AI Prompt Templates`;
  const description = `Browse ${cat.displayName} prompts library. ${cat.intro.slice(0, 120)}... Free to copy and optimize.`;

  return {
    title,
    description,
    keywords: [
      `${cat.displayName.toLowerCase()} prompts`,
      `best ${cat.displayName.toLowerCase()} prompts`,
      `${cat.displayName.toLowerCase()} prompt templates`,
      `${cat.displayName.toLowerCase()} AI prompts`,
      'prompt engineering',
      'AI prompt library',
    ],
    alternates: {
      canonical: `${BASE_URL}/${category_slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${category_slug}`,
      siteName: 'Revoxera AI',
      type: 'website',
      images: [{ url: '/logo.png', width: 1200, height: 630, alt: `${cat.displayName} Prompts` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
  };
}

// ── Server Component Page ────────────────────────────────────────────────────
export default async function CategoryPage({ params }) {
  const { category_slug } = await params;
  const cat = mapSlugToCategory(category_slug);

  if (!cat) notFound();

  // ── Server-side data fetching (SSR + ISR) ──────────────────────────────────
  let initialPrompts = [];
  let initialTotal = 0;
  let initialPages = 1;
  let featuredPrompts = [];
  let recentPrompts = [];

  const fetchOpts = { next: { revalidate: 300 } }; // 5-minute ISR

  try {
    const [catRes, featRes, recentRes] = await Promise.all([
      fetch(`${API_URL}/api/prompt-collections/category/${encodeURIComponent(cat.displayName)}?page=1&limit=12&sort=popular&filter=all`, fetchOpts),
      fetch(`${API_URL}/api/prompt-collections/category/${encodeURIComponent(cat.displayName)}/featured?limit=3`, fetchOpts),
      fetch(`${API_URL}/api/prompt-collections/category/${encodeURIComponent(cat.displayName)}/recent?limit=3`, fetchOpts),
    ]);

    if (catRes.ok) {
      const json = await catRes.json();
      const result = json.data || json;
      initialPrompts = result.data || [];
      initialTotal = result.total || initialPrompts.length;
      initialPages = result.totalPages || 1;
    }
    if (featRes.ok) {
      const json = await featRes.json();
      featuredPrompts = json.data || [];
    }
    if (recentRes.ok) {
      const json = await recentRes.json();
      recentPrompts = json.data || [];
    }
  } catch (err) {
    console.error(`[CategoryPage] SSR fetch failed for ${category_slug}:`, err);
  }

  // ── JSON-LD Schemas ────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Prompt Collections', item: `${BASE_URL}/prompt-collections` },
      { '@type': 'ListItem', position: 3, name: `${cat.displayName} Prompts`, item: `${BASE_URL}/${category_slug}` },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.displayName} Prompts — Revoxera AI`,
    description: cat.intro,
    url: `${BASE_URL}/${category_slug}`,
    hasPart: initialPrompts.slice(0, 6).map(p => ({
      '@type': 'CreativeWork',
      name: p.title,
      url: `${BASE_URL}/prompt/${p.slug}`,
      description: p.description,
    })),
  };

  const faqSchema = cat.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cat.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <main className="min-h-screen hero-bg">
      {/* ── Schema Injection ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <Navbar />

      <div className="mt-16 md:mt-20 py-20 px-4 container relative">
        {/* Glow backdrop */}
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 left-1/4 w-[350px] h-[300px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">

          {/* ── BREADCRUMB ── */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/40 font-medium mb-10">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/prompt-collections" className="hover:text-amber-400 transition-colors">Prompt Collections</Link>
            <span>/</span>
            <span className="text-white/60">{cat.displayName} Prompts</span>
          </nav>

          {/* ── PAGE HEADER ── */}
          <header className="text-center mb-14 select-none">
            <p className="section-label mb-3">Curated Prompt Library</p>
            <h1 className="section-title mb-5 text-3xl md:text-5xl font-extrabold text-white">
              Premium <span className="gradient-text">{cat.displayName} Prompts</span>
            </h1>
            <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
              {cat.intro.slice(0, 200)}...
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/30 font-medium">
              <span>✦ {initialTotal}+ Prompts</span>
              <span>✦ Free to Copy</span>
              <span>✦ Updated Weekly</span>
            </div>
          </header>

          {/* ── FEATURED PROMPTS ── */}
          {featuredPrompts.length > 0 && (
            <section aria-label={`Featured ${cat.displayName} prompts`} className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <Star size={14} className="text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">Featured Prompts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featuredPrompts.map(item => (
                  <Link key={item.id} href={`/prompt/${item.slug}`}>
                    <div className="glass-card p-5 hover:border-amber-500/25 transition-all duration-300 card-hover group h-full flex flex-col">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-purple-400 bg-purple-500/10 border-purple-500/20 w-fit mb-3">
                        ⭐ Featured
                      </span>
                      <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 flex-1">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-amber-400/70 mt-3 flex items-center gap-1 font-medium">
                        View prompt <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── RECENTLY ADDED ── */}
          {recentPrompts.length > 0 && (
            <section aria-label={`Recently added ${cat.displayName} prompts`} className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={14} className="text-violet-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-violet-400">Recently Added</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {recentPrompts.map(item => (
                  <Link
                    key={item.id}
                    href={`/prompt/${item.slug}`}
                    className="glass-card px-4 py-2.5 text-xs font-medium text-white/70 hover:text-white hover:border-white/20 transition-all group flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 group-hover:bg-amber-400 transition-colors" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── CLIENT-SIDE INTERACTIVE GRID (filter + search + pagination) ── */}
          <section aria-label={`All ${cat.displayName} prompts`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={14} className="text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">All Prompts</h2>
            </div>
            <CategoryPageClient
              initialPrompts={initialPrompts}
              initialTotal={initialTotal}
              initialPages={initialPages}
              categoryName={cat.displayName}
              categorySlug={category_slug}
            />
          </section>

          {/* ── RELATED CATEGORIES ── */}
          {cat.relatedCategories.length > 0 && (
            <section aria-label="Related prompt categories" className="mt-20 pt-10 border-t border-white/5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8">Related Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cat.relatedCategories.map((slug, i) => (
                  <Link key={slug} href={`/${slug}`}>
                    <div className="glass-card p-4 hover:border-amber-500/20 transition-all group flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
                        {cat.relatedCategoryNames[i]}
                      </span>
                      <ArrowRight size={12} className="text-white/30 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── FAQ SECTION ── */}
          {cat.faqs.length > 0 && (
            <section aria-label="Frequently asked questions" className="mt-20 pt-10 border-t border-white/5">
              <h2 className="text-2xl font-extrabold text-white mb-8">
                Frequently Asked Questions about <span className="gradient-text">{cat.displayName} Prompts</span>
              </h2>
              <div className="space-y-4">
                {cat.faqs.map((faq, idx) => (
                  <div key={idx} className="glass-card p-6">
                    <h3 className="text-sm font-bold text-white mb-3">{faq.question}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── CTA ── */}
          <section className="mt-20 text-center glass-card p-10 rounded-3xl" aria-label="Prompt optimizer call to action">
            <h2 className="text-xl font-extrabold text-white mb-3">
              Want a custom <span className="gradient-text">{cat.displayName} prompt</span>?
            </h2>
            <p className="text-sm text-white/50 mb-6">Use our AI Prompt Optimizer to generate, improve, and refine prompts in seconds.</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 btn-primary rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Open Prompt Generator <ArrowRight size={14} />
            </Link>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
