import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import './globals.css';

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
  metadataBase: new URL('https://promptbeast.ai'),
  title: 'Prompt Beast — World-Class AI Prompt Generator',
  description:
    'Generate, improve, and rewrite AI prompts instantly with Prompt Beast. Powered by GPT-4o and Hugging Face. Support for ChatGPT, Midjourney, Coding, Marketing, SEO, and more.',
  keywords: [
    'AI prompt generator',
    'ChatGPT prompts',
    'Midjourney prompts',
    'prompt engineering',
    'AI tools',
    'GPT-4',
    'prompt improver',
  ],
  authors: [{ name: 'Prompt Beast' }],
  creator: 'Prompt Beast',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prompt Beast — World-Class AI Prompt Generator',
    description: 'Generate, improve, and rewrite AI prompts in seconds. Powered by GPT-4o & Hugging Face.',
    url: 'https://promptbeast.ai',
    siteName: 'Prompt Beast',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prompt Beast AI Prompt Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Beast — AI Prompt Generator',
    description: 'Generate optimized AI prompts in seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="prompt-beast-theme"
        >
          {children}
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
      </body>
    </html>
  );
}
