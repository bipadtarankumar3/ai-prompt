'use client';
import { motion } from 'framer-motion';
import { Zap, Sparkles, RefreshCw, Layers, History, Share2, Bookmark, LayoutGrid, Gauge } from 'lucide-react';

const FEATURES = [
  { Icon: Zap,        color: 'text-amber-400',   bg: 'bg-amber-400/10',   title: 'Prompt Generator', desc: 'Bypass blank-page anxiety and build production-ready prompts from a single sentence.' },
  { Icon: Sparkles,   color: 'text-violet-400',  bg: 'bg-violet-400/10',  title: 'Prompt Improver', desc: 'Upgrade low-performing prompts to eliminate generic AI responses.' },
  { Icon: RefreshCw,  color: 'text-orange-400',  bg: 'bg-orange-400/10',  title: 'Prompt Rewriter', desc: 'Tailor prompt tone and constraints to fit different team roles instantly.' },
  { Icon: Layers,     color: 'text-blue-400',    bg: 'bg-blue-400/10',    title: 'Multi-Model Support', desc: 'Get optimized outputs for Claude, ChatGPT, Gemini, or Midjourney without manual tuning.' },
  { Icon: History,    color: 'text-pink-400',    bg: 'bg-pink-400/10',    title: 'Prompt History', desc: 'Access past generations instantly to keep your workflow uninterrupted.' },
  { Icon: Bookmark,   color: 'text-green-400',   bg: 'bg-green-400/10',   title: 'Save Prompts', desc: 'Keep high-performing prompt templates organized and ready for recurring runs.' },
  { Icon: Share2,     color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    title: 'Share Prompts', desc: 'Collaborate by sending prompt links to teammates in one click.' },
  { Icon: LayoutGrid, color: 'text-violet-500',  bg: 'bg-violet-500/10',  title: 'Templates', desc: 'Start with battle-tested layouts designed for immediate business outcomes.' },
  { Icon: Gauge,      color: 'text-amber-550',   bg: 'bg-amber-500/10',   title: 'Fast Generation', desc: 'Get optimized prompt outputs in milliseconds so you can focus on building.' },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 font-mono">Why Revoxera AI</p>
          <h2 className="font-bold text-white mb-4 font-display"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
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
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card card-hover p-6 flex gap-4 items-start bg-white/[0.01] border-white/6 hover:border-amber-500/25"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 ${f.color} border border-white/5`}>
                <f.Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white/90 mb-1.5 text-sm font-display">{f.title}</h3>
                <p className="text-white/40 text-xs md:text-sm leading-relaxed font-sans">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
