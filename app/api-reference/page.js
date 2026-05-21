'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Copy, Check, Code, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CODE_EXAMPLES = {
  curl: `curl -X POST https://api.promptbeast.com/v1/generate \\
  -H "Authorization: Bearer pb_test_12345" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userInput": "A landing page for a SaaS",
    "category": "Marketing",
    "tone": "Professional",
    "mode": "generate",
    "provider": "openai"
  }'`,
  javascript: `const res = await fetch('https://api.promptbeast.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer pb_test_12345',
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

url = "https://api.promptbeast.com/v1/generate"
headers = {
    "Authorization": "Bearer pb_test_12345",
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
print(res.json()["result"])`
};

export default function ApiReferencePage() {
  const [lang, setLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="border-b border-white/5 pb-8 mb-12">
            <p className="section-label mb-2">Developers</p>
            <h1 className="section-title mb-4">API Reference</h1>
            <p className="text-sm text-white/50 max-w-xl">
              Integrate Prompt Beast prompt optimization technology directly into your workflows and applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Specs */}
            <div className="lg:col-span-7 space-y-8">
              {/* Intro card */}
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  <Terminal size={18} className="text-purple-400" />
                  Overview
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  Our developer API provides direct HTTPS endpoints to programmatically leverage our structured categories, tones, and optimized prompt logic. It utilizes standardized JSON objects for requests and responses.
                </p>
              </div>

              {/* Authentication */}
              <div className="glass-card p-6 md:p-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  <Shield size={18} className="text-purple-400" />
                  Authentication
                </h2>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Pass your API key as a Bearer token in the request header:
                </p>
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-white/80 select-all">
                  Authorization: Bearer pb_live_your_api_key
                </div>
              </div>

              {/* Endpoint Specs */}
              <div className="glass-card p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    Generate Prompt
                  </h2>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    POST
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-mono text-purple-400">https://api.promptbeast.com/v1/generate</p>
                  
                  {/* Request parameters */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-3">Request Parameters (JSON)</h3>
                    <div className="space-y-3.5">
                      <div className="border-b border-white/5 pb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold font-mono text-white">userInput</span>
                          <span className="text-xs text-purple-400 font-mono">string | required</span>
                        </div>
                        <p className="text-xs text-white/50">The core concept, prompt, or raw input you want optimized.</p>
                      </div>
                      <div className="border-b border-white/5 pb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold font-mono text-white">category</span>
                          <span className="text-xs text-white/30 font-mono">string | optional</span>
                        </div>
                        <p className="text-xs text-white/50">Target application area (e.g. `ChatGPT`, `Midjourney`, `Marketing`, `SEO`, `Coding`).</p>
                      </div>
                      <div className="border-b border-white/5 pb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold font-mono text-white">tone</span>
                          <span className="text-xs text-white/30 font-mono">string | optional</span>
                        </div>
                        <p className="text-xs text-white/50">The delivery tone (e.g. `Professional`, `Creative`, `Funny`, `Expert`, `Minimal`).</p>
                      </div>
                      <div>
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-sm font-bold font-mono text-white">provider</span>
                          <span className="text-xs text-white/30 font-mono">string | optional</span>
                        </div>
                        <p className="text-xs text-white/50">Inference compute provider: `openai` or `huggingface`. Default is `openai`.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Code Sandbox */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/5 bg-slate-950/80 overflow-hidden shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Code size={14} className="text-purple-400" />
                    <span className="text-xs font-mono font-bold text-white/80">Code Snippets</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Lang tabs */}
                <div className="flex border-b border-white/5 px-2 py-1.5 gap-1 bg-black/20">
                  {['curl', 'javascript', 'python'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        lang === l
                          ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20'
                          : 'text-white/40 hover:text-white/80 border border-transparent'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* Code viewport */}
                <pre className="p-5 overflow-x-auto text-xs font-mono text-white/85 leading-relaxed bg-[#08080f]">
                  <code>{CODE_EXAMPLES[lang]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
