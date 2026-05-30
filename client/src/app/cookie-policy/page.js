'use client';

import { motion } from 'framer-motion';
import { Info, ShieldAlert, Settings, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import Footer from '../components/Footer';

const COOKIE_TYPES = [
  {
    title: 'Essential Cookies',
    icon: <Settings className="w-5 h-5 text-purple-400" />,
    purpose: 'These are necessary for the website to function. They handle authentication, theme persistence (light/dark mode preference), and UI state caching (like your prompt history tab selection).'
  },
  {
    title: 'Analytics & Performance',
    icon: <Info className="w-5 h-5 text-purple-400" />,
    purpose: 'These help us understand how visitors interact with our prompt generator by collecting anonymous usage data. This allows us to improve model selection settings and UI speed.'
  },
  {
    title: 'Preference Settings',
    icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
    purpose: 'These cookies allow our website to remember choices you make (such as default prompt variables, custom tone select values, or API endpoint keys stored locally).'
  },
  {
    title: 'Third-Party / API Cookies',
    icon: <EyeOff className="w-5 h-5 text-purple-400" />,
    purpose: 'When executing prompt completions via external model providers (e.g. Hugging Face or OpenAI), those services may set their own tracking or routing cookies inside their API calls.'
  }
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="cookie-policy" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Cookie Management
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Cookie Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed"
            >
              Last Updated: May 21, 2026. How we use cookies, session storage, and tracking technologies to optimize your prompt engineering workflows.
            </motion.p>
          </div>

          {/* Main Content Card */}
          <div className="glass-card p-6 md:p-10 mb-12 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                What Are Cookies?
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Cookies are small text files stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site. In addition to HTTP cookies, we also use browser local storage and session storage to keep your configured prompts and light/dark theme choices safe and responsive.
              </p>
            </div>

            <hr className="border-white/5" />

            <div>
              <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                How We Use Cookies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COOKIE_TYPES.map((cookie, idx) => (
                  <div key={cookie.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      {cookie.icon}
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                      {cookie.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {cookie.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                Managing and Disabling Cookies
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you. It may also prevent you from saving customized prompts or keeping your dark/light theme setting.
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">allaboutcookies.org</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
