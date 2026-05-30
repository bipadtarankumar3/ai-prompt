import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PromptClientDetails from '../../components/PromptClientDetails';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Server-side dynamic metadata generation for SEO crawlers
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${API_URL}/api/prompt-collections/slug/${slug}`, {
      next: { revalidate: 60 } // cache for 60 seconds
    });
    
    if (!response.ok) {
      return { title: 'Prompt Not Found | Revoxera AI' };
    }
    
    const resData = await response.json();
    const prompt = resData.data || resData;

    if (!prompt) {
      return { title: 'Prompt Not Found | Revoxera AI' };
    }

    const titleText = prompt.title;
    const category = prompt.category;
    const descriptionText = prompt.description || `Optimize your AI workflows with our "${titleText}" prompt under ${category}. Free to copy or run dynamically inside Revoxera AI.`;

    return {
      title: `${titleText} — Premium ${category} Prompt — Revoxera AI`,
      description: descriptionText,
      keywords: [`${titleText}`, `${category} prompts`, `${category.toLowerCase()} template`, 'prompt engineering'],
      alternates: {
        canonical: `https://aiprompt.revoxera.com/prompt/${slug}`,
      },
      openGraph: {
        title: `${titleText} — Premium ${category} Prompt — Revoxera`,
        description: descriptionText,
        url: `https://aiprompt.revoxera.com/prompt/${slug}`,
        siteName: 'Revoxera AI',
        type: 'article',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: titleText }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${titleText} — Premium ${category} Prompt`,
        description: descriptionText,
        images: ['/logo.png'],
      }
    };
  } catch (err) {
    console.error('Failed to generate prompt page metadata:', err);
    return { title: 'AI Prompt | Revoxera AI' };
  }
}

export default async function ProgrammaticPromptPage({ params }) {
  const { slug } = await params;
  let prompt = null;
  let relatedPrompts = [];

  // 1. Fetch Prompt Details on Server
  try {
    const res = await fetch(`${API_URL}/api/prompt-collections/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const resData = await res.json();
      prompt = resData.data || resData;
    }
  } catch (err) {
    console.error(`Server fetch failed for prompt slug: ${slug}`, err);
  }

  // If prompt is not in database, trigger Next.js 404 handler immediately
  if (!prompt) {
    notFound();
  }

  // 2. Fetch Related Prompts (same category, excluding current)
  try {
    const relatedRes = await fetch(
      `${API_URL}/api/prompt-collections/related/${prompt.id}?category=${encodeURIComponent(prompt.category)}&limit=3`,
      { next: { revalidate: 120 } }
    );
    
    if (relatedRes.ok) {
      const resData = await relatedRes.json();
      relatedPrompts = resData.data || resData || [];
    }
  } catch (err) {
    console.error('Server fetch failed for related prompts:', err);
  }

  // 3. Compile Structural SEO JSON-LD schema graphs
  const categorySlug = prompt.category.toLowerCase().replace(/\s+/g, '-') + '-prompts';
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://aiprompt.revoxera.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Prompt Collections',
        'item': 'https://aiprompt.revoxera.com/prompt-collections'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${prompt.category} Prompts`,
        'item': `https://aiprompt.revoxera.com/${categorySlug}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': prompt.title,
        'item': `https://aiprompt.revoxera.com/prompt/${slug}`
      }
    ]
  };

  const faqSchema = prompt.faqs && prompt.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': prompt.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen hero-bg">
      {/* Inject schemas in head for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow styling lights */}
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-[450px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <PromptClientDetails prompt={prompt} relatedPrompts={relatedPrompts} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
