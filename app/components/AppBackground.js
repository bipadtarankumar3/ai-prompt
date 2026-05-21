'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBackground } from './BackgroundProvider';

// Atom definition
const ATOMS = [
  {
    id: 1,
    top: '15%',
    left: '10%',
    size: 260,
    coreColor: 'bg-amber-500 dark:bg-amber-500',
    coreGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    orbits: [
      { size: 140, tiltX: 65, tiltY: 20, tiltZ: 0, duration: 18, clockwise: true, color: 'border-amber-500/15 dark:border-amber-500/5', particleColor: 'bg-amber-500 dark:bg-amber-400' },
      { size: 200, tiltX: 45, tiltY: -35, tiltZ: 30, duration: 25, clockwise: false, color: 'border-orange-500/15 dark:border-orange-500/5', particleColor: 'bg-orange-500 dark:bg-orange-400' },
      { size: 260, tiltX: -25, tiltY: 55, tiltZ: -45, duration: 32, clockwise: true, color: 'border-emerald-500/15 dark:border-emerald-500/5', particleColor: 'bg-emerald-500 dark:bg-emerald-400' }
    ]
  },
  {
    id: 2,
    top: '40%',
    left: '80%',
    size: 320,
    coreColor: 'bg-orange-500 dark:bg-orange-500',
    coreGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    orbits: [
      { size: 160, tiltX: 55, tiltY: -15, tiltZ: 10, duration: 22, clockwise: false, color: 'border-orange-500/15 dark:border-orange-500/5', particleColor: 'bg-orange-500 dark:bg-orange-450' },
      { size: 240, tiltX: 35, tiltY: 45, tiltZ: -20, duration: 28, clockwise: true, color: 'border-amber-500/15 dark:border-amber-500/5', particleColor: 'bg-amber-500 dark:bg-amber-450' },
      { size: 320, tiltX: -45, tiltY: 25, tiltZ: 60, duration: 36, clockwise: false, color: 'border-violet-500/15 dark:border-violet-500/5', particleColor: 'bg-violet-500 dark:bg-violet-400' }
    ]
  },
  {
    id: 3,
    top: '75%',
    left: '15%',
    size: 280,
    coreColor: 'bg-emerald-500 dark:bg-emerald-500',
    coreGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    orbits: [
      { size: 150, tiltX: -50, tiltY: 35, tiltZ: -10, duration: 20, clockwise: true, color: 'border-emerald-500/15 dark:border-emerald-500/5', particleColor: 'bg-emerald-500 dark:bg-emerald-400' },
      { size: 220, tiltX: 60, tiltY: -25, tiltZ: 40, duration: 30, clockwise: false, color: 'border-amber-500/15 dark:border-amber-500/5', particleColor: 'bg-amber-500 dark:bg-amber-400' }
    ]
  },
  {
    id: 4,
    top: '82%',
    left: '75%',
    size: 240,
    coreColor: 'bg-violet-500 dark:bg-violet-500',
    coreGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
    orbits: [
      { size: 130, tiltX: 40, tiltY: 50, tiltZ: 15, duration: 16, clockwise: false, color: 'border-violet-500/15 dark:border-violet-500/5', particleColor: 'bg-violet-500 dark:bg-violet-400' },
      { size: 200, tiltX: -55, tiltY: -35, tiltZ: -30, duration: 24, clockwise: true, color: 'border-orange-500/15 dark:border-orange-500/5', particleColor: 'bg-orange-500 dark:bg-orange-400' }
    ]
  }
];

export default function AppBackground() {
  const { backgroundEffect, mounted } = useBackground();
  const [bubbles, setBubbles] = useState([]);

  // Generate bubbles on mount to ensure randomize parameters are consistent on client side
  useEffect(() => {
    if (!mounted) return;

    const generatedBubbles = Array.from({ length: 18 }).map((_, i) => {
      // Pick sizes ranging from 30px to 130px
      const size = Math.floor(Math.random() * 100) + 30;
      // Start X position scattered across screen width
      const left = Math.floor(Math.random() * 92) + 4;
      // Travel duration between 18s and 45s
      const duration = Math.floor(Math.random() * 27) + 18;
      // Staggered start delay
      const delay = Math.random() * 10;
      // Gradient colors mapped to custom branding colors
      const gradients = [
        'from-amber-500/6 to-orange-500/6 dark:from-amber-500/[0.03] dark:to-orange-500/[0.03]',
        'from-orange-500/6 to-violet-500/6 dark:from-orange-500/[0.02] dark:to-violet-500/[0.02]',
        'from-violet-500/6 to-emerald-500/6 dark:from-violet-500/[0.03] dark:to-emerald-500/[0.03]',
        'from-emerald-500/6 to-amber-500/6 dark:from-emerald-500/[0.02] dark:to-amber-500/[0.02]'
      ];
      const colorClass = gradients[i % gradients.length];

      return {
        id: i,
        size,
        left,
        duration,
        delay,
        colorClass
      };
    });

    setBubbles(generatedBubbles);
  }, [mounted]);

  // Don't render animations during server-side build or pre-hydration
  if (!mounted || backgroundEffect === 'none') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* --- ATOM MODE BACKGROUND --- */}
      {backgroundEffect === 'atom' && (
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
          {ATOMS.map((atom, idx) => (
            <div
              key={atom.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none
                ${idx === 0 ? 'block' : idx === 1 ? 'block' : idx === 2 ? 'hidden md:block' : 'hidden lg:block'}`}
              style={{
                top: atom.top,
                left: atom.left,
                width: atom.size,
                height: atom.size,
              }}
            >
              {/* Nucleus Glow Backdrop */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full bg-slate-900/5 dark:bg-slate-900/0 blur-md" />

              {/* Pulsing Core Nucleus */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className={`w-3.5 h-3.5 rounded-full ${atom.coreColor} ${atom.coreGlow}`} />
                <div className={`absolute w-7 h-7 rounded-full border border-amber-500/20 dark:border-amber-500/10 animate-ping opacity-60`} style={{ animationDuration: '3s' }} />
              </div>

              {/* Orbiting Tracks & Particles */}
              {atom.orbits.map((orbit, orbitIdx) => (
                <div
                  key={orbitIdx}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    transform: `translate(-50%, -50%) rotateX(${orbit.tiltX}deg) rotateY(${orbit.tiltY}deg) rotateZ(${orbit.tiltZ}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Orbit Ring */}
                  <div
                    className={`rounded-full border border-dashed ${orbit.color}`}
                    style={{
                      width: orbit.size,
                      height: orbit.size,
                    }}
                  />

                  {/* Electron Particle */}
                  <motion.div
                    className="absolute"
                    style={{
                      width: orbit.size,
                      height: orbit.size,
                    }}
                    animate={{ rotate: orbit.clockwise ? 360 : -360 }}
                    transition={{
                      repeat: Infinity,
                      ease: 'linear',
                      duration: orbit.duration,
                    }}
                  >
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${orbit.particleColor} shadow-[0_0_8px_rgba(245,158,11,0.6)]`}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* --- BUBBLE MODE BACKGROUND --- */}
      {backgroundEffect === 'bubble' && (
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className={`absolute rounded-full bg-gradient-to-tr ${bubble.colorClass} border border-white/[0.04] dark:border-white/[0.02] backdrop-blur-[1px]`}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.left}%`,
              }}
              initial={{ y: '110vh' }}
              animate={{
                y: ['110vh', '-15vh'],
                x: [0, 40, -40, 25, -25, 0],
              }}
              transition={{
                y: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: bubble.delay,
                },
                x: {
                  duration: bubble.duration * 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
