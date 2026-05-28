import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from './components/ThemeProvider';
import { BackgroundProvider } from './components/BackgroundProvider';
import AppBackground from './components/AppBackground';
import FloatingChatButton from './components/FloatingChatButton';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://aiprompt.revoxera.com'),
  title: {
    default: 'Revoxera AI — World-Class AI Prompt Generator',
    template: '%s | Revoxera AI',
  },
  description:
    'Generate, improve, and rewrite AI prompts instantly with Revoxera AI. Powered by Gemini 1.5 and Hugging Face. Support for ChatGPT, Midjourney, Coding, Marketing, SEO, and more.',
  keywords: [
    'AI prompt generator',
    'ChatGPT prompts',
    'Midjourney prompts',
    'prompt engineering',
    'AI tools',
    'GPT-4',
    'prompt improver',
  ],
  authors: [{ name: 'Revoxera AI' }],
  creator: 'Revoxera AI',
  alternates: {
    canonical: 'https://aiprompt.revoxera.com/',
  },
  openGraph: {
    title: 'Revoxera AI — World-Class AI Prompt Generator',
    description: 'Generate, improve, and rewrite AI prompts in seconds. Powered by Gemini 1.5 & Hugging Face.',
    url: 'https://aiprompt.revoxera.com',
    siteName: 'Revoxera AI',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Revoxera AI AI Prompt Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revoxera AI — AI Prompt Generator',
    description: 'Generate optimized AI prompts in seconds.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Revoxera AI",
  "operatingSystem": "Windows, macOS, Linux, Android, iOS",
  "applicationCategory": "UtilitiesApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Professional client-side prompt engineering utility suite to generate, optimize, and test generative AI prompts.",
  "featureList": [
    "AI Prompt Generator supporting ChatGPT, Midjourney, Claude",
    "Prompt Improver & Rephrase engine",
    "Predefined industry prompt templates database",
    "Interactive playground terminal"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://aiprompt.revoxera.com",
  "name": "Revoxera AI",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aiprompt.revoxera.com/templates?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Generate Optimized AI Prompts",
  "description": "Use the Revoxera AI console to build structured instructions for LLMs.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Select Target Model",
      "text": "Select your target model preset (e.g. ChatGPT, Claude, Midjourney, or Stable Diffusion)."
    },
    {
      "@type": "HowToStep",
      "name": "Input Raw Intent",
      "text": "Enter your brief task description or primary keywords into the generator prompt area."
    },
    {
      "@type": "HowToStep",
      "name": "Optimize and Improve",
      "text": "Click generate to apply custom role-playing, constraints, and structured output formatting automatically."
    },
    {
      "@type": "HowToStep",
      "name": "Copy Final Instruction",
      "text": "Copy the optimized prompt token or save it to your local template favorites."
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my prompt data private?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Revoxera AI runs on a client-side layout. Your custom inputs are processed inside your browser sandbox and never recorded on external databases."
      }
    },
    {
      "@type": "Question",
      "name": "What AI models are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our formatting and styling templates are optimized for OpenAI's GPT-4, Anthropic's Claude 3.5, Google Gemini, Midjourney v6, and Stable Diffusion XL."
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://aiprompt.revoxera.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <BackgroundProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="prompt-beast-theme"
          >
            <AppBackground />
            {children}
            <FloatingChatButton />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'rgba(8, 8, 15, 0.95)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#f4f4f5',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#f59e0b', secondary: '#451a03' },
                },
                error: {
                  iconTheme: { primary: '#f87171', secondary: '#451a03' },
                },
              }}
            />
          </ThemeProvider>
        </BackgroundProvider>
        <GoogleAnalytics gaId="G-2Y0DSV87D7" />
      </body>
    </html>
  );
}
