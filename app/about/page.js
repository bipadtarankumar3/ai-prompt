'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Target, Heart, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  return (
    <main className="min-h-screen hero-bg">
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
              About Prompt Beast
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-2xl mx-auto leading-relaxed"
            >
              We build interface layers that simplify speaking to AI. Our goal is to transform simple, raw thoughts into robust prompt architectures instantly.
            </motion.p>
          </div>

          {/* Core Story */}
          <div className="glass-card p-6 md:p-8 mb-12">
            <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              The Story of Prompt Beast
            </h2>
            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
              <p>
                Prompt Beast was founded in 2026 by a small group of software engineers and content creators who realized that writing effective prompts was becoming a bottleneck. While large language models were growing exponentially in capability, getting them to produce consistent, structured outputs remained a tedious trial-and-error process.
              </p>
              <p>
                We realized that effective prompting requires roleplaying, delimiter structures, explicit output rules, and detailed tone adjustments. We built Prompt Beast to automate these prompt patterns, translating brief inputs into complete prompt layouts with a single click.
              </p>
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
                  className="glass-card p-6 flex flex-col items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
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
