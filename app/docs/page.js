'use client';

import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, ChevronRight, Zap, RefreshCw, Cpu, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    id: 'intro',
    title: 'Getting Started',
    icon: <BookOpen className="w-5 h-5 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">
          Welcome to **Prompt Beast**. Our platform is designed to bridge the gap between simple ideas and professional-grade AI prompts. Whether you are using ChatGPT, Midjourney, or open-source models, Prompt Beast optimizes your inputs for maximum output quality.
        </p>
        <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Quick steps to get started:</p>
          <ol className="list-decimal list-inside text-sm text-white/60 space-y-1 pl-1">
            <li>Navigate to the <a href="/generator" className="text-purple-400 hover:underline">Generator</a> workspace.</li>
            <li>Select a **Mode** (Generate, Improve, or Rewrite).</li>
            <li>Type in your core idea or paste an existing prompt.</li>
            <li>Configure the **Category**, **Tone**, and **AI Provider**.</li>
            <li>Click **Generate** and copy your prompt!</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'modes',
    title: 'Prompt Builder Modes',
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    content: (
      <div className="space-y-5">
        <p className="text-sm text-white/70 leading-relaxed">
          Prompt Beast offers three unique operational modes depending on your specific requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/3">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-violet-400" />
              <span className="text-sm font-bold text-white">Generate</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Turns brief ideas (e.g. "fitness email list") into full-length, structured prompts with context, guidelines, and output constraints.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-sm font-bold text-white">Improve</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Analyzes your existing prompt and expands it with role specifications, formatted delimiters, and step-by-step reasoning flags.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/3">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={14} className="text-violet-400" />
              <span className="text-sm font-bold text-white">Rewrite</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Reformats your prompt into alternative structures or adapts it for different LLM formats (e.g. switching from Claude XML tags to simple ChatGPT headers).
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'providers',
    title: 'AI Providers & Models',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">
          We leverage a hybrid compute structure to provide both premium model generations and open-source versatility:
        </p>
        <ul className="space-y-3">
          <li className="text-sm text-white/70 leading-relaxed">
            <strong className="text-white">OpenAI (GPT-4o Mini)</strong>: Recommended for advanced logical tasks, programming, marketing copy, and multi-step complex instructions. Extremely reliable with high coherence.
          </li>
          <li className="text-sm text-white/70 leading-relaxed">
            <strong className="text-white">Hugging Face Models</strong>: Access open-source giants such as **Qwen 2.5**, **Llama 3**, and **Mistral**. Ideal for developers, custom pipelines, or privacy-conscious users who prefer open weights.
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <div className="border-b border-white/5 pb-3">
          <p className="text-sm font-bold text-white mb-1">Is Prompt Beast free to use?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Yes, our Free plan includes generous Hugging Face inference tokens and core template access. Advanced GPT-4o generations are available on our Pro plan.
          </p>
        </div>
        <div className="border-b border-white/5 pb-3">
          <p className="text-sm font-bold text-white mb-1">Can I save my configurations?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Yes, our built-in Prompt History panel stores your last 50 configurations directly inside your browser local storage. No login required.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white mb-1">How can I integrate this into my application?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Developers can call our backend services programmatically. Refer to our <a href="/api-reference" className="text-purple-400 hover:underline">API Reference</a> for details.
          </p>
        </div>
      </div>
    )
  }
];

export default function DocsPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/5 pb-8 mb-12">
            <p className="section-label mb-2">Help Center</p>
            <h1 className="section-title mb-4">Documentation</h1>
            <p className="text-sm text-white/50 max-w-xl">
              Learn how to build optimal prompts, leverage LLM providers, and maximize your prompting workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Nav links */}
            <aside className="lg:col-span-1 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/25 px-3 mb-2">Sections</p>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-between group transition-all"
                >
                  {sec.title}
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                </button>
              ))}
            </aside>

            {/* Content areas */}
            <div className="lg:col-span-3 space-y-8">
              {SECTIONS.map((sec) => (
                <div key={sec.id} id={sec.id} className="glass-card p-6 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      {sec.icon}
                    </div>
                    <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                      {sec.title}
                    </h2>
                  </div>
                  {sec.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
