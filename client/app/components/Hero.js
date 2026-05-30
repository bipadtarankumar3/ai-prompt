'use client';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import PromptDemo from './PromptDemo';

const TAGS = ['ChatGPT', 'Midjourney', 'SEO', 'Coding', 'Marketing', 'YouTube', 'Blogging', 'Business', 'AI Art', 'Copywriting'];

export default function Hero() {
  return (
    <section className="relative min-h-fit md:min-h-screen flex flex-col items-center justify-center hero-bg grid-bg overflow-hidden pt-24 pb-16 md:pt-24 md:pb-24 px-4 md:px-8">

      {/* Blurred gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-amber-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-orange-500/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center text-center lg:text-left">

        {/* Left Column - Text and Details */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start w-full">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-start mb-6"
          >
            <span className="badge badge-purple px-4 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Powered by Gemini 1.5 &amp; Hugging Face
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-bold leading-[1.1] tracking-tight text-white mb-6 text-center lg:text-left w-full"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}
          >
            Stop guessing what the AI wants. Get{' '}
            <span className="gradient-text inline-block">production-ready results</span>
            {' '}on your first try.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-white/55 mb-8 leading-relaxed max-w-2xl lg:max-w-none text-center lg:text-left"
          >
            Staring at a blank chat window or wasting hours tweaking prompts shouldn't be your workflow. Revoxera translates your raw goals into precise instructions that guide LLMs to deliver clean code, high-converting copy, and jaw-dropping visuals on the first run. No guesswork, no wasted credits.
          </motion.p>

          {/* CTAs */}
          <div className="flex flex-col items-center lg:items-start w-full mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full max-w-md lg:max-w-none"
            >
              <Link href="/generator" id="hero-primary-cta"
                className="btn-primary justify-center w-full sm:w-auto px-8 py-4 text-base rounded-2xl glow-md">
                <Zap size={18} fill="currentColor" />
                Generate Flawless Prompts
              </Link>
              <Link href="/templates" id="hero-templates-cta"
                className="btn-secondary justify-center w-full sm:w-auto px-8 py-4 text-base rounded-2xl">
                Explore Templates
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs text-white/40 mt-3 text-center lg:text-left"
            >
              No credit card required. Start generating in 10 seconds.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 items-center justify-center lg:justify-start gap-6 sm:gap-12 w-full mb-12"
          >
            {[
              { v: '50K+', l: 'Prompts Built' },
              { v: '99%', l: 'Success Rate' },
              { v: '4.9/5', l: 'Average Rating' },
              { v: '10K+', l: 'Active Users' },
            ].map(s => (
              <div key={s.l} className="text-center lg:text-left">
                <div className="gradient-text font-bold text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.v}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Interactive Prompt Input & Preview Demo */}
        <div className="lg:col-span-5 w-full flex items-center justify-center relative min-h-[350px] sm:min-h-[450px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center w-full"
          >
            <PromptDemo />
          </motion.div>
        </div>

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
