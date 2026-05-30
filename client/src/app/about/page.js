'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Heart, Eye, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { clientApi } from '../utils/clientApi';
import SeoHeader from '../components/SeoHeader';

const VALUES = [
  {
    title: 'Precision-First Engineering',
    icon: <Target className="w-5 h-5 text-purple-400" />,
    description: 'We believe prompting is a science. Our algorithm structures context, boundaries, and formatting cues to deliver consistent outputs.'
  },
  {
    title: 'Accessible Innovation',
    icon: <Eye className="w-5 h-5 text-purple-400" />,
    description: 'We integrate with open source and free tiers, ensuring powerful generative engineering workflows are available to everyone.'
  },
  {
    title: 'Privacy & Trust',
    icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
    description: 'We do not sell user prompts. Configurations are processed securely and historical logs are stored safely in local storage.'
  }
];

export default function AboutPage() {
  const [content, setContent] = useState({
    about_title: 'About Revoxera AI',
    about_description: 'We build interface layers that simplify speaking to AI. Our goal is to transform simple, raw thoughts into robust prompt architectures instantly.',
    about_story_title: 'The Story of Revoxera AI',
    about_story_content: 'Revoxera AI was founded in 2026 by a small group of software engineers and content creators who realized that writing effective prompts was becoming a bottleneck. While large language models were growing exponentially in capability, getting them to produce consistent, structured outputs remained a tedious trial-and-error process.\n\nWe realized that effective prompting requires roleplaying, delimiter structures, explicit output rules, and detailed tone adjustments. We built Revoxera AI to automate these prompt patterns, translating brief inputs into complete prompt layouts with a single click.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAboutContent() {
      try {
        const settings = await clientApi.fetchSettings();
        setContent({
          about_title: settings.about_title || 'About Revoxera AI',
          about_description: settings.about_description || 'We build interface layers that simplify speaking to AI. Our goal is to transform simple, raw thoughts into robust prompt architectures instantly.',
          about_story_title: settings.about_story_title || 'The Story of Revoxera AI',
          about_story_content: settings.about_story_content || 'Revoxera AI was founded in 2026 by a small group of software engineers and content creators who realized that writing effective prompts was becoming a bottleneck...'
        });
      } catch (err) {
        console.error('Failed to load about us content dynamically, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAboutContent();
  }, []);

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="about" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Our Mission
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              {content.about_title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-2xl mx-auto leading-relaxed"
            >
              {content.about_description}
            </motion.p>
          </div>

          {/* Core Story */}
          <div className="glass-card p-6 md:p-8 mb-12 relative overflow-hidden glow-purple-strong">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-fuchsia-600/3 to-transparent pointer-events-none" />
            <h2 className="text-lg font-bold text-white mb-4 relative z-10" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              {content.about_story_title}
            </h2>
            <div className="space-y-4 text-sm text-white/70 leading-relaxed relative z-10 whitespace-pre-line">
              {content.about_story_content}
            </div>
          </div>

          {/* Values Grid */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white text-center mb-8" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map((val, index) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 flex flex-col items-start gap-4 hover:border-amber-500/30 transition-all duration-300 card-hover group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {val.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {val.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
