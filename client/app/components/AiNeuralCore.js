'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, Activity, Zap } from 'lucide-react';

const ORBITING_NODES = [
  { size: 'w-2 h-2', color: 'text-amber-400 bg-amber-400', radius: '150px', delay: 0, duration: 12 },
  { size: 'w-3 h-3', color: 'text-orange-500 bg-orange-500', radius: '230px', delay: 2, duration: 18 },
  { size: 'w-1.5 h-1.5', color: 'text-emerald-400 bg-emerald-400', radius: '100px', delay: 1, duration: 8 },
  { size: 'w-2 h-2', color: 'text-amber-300 bg-amber-300', radius: '300px', delay: 4, duration: 24 },
  { size: 'w-2.5 h-2.5', color: 'text-orange-400 bg-orange-400', radius: '360px', delay: 0.5, duration: 30 },
];

export default function AiNeuralCore() {
  return (
    <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center select-none group">
      
      {/* Background Neural Glows */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-amber-500/15 dark:bg-amber-500/10 blur-[60px] group-hover:bg-amber-500/20 transition-colors duration-500" />
      <div className="absolute w-[180px] h-[180px] rounded-full bg-orange-500/15 dark:bg-orange-500/10 blur-[40px] dark:mix-blend-screen animate-pulse" />

      {/* Orbit 1: Outer Dotted Trace Ring (360px) */}
      <motion.div
        className="absolute rounded-full border border-slate-900/[0.06] dark:border-white/[0.03] border-dashed"
        style={{ width: '360px', height: '360px' }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
      />

      {/* Orbit 2: Large Dashboard Ring (300px) */}
      <motion.div
        className="absolute rounded-full border border-slate-900/[0.08] dark:border-white/[0.05]"
        style={{ width: '300px', height: '300px' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
      >
        {/* Decorative segment lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-500/40 rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-500/40 rounded-full" />
      </motion.div>

      {/* Orbit 3: Middle Dashed Ring (230px) */}
      <motion.div
        className="absolute rounded-full border border-dashed border-slate-900/[0.1] dark:border-white/[0.07]"
        style={{ width: '230px', height: '230px' }}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 15 }}
      />

      {/* Orbit 4: Inner Core Tracker Ring (150px) */}
      <motion.div
        className="absolute rounded-full border border-slate-900/[0.12] dark:border-white/[0.09] bg-slate-900/[0.01] dark:bg-white/[0.01] backdrop-blur-[1px]"
        style={{ width: '150px', height: '150px' }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 10 }}
      />

      {/* Orbit 5: Deep Inner Pulse Ring (100px) */}
      <div 
        className="absolute rounded-full border border-amber-500/30 dark:border-amber-500/10 animate-ping pointer-events-none"
        style={{ width: '100px', height: '100px', animationDuration: '3s' }}
      />

      {/* Orbiting Synapse Particles */}
      {ORBITING_NODES.map((node, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: node.duration, delay: node.delay }}
          style={{ width: node.radius, height: node.radius }}
        >
          {/* Glowing particle sliding along its orbit path */}
          <div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${node.color} ${node.size} shadow-[0_0_12px_rgba(245,158,11,0.6)] group-hover:scale-125 transition-transform duration-300`} 
          />
          {/* Subtle trail particle */}
          <div 
            className={`absolute top-1 left-1/2 -translate-x-1/2 rounded-full ${node.color} opacity-30`}
            style={{ width: '3px', height: '3px', transform: 'rotate(-4deg) translateY(-2px)' }}
          />
        </motion.div>
      ))}

      {/* Futuristic Interactive Quantum Core Sphere */}
      <motion.div
        className="relative z-10 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {/* Core Glowing Border Ring */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300 animate-pulse" />
        
        {/* Inner Solid Tech Shield */}
        <div className="w-20 h-20 rounded-full bg-slate-950/95 dark:bg-slate-950/90 border border-amber-500/30 flex items-center justify-center relative shadow-[0_0_25px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] group-hover:border-amber-400 transition-all duration-300">
          
          {/* Core Central Active Icon */}
          <Sparkles className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_#f59e0b] group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Ticking Tech Accents around core */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="6 35" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1" strokeDasharray="3 15" />
          </svg>

          {/* Micro Ripples */}
          <div className="absolute -inset-1 rounded-full border border-amber-500/40 dark:border-amber-500/15 animate-ping pointer-events-none opacity-40" />
        </div>
      </motion.div>

    </div>
  );
}
