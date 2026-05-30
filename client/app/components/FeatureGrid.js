'use client';
import { motion } from 'framer-motion';
import { Zap, Sparkles, RefreshCw, Layers, History, Share2, Shield, Globe, Moon } from 'lucide-react';

const FEATURES = [
  { Icon: Zap,       color: 'text-amber-400',   bg: 'bg-amber-400/10',   title: 'Structured Generation', desc: 'Convert rough, one-sentence ideas into comprehensive, detailed system prompts that guide LLM logic.' },
  { Icon: Sparkles,  color: 'text-violet-400',  bg: 'bg-violet-400/10',  title: 'One-Click Optimization', desc: 'Paste your existing, low-performing prompts and watch Revoxera rebuild role parameters and output rules.' },
  { Icon: Layers,    color: 'text-blue-400',    bg: 'bg-blue-400/10',    title: 'Multi-Model Tuning',    desc: 'Target the specific context windows and behavioral quirks of ChatGPT, Gemini, Claude, and Midjourney.' },
  { Icon: Globe,     color: 'text-green-400',   bg: 'bg-green-400/10',   title: 'Battle-Tested Templates',desc: 'Unlock access to structured starter blueprints designed specifically for developers, writers, and artists.' },
  { Icon: History,   color: 'text-pink-400',    bg: 'bg-pink-400/10',    title: 'Auto-Saved History',    desc: 'Never lose a high-performing script. Every generation is auto-saved locally for instant access.' },
  { Icon: Share2,    color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    title: 'Frictionless Export',   desc: 'Copy to clipboard, download plain text files, or generate one-click share links for your workspace team.' },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Why Revoxera AI</p>
          <h2 className="font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Everything You Need to{' '}
            <span className="gradient-text">Master AI Prompts</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="card card-hover p-6 flex gap-4 items-start"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white/90 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
