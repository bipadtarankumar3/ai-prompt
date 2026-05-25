'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    icon: <Eye className="w-5 h-5 text-purple-400" />,
    content: 'We only collect information necessary to provide and improve our prompt engineering services. This includes prompt inputs you enter into the generator, templates you save, and configuration choices (such as target models, temperature, and formatting options). When using local storage option, all prompt history remains strictly on your local browser environment.'
  },
  {
    title: '2. How We Use Information',
    icon: <Lock className="w-5 h-5 text-purple-400" />,
    content: 'We use the collected configurations to communicate with AI model APIs and construct high-performance prompt outputs. We do not sell, rent, or distribute your raw prompts to third parties for marketing purposes. Aggregate, anonymized performance metrics may be used to optimize our generation algorithms.'
  },
  {
    title: '3. API Data Handling',
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    content: 'When you generate prompts using our integrated API connections (such as OpenAI or Hugging Face), your inputs are processed in accordance with those providers\' respective privacy policies. We secure all transit data using industry-standard SSL/TLS encryption protocols.'
  },
  {
    title: '4. Third-Party Integrations',
    icon: <Globe className="w-5 h-5 text-purple-400" />,
    content: 'Our service links to external APIs and web tools. We do not control and are not responsible for the privacy practices of external providers. We recommend reviewing the privacy statements of any third-party AI models or platforms you integrate with Revoxera AI.'
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Decorative Glow */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[300px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Trust &amp; Transparency
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed"
            >
              Last Updated: May 21, 2026. We are committed to protecting your intellectual property, inputs, and privacy. Learn how we handle your data.
            </motion.p>
          </div>

          {/* Main Content Card */}
          <div className="glass-card p-6 md:p-10 mb-12 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                Introduction
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Welcome to Revoxera AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and want to be transparent about how we handle user-generated prompts and configurations. By using our website and services, you consent to the practices described in this Privacy Policy.
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <a href="mailto:privacy@revoxera.ai" className="text-purple-400 hover:underline">privacy@revoxera.ai</a>.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* Grid of Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SECTIONS.map((sec, idx) => (
                <div key={sec.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {sec.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-white/5" />

            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                5. Changes to This Policy
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
