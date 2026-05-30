'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Copy, Check, Terminal, Mail, Image, ArrowRight } from 'lucide-react';

const DEMOS = [
  {
    type: 'Developer',
    icon: Terminal,
    rough: 'make a button component in react',
    optimized: `Act as a senior front-end engineer. Write a highly reusable, accessible, and responsive button component in React 19 and Tailwind CSS v4.

Requirements:
- Props for variants (primary, secondary, danger, ghost), size (sm, md, lg), and full HTML button attributes.
- Include full WAI-ARIA attributes (aria-disabled, roles, keyboard focus accessibility).
- Styling using Tailwind's utility classes, supporting clean hover, active, and focus-visible states.
- Support optional icon placement (start/end) using React nodes.`,
    color: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5'
  },
  {
    type: 'Marketer',
    icon: Mail,
    rough: 'write a cold email to sell software',
    optimized: `Act as a world-class SaaS B2B copywriter. Draft a highly personalized, high-converting cold outreach email targeting CTOs.

Goal: Secure a 5-minute introductory demo for Revoxera AI.
Structure:
- Subject Line: Direct, curiosity-piquing (under 50 characters).
- Hook: Acknowledge the exact pain point (hours wasted on bad LLM outputs).
- Value Prop: Explain how structuring prompts once saves developers 10+ hours/week.
- Call to Action: Low-friction, single-click response request.`,
    color: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5'
  },
  {
    type: 'Creator',
    icon: Image,
    rough: 'midjourney prompt for a futuristic city',
    optimized: `A cinematic wide shot of a futuristic cyber-organic metropolis at dusk.

Details:
- High-fashion architecture with vertical biophilic gardens, glowing orange neon lines intersecting teal glass skyscrapers.
- Volumetric fog catches warm golden hour light, reflecting off wet dark asphalt.
- Shot on 35mm film, 24mm wide-angle lens, cinematic composition, Unreal Engine 5 render details.
- Parameters: --ar 16:9 --v 6.0 --stylize 250`,
    color: 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5'
  }
];

export default function PromptDemo() {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: Typing, 1: Clicking/Optimizing, 2: Showing Result
  const [typedRough, setTypedRough] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const currentDemo = DEMOS[index];
  const Icon = currentDemo.icon;

  useEffect(() => {
    let roughText = currentDemo.rough;
    let currentIdx = 0;
    setTypedRough('');
    setStep(0);

    const typeInterval = setInterval(() => {
      if (currentIdx < roughText.length) {
        setTypedRough((prev) => prev + roughText.charAt(currentIdx));
        currentIdx++;
      } else {
        clearInterval(typeInterval);
        
        // Wait then trigger optimization
        timerRef.current = setTimeout(() => {
          setStep(1); // Optimizing
          
          timerRef.current = setTimeout(() => {
            setStep(2); // Show result
            
            // Wait, then advance to next demo
            timerRef.current = setTimeout(() => {
              setIndex((prev) => (prev + 1) % DEMOS.length);
            }, 6000);
          }, 1200);
        }, 1000);
      }
    }, 45);

    return () => {
      clearInterval(typeInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDemo.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto glass-card overflow-hidden shadow-2xl relative border border-slate-200 dark:border-white/8 bg-white/80 dark:bg-[#0b0b14]/90 backdrop-blur-md">
      {/* Top Mac-style bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/6 bg-slate-50 dark:bg-[#0d0d18]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="text-[11px] font-medium font-mono text-slate-400 dark:text-white/35">revoxera.ai/generator</div>
        <div className="w-12" />
      </div>

      <div className="p-5 flex flex-col gap-4.5 min-h-[380px] justify-between">
        
        {/* Input area */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40">Your Rough Idea</span>
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-medium transition-all ${currentDemo.color}`}>
              <Icon size={12} />
              {currentDemo.type}
            </span>
          </div>
          
          <div className="relative rounded-xl p-4 text-sm font-mono min-h-[58px] flex items-center leading-relaxed border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.02] text-slate-800 dark:text-white/80">
            {typedRough}
            {step === 0 && <span className="w-1.5 h-4 bg-amber-500 ml-0.5 animate-pulse inline-block" />}
          </div>
        </div>

        {/* Action Button Sim */}
        <div className="flex justify-center">
          <motion.div
            animate={step === 1 ? { scale: 0.95 } : { scale: 1 }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
              step >= 1 
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]' 
                : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50'
            }`}
          >
            <Sparkles size={13} className={step === 1 ? 'animate-spin' : ''} />
            {step === 0 && 'Awaiting Input...'}
            {step === 1 && 'Optimizing Prompt...'}
            {step === 2 && 'Prompt Optimized!'}
          </motion.div>
        </div>

        {/* Output area */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40">Revoxera Output</span>
            {step === 2 && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] hover:text-slate-800 dark:hover:text-white/80 transition-colors rounded px-2 py-0.5 border border-slate-200 dark:border-white/8 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60"
              >
                {copied ? <Check size={12} className="text-green-600 dark:text-green-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="relative rounded-xl overflow-y-auto leading-relaxed h-[170px] scrollbar-none flex flex-col justify-start p-4 border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-[#09090e]">
            <AnimatePresence mode="wait">
              {step === 2 ? (
                <motion.pre
                  key="output"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="whitespace-pre-wrap text-left font-sans text-[12px] leading-relaxed text-slate-800 dark:text-white/80"
                >
                  {currentDemo.optimized}
                </motion.pre>
              ) : step === 1 ? (
                <motion.div 
                  key="loading"
                  className="flex flex-col gap-2 w-full mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/5 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  className="italic flex items-center justify-center h-full text-center text-slate-300 dark:text-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                >
                  System idle. Enter brief prompt to optimize.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
