'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, RefreshCw } from 'lucide-react';
import ProviderSelect from './ProviderSelect';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'ChatGPT',    emoji: '🤖' },
  { id: 'Midjourney', emoji: '🎨' },
  { id: 'Coding',     emoji: '💻' },
  { id: 'Marketing',  emoji: '📣' },
  { id: 'SEO',        emoji: '🔍' },
  { id: 'YouTube',    emoji: '▶️' },
  { id: 'Blogging',   emoji: '✍️' },
  { id: 'Business',   emoji: '💼' },
];

const TONES = [
  { id: 'Professional', emoji: '👔' },
  { id: 'Creative',     emoji: '🎭' },
  { id: 'Funny',        emoji: '😄' },
  { id: 'Expert',       emoji: '🎓' },
  { id: 'Minimal',      emoji: '✨' },
];

const MODES = [
  { id: 'generate', label: 'Generate',  Icon: Zap },
  { id: 'improve',  label: 'Improve',   Icon: Sparkles },
  { id: 'rewrite',  label: 'Rewrite',   Icon: RefreshCw },
];

export default function PromptBox({ onResult, onLoading, initialPrompt = '' }) {
  const [input, setInput]       = useState(initialPrompt);
  const [category, setCategory] = useState('ChatGPT');
  const [tone, setTone]         = useState('Professional');
  const [mode, setMode]         = useState('generate');
  const [provider, setProvider] = useState('openai');
  const [hfModel, setHfModel]   = useState('Qwen/Qwen2.5-7B-Instruct');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);


  const MAX = 2000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) { toast.error('Please enter your idea first!'); return; }
    setLoading(true); onLoading(true);
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input, category, tone, mode, provider, hfModel }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong');
      onResult(data.result, data.tokensUsed, data.provider, data.model, category, tone, hfModel);
      // save history
      const history = JSON.parse(localStorage.getItem('pb_history') || '[]');
      history.unshift({ id: Date.now(), userInput: input, category, tone, mode, provider: data.provider, result: data.result, tokensUsed: data.tokensUsed, timestamp: new Date().toISOString() });
      localStorage.setItem('pb_history', JSON.stringify(history.slice(0, 50)));
      toast.success('Prompt generated! ✨');
    } catch (err) {
      toast.error(err.message || 'Generation failed');
    } finally {
      setLoading(false); onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 h-full">

      {/* ── Mode Tabs ─────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Mode</p>
        <div className="flex gap-1">
          {MODES.map(({ id, label, Icon }) => (
            <button key={id} type="button" id={`mode-${id}`}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1 flex-1 justify-center py-1.5 rounded-md text-[11px] font-semibold border transition-all duration-200
                ${mode === id
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/30'
                  : 'border-white/8 bg-white/3 text-white/50 hover:border-white/15 hover:text-white/80'}`}>
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Textarea ──────────────────────────────────────── */}
      <div>
        <label htmlFor="prompt-input" className="text-[10px] font-semibold text-white/30 uppercase tracking-widest block mb-1.5">
          {mode === 'generate' ? 'Your Idea' : mode === 'improve' ? 'Prompt to Improve' : 'Prompt to Rewrite'}
        </label>
        <div className="relative">
          <textarea
            id="prompt-input"
            rows={3}
            maxLength={MAX}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              mode === 'generate'
                ? 'e.g. "A viral blog post about AI replacing jobs in 2025"'
                : mode === 'improve'
                ? 'Paste your existing prompt here to make it better…'
                : 'Paste your prompt here to rewrite it in a fresh way…'
            }
            className="input text-xs leading-relaxed"
            style={{ minHeight: 80 }}
          />
          <span className={`absolute bottom-2 right-2.5 text-[9px] font-mono tabular-nums
            ${input.length > MAX * 0.85 ? 'text-amber-400' : 'text-white/15'}`}>
            {input.length}/{MAX}
          </span>
        </div>
      </div>

      {/* ── Category ──────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Category</p>
        {/* Scrollable row on mobile, 4-col grid on sm+ */}
        <div className="flex sm:grid sm:grid-cols-4 gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map(({ id, emoji }) => (
            <button key={id} type="button" id={`cat-${id.toLowerCase()}`}
              onClick={() => setCategory(id)}
              className={`chip flex-col py-1.5 gap-0.5 text-[10px] font-semibold justify-center min-w-[60px] sm:min-w-0 shrink-0 ${category === id ? 'active' : ''}`}>
              <span className="text-sm leading-tight">{emoji}</span>
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tone ──────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">Tone</p>
        <div className="flex flex-wrap gap-1">
          {TONES.map(({ id, emoji }) => (
            <button key={id} type="button" id={`tone-${id.toLowerCase()}`}
              onClick={() => setTone(id)}
              className={`chip text-[10px] py-1 px-2 ${tone === id ? 'active' : ''}`}>
              {emoji} {id}
            </button>
          ))}
        </div>
      </div>

      {/* ── Provider ──────────────────────────────────────── */}
      <div className="relative z-20">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1.5">AI Provider</p>
        <ProviderSelect provider={provider} hfModel={hfModel} onProviderChange={setProvider} onModelChange={setHfModel} />
      </div>

      {/* ── Generate button ───────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.button
          key={loading ? 'l' : 'i'}
          type="submit"
          id="generate-btn"
          disabled={loading}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="btn-primary w-full justify-center py-2.5 text-xs rounded-lg mt-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Generating with {provider === 'openai' ? 'GPT-4o Mini' : 'Hugging Face'}…
            </>
          ) : (
            <>
              <Zap size={13} fill="currentColor" />
              {mode === 'generate' ? 'Generate Prompt' : mode === 'improve' ? 'Improve Prompt' : 'Rewrite Prompt'}
            </>
          )}
        </motion.button>
      </AnimatePresence>
    </form>
  );
}
