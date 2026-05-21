'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeatureGrid from './components/FeatureGrid';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <FeatureGrid />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Banner */}
      <section className="mt-12 md:mt-16 mb-8 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card text-center p-12 md:p-16 relative overflow-hidden glow-purple-strong"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/15 via-orange-600/10 to-transparent" />
            <div className="absolute pointer-events-none" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, #f59e0b, transparent)', top: '-100px', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }} />

            <div className="relative z-10">
              <span className="badge badge-purple mb-5">
                <Zap size={12} />
                Start for Free Today
              </span>
              <h2
                className="section-title font-bold text-white mb-5"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
              >
                Ready to Become a{' '}
                <span className="gradient-text">Prompt Master?</span>
              </h2>
              <p className="text-base text-muted max-w-lg mx-auto mb-8 leading-relaxed">
                Join 10,000+ creators, developers, and marketers who use Prompt Beast
                to generate AI prompts that actually work.
              </p>
              <Link
                href="/generator"
                id="cta-banner-btn"
                className="inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl btn-gradient font-bold text-base glow-purple"
              >
                <Zap size={20} fill="currentColor" />
                Generate Your First Prompt Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
