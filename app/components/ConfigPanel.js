'use client';

import { Zap, Sparkles, RefreshCw } from 'lucide-react';
import ProviderSelect from './ProviderSelect';

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

export default function ConfigPanel({
  mode,
  setMode,
  category,
  setCategory,
  tone,
  setTone,
  provider,
  setProvider,
  hfModel,
  setHfModel,
  loading,
  onSubmit,
}) {
  return (
    <div className="card p-4 space-y-4 flex flex-col h-full justify-between">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/6">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">Engine Settings</h3>
        </div>

        {/* ── Mode Selection ─────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Mode</label>
          <div className="flex flex-col gap-1">
            {MODES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                id={`mode-${id}`}
                onClick={() => setMode(id)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer
                  ${mode === id
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/30 font-bold'
                    : 'border-white/8 bg-white/3 text-white/50 hover:border-white/15 hover:text-white/80'}`}
              >
                <Icon size={12} className={mode === id ? 'text-white' : 'text-purple-400'} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category Selection ─────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Category</label>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map(({ id, emoji }) => (
              <button
                key={id}
                type="button"
                id={`cat-${id.toLowerCase()}`}
                onClick={() => setCategory(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all duration-200 cursor-pointer min-w-0
                  ${category === id
                    ? 'bg-violet-600 border-violet-500 text-white font-bold'
                    : 'border-white/5 bg-white/2 text-white/50 hover:border-white/10 hover:text-white/70'}`}
              >
                <span className="text-xs shrink-0">{emoji}</span>
                <span className="truncate">{id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tone Selection ─────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider">Tone</label>
          <div className="grid grid-cols-2 gap-1.5">
            {TONES.map(({ id, emoji }) => (
              <button
                key={id}
                type="button"
                id={`tone-${id.toLowerCase()}`}
                onClick={() => setTone(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all duration-200 cursor-pointer min-w-0
                  ${tone === id
                    ? 'bg-violet-600 border-violet-500 text-white font-bold'
                    : 'border-white/5 bg-white/2 text-white/50 hover:border-white/10 hover:text-white/70'}`}
              >
                <span className="text-xs shrink-0">{emoji}</span>
                <span className="truncate">{id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Provider ────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider">AI Model Provider</label>
          <ProviderSelect
            provider={provider}
            hfModel={hfModel}
            onProviderChange={setProvider}
            onModelChange={setHfModel}
          />
        </div>
      </div>

      {/* ── Generate Action Button ──────────────────────────── */}
      <button
        onClick={onSubmit}
        disabled={loading}
        id="generate-btn"
        className="w-full btn-primary justify-center py-3 text-xs rounded-xl mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-violet-900/30 flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Zap size={14} fill="currentColor" />
            <span>Generate Optimized Prompt</span>
          </>
        )}
      </button>
    </div>
  );
}
