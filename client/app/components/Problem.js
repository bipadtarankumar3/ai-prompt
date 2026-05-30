'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

const PROBLEMS = [
  {
    icon: HelpCircle,
    color: 'text-amber-500',
    title: 'Blank Page Anxiety',
    desc: 'Staring at an empty chat box trying to draft system instructions is intimidating. You shouldn’t need a degree in linguistics to get high-quality outputs from AI models.'
  },
  {
    icon: Clock,
    color: 'text-orange-500',
    title: 'The Trial-and-Error Loop',
    desc: 'Tweaking single adjectives, running the prompt, getting a generic answer, and repeating. You waste hours of productive time and burn through API credits on useless drafts.'
  },
  {
    icon: AlertTriangle,
    color: 'text-emerald-500',
    title: 'Brittle & Inconsistent Results',
    desc: 'An instruction that works once can completely break on the next model version. Standardizing LLM response formats requires advanced prompts structure that is hard to build manually.'
  }
];

export default function Problem() {
  return (
    <section id="problems" className="section relative overflow-hidden py-24 border-y border-slate-200 dark:border-white/4">
      {/* Subtle grid accent overlay */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-orange-600/5 blur-[90px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="badge badge-purple px-4 py-1.5 text-xs mb-4">
            <AlertCircle size={12} className="inline mr-1" />
            The Friction of Modern AI
          </span>
          <h2 
            className="font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Why Prompting is <span className="gradient-text">Harder Than It Looks</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Struggling with AI responses isn't your fault—writing optimized, predictable instructions is a specialized science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEMS.map((prob, i) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card card-hover p-8 flex flex-col justify-between h-full bg-white/[0.01] border-white/6 hover:border-amber-500/25 relative"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center mb-6 border border-slate-200 dark:border-white/6 ${prob.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-4 font-display" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {prob.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">
                    {prob.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
