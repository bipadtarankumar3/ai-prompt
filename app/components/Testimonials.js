'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const T = [
  { name: 'Sarah Chen',     role: 'AI Artist',               avatar: '👩‍🎨', badge: 'Midjourney', rating: 5, text: 'Prompt Beast completely transformed my Midjourney workflow. I went from spending 30 minutes crafting prompts to getting perfect results in seconds. Absolutely incredible!' },
  { name: 'Marcus Williams',role: 'Senior Engineer',          avatar: '🧑‍💻', badge: 'Coding',     rating: 5, text: 'The coding prompts are insanely detailed. It adds context I would never think to include, and GPT-4 output quality is night and day better.' },
  { name: 'Priya Sharma',   role: 'Marketing Director',       avatar: '👩‍💼', badge: 'Marketing',  rating: 5, text: 'Our content team\'s output quality doubled in the first week. The marketing prompts genuinely produce results that convert. Worth every penny.' },
  { name: 'James O\'Brien', role: 'YouTube Creator (500K)',   avatar: '🎬',   badge: 'YouTube',    rating: 5, text: 'The YouTube script prompts are GOLD. My audience retention went up 40% after using AI scripts generated with Prompt Beast templates.' },
  { name: 'Mei Tanaka',     role: 'Startup Founder',          avatar: '🚀',   badge: 'Business',   rating: 5, text: 'Used the business plan prompts to prep for our Series A. The structured output helped us articulate our vision so clearly. We closed the round!' },
  { name: 'Alex Rivera',    role: 'Freelance Copywriter',     avatar: '✍️',   badge: 'Blogging',   rating: 5, text: 'As a copywriter I was skeptical about AI tools. Prompt Beast is different — it enhances creativity instead of replacing it. My secret weapon.' },
];

export default function Testimonials() {
  return (
    <section className="section relative overflow-hidden py-24 z-10">
      
      {/* Dynamic Background Atom Orbits & Bubble Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-60 dark:opacity-30">
        
        {/* Faint Central Atom Orbits */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* Orbit Track 1 */}
          <motion.div 
            className="absolute rounded-full border border-amber-500/10 dark:border-amber-500/5"
            style={{ width: '680px', height: '680px' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          >
            {/* Orbiting core particle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-500/30 rounded-full blur-[1px] shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
          </motion.div>

          {/* Orbit Track 2 */}
          <motion.div 
            className="absolute rounded-full border border-dashed border-orange-500/10 dark:border-orange-500/5"
            style={{ width: '480px', height: '480px' }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
          >
            {/* Orbiting particle */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 bg-orange-500/40 rounded-full blur-[1px] shadow-[0_0_8px_rgba(234,88,12,0.3)]" />
          </motion.div>

          {/* Orbit Track 3 */}
          <motion.div 
            className="absolute rounded-full border border-emerald-500/10 dark:border-emerald-500/5"
            style={{ width: '320px', height: '320px' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
          >
            {/* Orbiting particle */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500/40 rounded-full blur-[1px]" />
          </motion.div>
        </div>

        {/* Ambient Drifting Bubble Particles */}
        {[...Array(6)].map((_, i) => {
          const left = [8, 22, 78, 88, 48, 92][i];
          const top = [15, 78, 12, 82, 38, 52][i];
          const size = [35, 50, 25, 70, 45, 40][i];
          const duration = [16, 22, 14, 28, 18, 20][i];
          const delay = [0, 1.5, 3, 0.5, 2, 4][i];

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-tr from-amber-500/5 to-orange-500/5 dark:from-amber-500/[0.03] dark:to-orange-500/[0.03] blur-[6px]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-12, 12, -12],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Loved By Thousands</p>
          <h2 className="font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            What Our Users Are <span className="gradient-text">Saying</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {T.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="card card-hover p-6 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-amber-400" fill="currentColor" />)}
              </div>
              <p className="text-white/60 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate">{t.name}</p>
                  <p className="text-xs text-white/35 truncate">{t.role}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex-shrink-0">
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
