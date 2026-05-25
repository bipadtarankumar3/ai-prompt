'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is Revoxera AI free to use?', a: 'Yes! Revoxera AI offers a generous free tier powered by Hugging Face open-source models. For Gemini 1.5 access, provide your own OpenAI API key or upgrade to Pro.' },
  { q: 'Which AI models does Revoxera AI support?', a: 'We support OpenAI Gemini 1.5 Flash and multiple Hugging Face models: Qwen 2.5 7B, Mistral 7B, DeepSeek R1, Phi 3.5 Mini, and Zephyr 7B.' },
  { q: 'How do I add my OpenAI API key?', a: 'Add your OPENAI_API_KEY to the .env.local file when self-hosting. Your key is never stored in a database — it stays in environment variables only.' },
  { q: 'Is my data and API key secure?', a: 'All AI calls happen server-side in Next.js API routes. Your API key is never exposed to the browser. We also implement rate limiting (20 req/min) and input sanitization.' },
  { q: 'What makes these prompts better than writing them myself?', a: 'Revoxera AI adds proven prompt engineering techniques: role assignment, context layering, output format specs, chain-of-thought triggers, and category-specific patterns.' },
  { q: 'Can I save and access my prompt history?', a: 'Yes! The last 50 prompts are auto-saved to your browser\'s localStorage. Click the History button to browse, reload, or delete old prompts.' },
  { q: 'Does it work for Midjourney prompts?', a: 'Absolutely. The Midjourney category adds lighting descriptions, camera specs, style modifiers, quality parameters, and proper --ar and --style flags automatically.' },
  { q: 'How do I deploy this to Vercel?', a: 'Push to GitHub, connect to Vercel, add OPENAI_API_KEY and HF_TOKEN in the dashboard Environment Variables, then deploy. Takes under 5 minutes.' },
];

function Item({ faq, i }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.04 }}
      className={`border rounded-2xl overflow-hidden transition-colors duration-200
        ${open ? 'border-violet-500/35 bg-violet-600/5' : 'border-white/7 bg-white/2 hover:border-white/12'}`}
    >
      <button id={`faq-${i}`} onClick={() => setOpen(!open)} suppressHydrationWarning
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer">
        <span className="text-sm font-semibold text-white/85">{faq.q}</span>
        <ChevronDown size={18}
          className={`text-violet-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-white/45 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3">Got Questions?</p>
          <h2 className="font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => <Item key={i} faq={f} i={i} />)}
        </div>
      </div>
    </section>
  );
}
