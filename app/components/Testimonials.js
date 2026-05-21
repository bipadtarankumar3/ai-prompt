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
    <section className="section">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Loved By Thousands</p>
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-700/60 to-indigo-700/60 border border-violet-600/20 flex items-center justify-center text-xl flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 truncate">{t.name}</p>
                  <p className="text-xs text-white/35 truncate">{t.role}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/12 border border-violet-500/20 text-violet-300 flex-shrink-0">
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
