'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Copy, Check, Code, Zap, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import Footer from '../components/Footer';

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.revoxera.com/v1/generate \\
  -H "Authorization: Bearer pb_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userInput": "A landing page for a SaaS",
    "category": "Marketing",
    "tone": "Professional",
    "mode": "generate",
    "provider": "openai"
  }'`,
  javascript: `const res = await fetch('https://api.revoxera.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pb_live_your_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userInput: "A landing page for a SaaS",
    category: "Marketing",
    tone: "Professional",
    mode: "generate",
    provider: "openai"
  })
});

const data = await res.json();
console.log(data.result);`,
  python: `import requests

url = "https://api.revoxera.com/v1/generate"
headers = {
    "Authorization": "Bearer pb_live_your_key",
    "Content-Type": "application/json"
}
payload = {
    "userInput": "A landing page for a SaaS",
    "category": "Marketing",
    "tone": "Professional",
    "mode": "generate",
    "provider": "openai"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json()["result"])`,
};

const PARAMS = [
  {
    name: 'userInput',
    type: 'string',
    required: true,
    desc: 'The core concept, prompt, or raw input you want optimized.',
  },
  {
    name: 'category',
    type: 'string',
    required: false,
    desc: 'Target area: ChatGPT, Midjourney, Marketing, SEO, Coding, YouTube, Blogging, Business.',
  },
  {
    name: 'tone',
    type: 'string',
    required: false,
    desc: 'Delivery tone: Professional, Creative, Funny, Expert, or Minimal.',
  },
  {
    name: 'mode',
    type: 'string',
    required: false,
    desc: 'Operation: generate, improve, or rewrite. Defaults to generate.',
  },
  {
    name: 'provider',
    type: 'string',
    required: false,
    desc: 'Inference backend: openai or huggingface. Defaults to openai.',
  },
];

export default function ApiReferencePage() {
  const [lang, setLang]     = useState('curl');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="api-reference" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">

          {/* ── Page Header ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border-b border-white/8 pb-8 mb-10"
          >
            <p className="section-label mb-2">Developers</p>
            <h1 className="section-title mb-3">API Reference</h1>
            <p className="text-sm text-white/50 max-w-xl leading-relaxed">
              Integrate Revoxera AI optimization directly into your workflows and applications via a simple HTTPS API.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── Left — Specs ─────────────────────────────── */}
            <div className="lg:col-span-7 space-y-5">

              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="glass-card p-5 md:p-6"
              >
                <h2 className="text-base font-bold text-white/90 mb-3 flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  <Terminal size={16} className="text-purple-400 shrink-0" />
                  Overview
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  Our API provides direct HTTPS endpoints to programmatically generate, improve, or rewrite prompts using structured categories, tones, and optimized logic. All requests and responses use standard JSON.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['REST API', 'JSON', 'Bearer Auth', 'HTTPS Only'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-[11px] font-semibold text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Authentication */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5 md:p-6"
              >
                <h2 className="text-base font-bold text-white/90 mb-3 flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  <Shield size={16} className="text-purple-400 shrink-0" />
                  Authentication
                </h2>
                <p className="text-sm text-white/60 leading-relaxed mb-3">
                  Pass your API key as a Bearer token in every request header:
                </p>
                <div className="api-code-block rounded-xl p-4 font-mono text-xs text-white/80 select-all border border-white/6">
                  Authorization: Bearer pb_live_your_api_key
                </div>
                <p className="text-xs text-white/35 mt-3 flex items-center gap-1.5">
                  <ArrowRight size={11} className="text-purple-400" />
                  Keys are scoped per account. Never expose them client-side.
                </p>
              </motion.div>

              {/* Endpoint */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-5 md:p-6"
              >
                {/* Title + Method */}
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/6">
                  <div>
                    <h2 className="text-base font-bold text-white/90"
                        style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                      Generate Prompt
                    </h2>
                    <p className="text-[11px] font-mono text-purple-400 mt-0.5">
                      https://api.revoxera.com/v1/generate
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    POST
                  </span>
                </div>

                {/* Parameters */}
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-3">
                  Request Body (JSON)
                </h3>
                <div className="space-y-0">
                  {PARAMS.map((p, i) => (
                    <div
                      key={p.name}
                      className={`flex items-start gap-3 py-3 ${i < PARAMS.length - 1 ? 'border-b border-white/5' : ''}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-xs font-bold font-mono text-white/85">{p.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            p.required
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                              : 'bg-white/4 border-white/8 text-white/35'
                          }`}>
                            {p.required ? 'required' : 'optional'}
                          </span>
                          <span className="text-[10px] font-mono text-white/25">{p.type}</span>
                        </div>
                        <p className="text-[11px] text-white/45 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Response shape */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5 md:p-6"
              >
                <h2 className="text-base font-bold text-white/90 mb-3 flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  <Zap size={16} className="text-purple-400 shrink-0" />
                  Response
                </h2>
                <div className="api-code-block rounded-xl p-4 font-mono text-xs leading-relaxed border border-white/6">
                  <span className="text-white/30">{'{'}</span>{'\n'}
                  <span className="text-purple-400 ml-4">"success"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-emerald-400">true</span>
                  <span className="text-white/30">,</span>{'\n'}
                  <span className="text-purple-400 ml-4">"result"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-amber-300">"Your optimized prompt…"</span>
                  <span className="text-white/30">,</span>{'\n'}
                  <span className="text-purple-400 ml-4">"tokensUsed"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-blue-300">142</span>
                  <span className="text-white/30">,</span>{'\n'}
                  <span className="text-purple-400 ml-4">"provider"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-amber-300">"openai"</span>
                  <span className="text-white/30">,</span>{'\n'}
                  <span className="text-purple-400 ml-4">"model"</span>
                  <span className="text-white/30">: </span>
                  <span className="text-amber-300">"gpt-4o-mini"</span>{'\n'}
                  <span className="text-white/30">{'}'}</span>
                </div>
              </motion.div>
            </div>

            {/* ── Right — Code Sandbox ──────────────────────── */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-2xl border border-white/8 api-sandbox"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 api-sandbox-header">
                  <div className="flex items-center gap-2">
                    {/* Traffic light dots */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <Code size={13} className="text-purple-400 ml-2" />
                    <span className="text-[11px] font-mono font-bold text-white/60">Code Snippets</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/8 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* Lang tabs */}
                <div className="flex border-b border-white/6 px-3 py-2 gap-1 api-sandbox-tabs">
                  {['curl', 'javascript', 'python'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        lang === l
                          ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20'
                          : 'text-white/35 hover:text-white/70 border border-transparent'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Code viewport */}
                <div className="api-sandbox-code">
                  <pre className="p-5 overflow-x-auto text-[11px] font-mono text-white/80 leading-relaxed">
                    <code>{CODE_EXAMPLES[lang]}</code>
                  </pre>
                </div>
              </motion.div>

              {/* Rate limits note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4 px-4 py-3 rounded-xl border border-white/6 bg-white/2 flex items-start gap-2.5"
              >
                <Shield size={13} className="text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-white/60 mb-0.5">Rate Limits</p>
                  <p className="text-[10px] text-white/35 leading-relaxed">
                    Free tier: 50 req/day · Pro: 2,000 req/day · Custom plans available for enterprise.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
