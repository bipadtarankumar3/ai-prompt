'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Mail, Image, ArrowRight, CornerDownRight, Sparkles } from 'lucide-react';

const TABS = [
  {
    id: 'copy',
    label: 'Copywriting',
    icon: Mail,
    before: 'Write marketing email',
    after: `Act as a conversion copywriter.
Create an email campaign targeting SaaS founders.
Include pain points.
Create CTA variations.`,
    outcome: 'Delivers high-converting copywriting tailored directly to B2B targets.',
    color: 'amber'
  },
  {
    id: 'code',
    label: 'Coding',
    icon: Terminal,
    before: 'Generate API code',
    after: `You are a senior backend engineer.
Create scalable REST API architecture.
Include retries.
Validation.
Error handling.
Testing.`,
    outcome: 'Generates robust, secure, and production-ready server API configurations.',
    color: 'orange'
  },
  {
    id: 'art',
    label: 'Creative Art',
    icon: Image,
    before: 'design a logo',
    after: `A minimalist vector logo of a modern SaaS tech company.
Geometry, balance, clean lines, golden ratio grid proportion.
Color palette: Amber and dark slate grey.
Parameters: --ar 1:1 --v 6.0 --style raw`,
    outcome: 'Delivers high-resolution vector assets without visual artifacts.',
    color: 'emerald'
  }
];

export default function Transformation() {
  const [activeTab, setActiveTab] = useState('copy');
  const current = TABS.find((t) => t.id === activeTab);

  return (
    <section id="transformation" className="section py-24 border-b border-slate-100 dark:border-white/4 bg-slate-50/30 dark:bg-black/10">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge badge-purple px-4 py-1.5 text-xs mb-4">
            <Sparkles size={12} className="inline mr-1" />
            Before vs. After
          </span>
          <h2 
            className="font-bold text-white mb-4 font-display"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            See The <span className="gradient-text">Difference Better Prompts Make</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed font-sans">
            See how Revoxera replaces ambiguous phrasing with high-precision guidelines to direct AI behavior.
          </p>
        </div>

        {/* Premium Segmented Tab Selector */}
        <div className="flex justify-center gap-1 mb-12 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl max-w-[420px] mx-auto border border-slate-200/50 dark:border-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-white dark:bg-white/10 text-amber-550 dark:text-amber-400 shadow-sm border border-slate-200/40 dark:border-white/5'
                    : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Before Container (Light Card in Light Mode, Dark in Dark Mode) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-7 rounded-3xl border border-slate-200 dark:border-white/6 bg-white dark:bg-[#0b0b14]/50 relative min-h-[220px] shadow-sm">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-red-500 dark:text-red-400/70 mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Raw Input Prompt (Vague)
              </div>
              <p className="text-sm font-mono text-slate-500 dark:text-white/50 bg-slate-50 dark:bg-white/[0.01] p-4 rounded-xl border border-slate-100 dark:border-white/4 leading-relaxed">
                &ldquo;{current.before}&rdquo;
              </p>
            </div>
            
            <div className="mt-6 flex items-start gap-2.5 text-xs text-slate-400 dark:text-white/30 border-t border-slate-100 dark:border-white/4 pt-4 leading-normal font-sans">
              <AlertDot />
              AI struggles: guesses context, outputs generic copy, requires multiple corrections.
            </div>
          </div>

          {/* Transformation Arrow */}
          <div className="lg:col-span-2 flex items-center justify-center py-4 lg:py-0">
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] flex items-center justify-center text-amber-550 dark:text-amber-400 animate-pulse shadow-sm">
              <ArrowRight size={20} className="rotate-90 lg:rotate-0" />
            </div>
          </div>

          {/* After Container (Always Dark/High Contrast for visual impact) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-7 rounded-3xl relative min-h-[280px] shadow-xl" style={{ backgroundColor: '#0b0b14', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Revoxera Optimized Prompt (Predictable)
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] border border-amber-500/35 bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wide">Active</span>
              </div>
              <pre className="text-xs font-mono bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[230px] scrollbar-none" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {current.after}
              </pre>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-xs rounded-xl p-3.5 leading-normal border font-sans" style={{ color: '#fde68a', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <CornerDownRight size={14} className="flex-shrink-0" />
              <span><strong>Outcome:</strong> {current.outcome}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function AlertDot() {
  return (
    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-500/40 flex items-center justify-center mt-0.5">
      <span className="w-1 h-1 rounded-full bg-red-500" />
    </span>
  );
}
