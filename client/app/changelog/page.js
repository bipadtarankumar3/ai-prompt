'use client';

import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, Zap, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RELEASES = [
  {
    version: 'v1.2.0',
    date: 'May 2026',
    title: 'Mobile Optimization & Visual Polish',
    badge: 'Latest',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Significant styling, accessibility, and responsiveness updates to improve client interactions on all devices.',
    changes: [
      'Engineered high-contrast overrides for light mode theme variables (badging, inputs, and controls).',
      'Optimized Hero responsiveness and spacing structures for compact mobile viewports.',
      'Designed a premium floating dashboard showcase illustration in the Hero section.',
      'Set opaque dropdown backgrounds for the Hugging Face model selector to resolve background text bleed-through.',
      'Fixed a layering bug where the fixed Navbar would overlap the history slide-in modal.'
    ]
  },
  {
    version: 'v1.1.0',
    date: 'April 2026',
    title: 'Multi-Page Architecture & History Persistence',
    badge: 'Major',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Migrated from a single-page anchor system to a fully routed App Router setup to boost loading times and SEO.',
    changes: [
      'Created dedicated page routes for `/generator`, `/templates`, and `/pricing`.',
      'Implemented local storage persistence to save and reload the last 50 generated prompt configurations.',
      'Extracted templates list into a shared utility layout to sync workspace options.',
      'Wired query parameter bindings (`?template=` & `?prompt=`) to pre-populate text inputs dynamically.'
    ]
  },
  {
    version: 'v1.0.0',
    date: 'March 2026',
    title: 'Official Launch',
    badge: 'Launch',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    description: 'The birth of Revoxera AI. A high-converting interface built to generate expert-level prompts instantly.',
    changes: [
      'Dual-provider support: GPT-4o Mini (OpenAI) and Open-source AI models (Hugging Face).',
      'Category and Tone selector chips providing custom styling modifiers automatically.',
      'Modern glassmorphism UI layout, custom scrolling behaviors, and dark mode base styling.',
      'Output workspace equipped with quick copy-to-clipboard, raw text viewing, and token tracking.'
    ]
  }
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Decorative background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Product Updates
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Changelog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-xl mx-auto leading-relaxed"
            >
              Stay up to date with new features, visual redesigns, and engine updates built for Revoxera AI.
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-white/10 ml-4 md:ml-12 pl-6 md:pl-10 space-y-12">
            {RELEASES.map((rel, index) => (
              <motion.div
                key={rel.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Node Point */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-violet-600 border-4 border-[#08080f] flex items-center justify-center glow-sm" />

                {/* Release Card */}
                <div className="glass-card p-6 md:p-8">
                  {/* Version header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                        {rel.version}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${rel.badgeColor}`}>
                        {rel.badge}
                      </span>
                    </div>
                    <span className="text-xs text-white/35 flex items-center gap-1.5 font-medium">
                      <Calendar size={12} className="text-purple-400" />
                      {rel.date}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    {rel.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-5">
                    {rel.description}
                  </p>

                  {/* List of changes */}
                  <div className="border-t border-white/5 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                      <Terminal size={12} />
                      Updates List
                    </p>
                    <ul className="space-y-3">
                      {rel.changes.map((change, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-sm text-white/70 leading-relaxed">
                          <ArrowRight size={14} className="text-purple-400 mt-1 flex-shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
