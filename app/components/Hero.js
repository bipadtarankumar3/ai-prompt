'use client';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, Star } from 'lucide-react';

const TAGS = ['ChatGPT','Midjourney','SEO','Coding','Marketing','YouTube','Blogging','Business','AI Art','Copywriting'];

export default function Hero() {
  return (
    <section className="relative min-h-fit md:min-h-screen flex flex-col items-center justify-center hero-bg grid-bg overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24 px-4 md:px-8">

      {/* Blurred gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="badge badge-purple px-4 py-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by GPT-4o &amp; Hugging Face
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-bold leading-[1.1] tracking-tight text-white mb-6"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 6.5vw, 4.5rem)' }}
        >
          Generate{' '}
          <span className="gradient-text">Perfect AI Prompts</span>
          {' '}in Seconds
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Transform rough ideas into optimized, professional prompts for ChatGPT, Midjourney, coding, marketing, and 8 other categories — instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full max-w-md mx-auto sm:max-w-none"
        >
          <a href="#generator" id="hero-primary-cta"
            className="btn-primary justify-center w-full sm:w-auto px-8 py-4 text-base rounded-2xl glow-md">
            <Zap size={18} fill="currentColor" />
            Start Generating Free
          </a>
          <a href="#templates" id="hero-templates-cta"
            className="btn-secondary justify-center w-full sm:w-auto px-8 py-4 text-base rounded-2xl">
            Browse Templates
            <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Dashboard Mockup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-4 mb-16 mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm float-mockup"
        >
          {/* Decorative light border/glow inside */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-violet-500/20 via-transparent to-indigo-500/20 opacity-100 pointer-events-none" />
          <div className="relative overflow-hidden rounded-xl border border-white/5 bg-[#08080f]/80">
            <img
              src="/dashboard_mockup.png"
              alt="Prompt Beast Workspace Preview"
              className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-300 shadow-inner"
              loading="eager"
            />
            {/* Fade to background on the bottom to blend in */}
            <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-[#08080f] to-transparent pointer-events-none opacity-80 mockup-fade" />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 items-center justify-center gap-6 sm:gap-12 max-w-3xl mx-auto mb-14"
        >
          {[
            { v: '50K+', l: 'Prompts Generated' },
            { v: '5',    l: 'AI Models' },
            { v: '8',    l: 'Categories' },
            { v: '99%',  l: 'Satisfaction' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="gradient-text font-bold text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.v}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <div className="flex -space-x-2.5">
            {['🧑‍💻','👩‍🎨','🧑‍💼','👩‍🔬','🎬'].map((e, i) => (
              <div key={i}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-700 to-indigo-700 border-2 border-[#08080f] flex items-center justify-center text-sm"
                style={{ zIndex: 5 - i }}>
                {e}
              </div>
            ))}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400" fill="currentColor" />)}</div>
            <p className="text-xs text-white/35 mt-0.5">Loved by 10,000+ creators</p>
          </div>
        </motion.div>
      </div>

      {/* Marquee tags */}
      <div className="absolute bottom-8 left-0 right-0 overflow-hidden opacity-25 pointer-events-none">
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[...TAGS, ...TAGS].map((t, i) => (
            <span key={i} className="flex-shrink-0 px-4 py-1.5 rounded-full border border-white/15 text-white/60 text-xs font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
