'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  { n: '01', icon: '💭', title: 'Describe Your Idea', desc: 'Type a rough topic, paste an existing prompt, or pick one of our templates. No expertise needed.' },
  { n: '02', icon: '⚙️', title: 'Configure Settings',  desc: 'Choose category, tone, and AI provider. Switch between GPT-4o and free open-source models.' },
  { n: '03', icon: '✨', title: 'Get Perfect Results',  desc: 'Receive a polished, optimized prompt instantly. Copy, download, share, or save to favorites.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Simple as 1-2-3</p>
          <h2 className="font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            How <span className="gradient-text">Prompt Beast</span> Works
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Generate world-class AI prompts in under 30 seconds.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[33%] right-[33%] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.4), rgba(249,115,22,0.4))' }} />

          {STEPS.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="card card-hover p-8 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-5">{s.icon}</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center font-black text-lg text-white mb-5 shadow-lg shadow-amber-900/40">
                {s.n}
              </div>
              <h3 className="font-bold text-white text-lg mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }} className="text-center mt-12"
        >
          <a href="#generator" id="hiw-cta" className="btn-primary inline-flex px-8 py-4 text-base rounded-2xl">
            Try It Free — No Sign-up
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
