'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HF_MODELS } from '@/app/utils/aiProviders';

export default function ProviderSelect({ provider, hfModel, onProviderChange, onModelChange }) {
  const [open, setOpen] = useState(false);
  const selected = HF_MODELS.find(m => m.id === hfModel) || HF_MODELS[0];

  const PROVIDERS = [
    { id: 'openai',      label: 'OpenAI',        sub: process.env.NEXT_PUBLIC_OPENAI_MODEL_NAME || 'GPT-4o Mini',        color: '#10a37f', badge: '⚡ Recommended' },
    { id: 'gemini',      label: 'Gemini',        sub: process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'Gemini 2.5 Flash',   color: '#34a853', badge: '🔥 Fast & Free' },
    { id: 'huggingface', label: 'Hugging Face',  sub: 'Open-source models', color: '#ff9d00', badge: '🤗 Free tier'   },
  ].filter(p => {
    if (p.id === 'openai' && process.env.NEXT_PUBLIC_ENABLE_OPENAI === 'false') return false;
    if (p.id === 'gemini' && process.env.NEXT_PUBLIC_ENABLE_GEMINI === 'false') return false;
    if (p.id === 'huggingface' && process.env.NEXT_PUBLIC_ENABLE_HF === 'false') return false;
    return true;
  });

  return (
    <div className="space-y-2">
      {/* Provider cards */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${PROVIDERS.length}, minmax(0, 1fr))` }}>
        {PROVIDERS.map(p => (
          <button key={p.id} type="button" id={`prov-${p.id}`}
            onClick={() => onProviderChange(p.id)}
            className={`p-3 rounded-xl border text-left transition-all duration-200
              ${provider === p.id
                ? 'border-violet-500/55 bg-violet-600/10 shadow-lg shadow-violet-950/30'
                : 'border-white/8 bg-white/3 hover:border-white/14 hover:bg-white/5'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white/85">
                {p.label}
              </span>
              {provider === p.id && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </div>
            <span className="text-[10px] text-white/40 block mb-1">{p.sub}</span>
            <span className="text-[10px] font-semibold" style={{ color: p.color }}>{p.badge}</span>
          </button>
        ))}
      </div>

      {/* HF model dropdown */}
      {provider === 'huggingface' && (
        <div className="relative">
          <button type="button" id="hf-model-btn"
            onClick={() => setOpen(!open)}
            className="input flex items-center justify-between text-xs font-medium cursor-pointer py-2"
          >
            <span className="flex items-center gap-2">
              <span>🤗</span>
              <span>{selected.label}</span>
            </span>
            <ChevronDown size={14}
              className={`text-violet-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 dropdown-menu overflow-hidden shadow-2xl shadow-black/50">
                {HF_MODELS.map(m => (
                  <button key={m.id} type="button"
                    onClick={() => { onModelChange(m.id); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 flex flex-col gap-0.5 transition-colors hover:bg-white/5
                      ${hfModel === m.id ? 'bg-violet-600/10' : ''}`}
                  >
                    <span className="text-xs font-medium text-white/85">{m.label}</span>
                    <span className="text-[10px] text-white/30 font-mono truncate">{m.id}</span>
                  </button>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
