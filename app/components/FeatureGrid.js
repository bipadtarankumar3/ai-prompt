'use client';
import { motion } from 'framer-motion';
import { Zap, Sparkles, RefreshCw, Layers, History, Share2, Shield, Globe, Moon } from 'lucide-react';

const FEATURES = [
  { Icon: Zap,       color: 'text-amber-400',   bg: 'bg-amber-400/10',   title: 'Instant Generation',    desc: 'Create optimized prompts in seconds powered by GPT-4o and open-source models.' },
  { Icon: Sparkles,  color: 'text-violet-400',  bg: 'bg-violet-400/10',  title: 'Prompt Improver',       desc: 'Paste any prompt and watch our AI transform it into something remarkable.' },
  { Icon: RefreshCw, color: 'text-blue-400',    bg: 'bg-blue-400/10',    title: 'Smart Rewriter',        desc: 'Get fresh, completely different variations while preserving the core intent.' },
  { Icon: Layers,    color: 'text-green-400',   bg: 'bg-green-400/10',   title: 'Multiple AI Providers', desc: 'Seamlessly switch between OpenAI GPT-4o, Qwen, Mistral, DeepSeek, and more.' },
  { Icon: History,   color: 'text-pink-400',    bg: 'bg-pink-400/10',    title: 'Prompt History',        desc: 'Every prompt is auto-saved. Access, reload, and delete from your history panel.' },
  { Icon: Share2,    color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    title: 'Easy Sharing',          desc: 'Share via link, download as .txt, or copy to clipboard in one click.' },
  { Icon: Globe,     color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  title: '8 Categories',          desc: 'ChatGPT, Midjourney, Coding, SEO, Marketing, YouTube, Blogging & Business.' },
  { Icon: Moon,      color: 'text-purple-400',  bg: 'bg-purple-400/10',  title: 'Dark & Light Mode',     desc: 'A beautiful theme system that looks great any time of day, on any device.' },
  { Icon: Shield,    color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Secure by Design',      desc: 'API keys are server-side only. Rate limiting and input validation built in.' },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Why Prompt Beast</p>
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
