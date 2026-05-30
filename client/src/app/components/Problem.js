'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Clock, AlertTriangle, Info, AlertCircle, RefreshCw } from 'lucide-react';

const PROBLEMS = [
  {
    icon: HelpCircle,
    color: 'text-amber-500',
    title: 'Too Vague',
    desc: 'Simple, one-sentence instructions produce basic, generic responses. AI needs structured guidelines, roles, and constraints to output high-quality professional results.'
  },
  {
    icon: Info,
    color: 'text-orange-500',
    title: 'Missing Context',
    desc: 'Without explicit context, target audience details, and role assignments, the model is forced to guess your intent, leading to irrelevant or off-target outputs.'
  },
  {
    icon: AlertTriangle,
    color: 'text-red-500',
    title: 'Inconsistent Outputs',
    desc: 'A prompt that works well today can deliver wildly different formatting or tone tomorrow. Stabilizing outputs requires rigorous structure that models can follow predictably.'
  },
  {
    icon: Clock,
    color: 'text-violet-500',
    title: 'Time Wasted',
    desc: 'Spending hours in a trial-and-error loop trying to adjust prompt phrasing, burning through API credits, and manually fixing poor drafts cuts your productivity in half.'
  },
  {
    icon: RefreshCw,
    color: 'text-emerald-500',
    title: 'Unpredictable AI Results',
    desc: 'Sudden model updates can cause prompt behavior to shift unexpectedly. Structured boundaries prevent outputs from drifting and keep production integrations safe.'
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
            className="font-bold text-white mb-2 font-display"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Why Most <span className="gradient-text">AI Prompts Fail</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base font-medium tracking-wide uppercase mt-3 font-mono">
            Better prompts create better outputs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {PROBLEMS.map((prob, i) => {
            const Icon = prob.icon;
            return (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card card-hover p-6 flex flex-col justify-between bg-white/[0.01] border-white/6 hover:border-amber-500/25 relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] min-w-[250px] max-w-[340px]"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center mb-6 border border-slate-200 dark:border-white/6 ${prob.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-4 font-display" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {prob.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed font-sans">
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
