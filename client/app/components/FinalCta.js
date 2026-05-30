'use client';

import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FinalCta() {
  return (
    <section className="mt-12 md:mt-16 mb-8 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card text-center p-12 md:p-16 relative overflow-hidden glow-purple-strong border border-slate-200 dark:border-white/8"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-orange-600/5 to-transparent pointer-events-none" />
          <div className="absolute pointer-events-none" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent)', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />

          <div className="relative z-10">
            <span className="badge badge-purple mb-5">
              <Zap size={12} className="inline mr-1" />
              100% Free to Try
            </span>
            <h2
              className="section-title font-bold text-white mb-5 font-display"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Stop Hacking Prompts.<br />
              <span className="gradient-text inline-block">Start Getting Results.</span>
            </h2>
            <p className="text-base text-slate-500 dark:text-white/50 max-w-lg mx-auto mb-8 leading-relaxed">
              Join developers, creators, and marketers who use Revoxera to bypass trial-and-error and get flawless AI outputs on the first run.
            </p>

            {/* Simulated Input to Capture Intent */}
            <div className="max-w-md mx-auto mb-5 relative flex items-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/8 rounded-2xl p-1.5 focus-within:border-amber-500/50 transition-all">
              <input
                type="text"
                placeholder="Describe your prompt idea (e.g. cold sales email)..."
                disabled
                className="w-full bg-transparent border-none text-slate-800 dark:text-white/80 placeholder-slate-400 dark:placeholder-white/30 text-sm px-3.5 focus:outline-none cursor-pointer"
              />
              <Link
                href="/generator"
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] flex-shrink-0"
              >
                <Sparkles size={13} />
                Optimize
              </Link>
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-white/35">
              No registration or credit card required. Up to 50 generations free monthly.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
