import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PromptClientDetails from '../../components/PromptClientDetails';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = 'https://aiprompt.revoxera.com';

// ── Dynamic Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await fetch(`${API_URL}/api/prompt-collections/slug/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) return { title: 'Prompt Not Found | Revoxera AI' };

    const resData = await response.json();
    const prompt = resData.data || resData;
    if (!prompt) return { title: 'Prompt Not Found | Revoxera AI' };

    // Use stored meta overrides if available, otherwise generate
    const titleText = prompt.meta_title || `${prompt.title} — ${prompt.category} Prompt`;
    const descriptionText = prompt.meta_description ||
      prompt.description ||
      `${prompt.title}: A professional ${prompt.category} AI prompt template. Copy instantly or optimize with Revoxera AI. Free to use.`;

    const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
    const keywords = [
      prompt.title,
      `${prompt.category} prompts`,
      `${prompt.category.toLowerCase()} prompt template`,
      'prompt engineering',
      'AI prompts',
      ...tags.slice(0, 4),
    ];

    return {
      title: titleText,
      description: descriptionText,
      keywords,
      alternates: {
        canonical: `${BASE_URL}/prompt/${slug}`,
      },
      openGraph: {
        title: titleText,
        description: descriptionText,
        url: `${BASE_URL}/prompt/${slug}`,
        siteName: 'Revoxera AI',
        type: 'article',
        publishedTime: prompt.created_at,
        modifiedTime: prompt.updated_at || prompt.created_at,
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: prompt.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: titleText,
        description: descriptionText,
        images: ['/logo.png'],
      },
    };
  } catch (err) {
    console.error('[PromptPage] Metadata generation failed:', err);
    return { title: 'AI Prompt | Revoxera AI' };
  }
}

// ── Server Component Page ────────────────────────────────────────────────────
export default async function ProgrammaticPromptPage({ params }) {
  const { slug } = await params;
  let prompt = null;
  let relatedPrompts = [];
  let similarPrompts = [];
  let trendingPrompts = [];

  const fetchOpts = { next: { revalidate: 60 } };

  // 1. Fetch Prompt Details
  try {
    const res = await fetch(`${API_URL}/api/prompt-collections/slug/${slug}`, fetchOpts);
    if (res.ok) {
      const resData = await res.json();
      prompt = resData.data || resData;
    }
  } catch (err) {
    console.error(`[PromptPage] Server fetch failed for slug: ${slug}`, err);
  }

  if (!prompt) notFound();

  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
  const categorySlug = prompt.category.toLowerCase().replace(/\s+/g, '-') + '-prompts';

  // 2. Fetch Related, Similar, Trending in parallel
  try {
    const [relatedRes, similarRes, trendingRes] = await Promise.all([
      fetch(`${API_URL}/api/prompt-collections/related/${prompt.id}?category=${encodeURIComponent(prompt.category)}&limit=3`, { next: { revalidate: 120 } }),
      fetch(`${API_URL}/api/prompt-collections/similar/${prompt.id}?tags=${encodeURIComponent(tags.join(','))}&limit=4`, { next: { revalidate: 120 } }),
      fetch(`${API_URL}/api/prompt-collections/trending?limit=5`, { next: { revalidate: 600 } }),
    ]);

    if (relatedRes.ok) { const d = await relatedRes.json(); relatedPrompts = d.data || []; }
    if (similarRes.ok) { const d = await similarRes.json(); similarPrompts = d.data || []; }
    if (trendingRes.ok) { const d = await trendingRes.json(); trendingPrompts = d.data || []; }
  } catch (err) {
    console.error('[PromptPage] Failed to fetch supporting data:', err);
  }

  // 3. JSON-LD Schemas ─────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Prompt Collections', item: `${BASE_URL}/prompt-collections` },
      { '@type': 'ListItem', position: 3, name: `${prompt.category} Prompts`, item: `${BASE_URL}/${categorySlug}` },
      { '@type': 'ListItem', position: 4, name: prompt.title, item: `${BASE_URL}/prompt/${slug}` },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/prompt/${slug}`,
    name: prompt.meta_title || prompt.title,
    description: prompt.meta_description || prompt.description,
    url: `${BASE_URL}/prompt/${slug}`,
    datePublished: prompt.created_at,
    dateModified: prompt.updated_at || prompt.created_at,
    breadcrumb: { '@id': `${BASE_URL}/prompt/${slug}#breadcrumb` },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'Revoxera AI',
      url: BASE_URL,
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'Revoxera AI Prompt Generator',
      url: `${BASE_URL}/generator`,
    },
    keywords: tags.join(', '),
    inLanguage: 'en-US',
  };

  const faqSchema = Array.isArray(prompt.faqs) && prompt.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: prompt.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${prompt.title} prompt`,
    description: `Step-by-step guide to using the ${prompt.title} AI prompt template for ${prompt.category} workflows.`,
    step: [
      { '@type': 'HowToStep', name: 'Copy the Prompt', text: 'Click the "Copy to Clipboard" button to copy the prompt blueprint.' },
      { '@type': 'HowToStep', name: 'Replace Variables', text: 'Identify the [VARIABLE] placeholders and replace them with your specific context and requirements.' },
      { '@type': 'HowToStep', name: 'Paste into AI', text: `Paste the customized prompt into ${prompt.category} or your preferred AI assistant and run it.` },
      { '@type': 'HowToStep', name: 'Optimize Further', text: 'Click "Run in Prompt Optimizer" to refine the prompt further using Revoxera AI\'s optimization engine.' },
    ],
  };

  return (
    <main className="min-h-screen hero-bg">
      {/* ── Schema Injection (server-rendered, visible to crawlers) ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow styling lights */}
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-[450px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <PromptClientDetails
            prompt={prompt}
            relatedPrompts={relatedPrompts}
            similarPrompts={similarPrompts}
            trendingPrompts={trendingPrompts}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
