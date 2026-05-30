'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Share2, Star, StarOff, CheckCheck, Cpu, Hash, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function Skeleton() {
  return (
    <div className="p-4 space-y-2.5">
      <div className="skeleton h-3 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-3 w-4/5 mt-3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-3/4" />
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-800/30 flex items-center justify-center">
        <Cpu size={20} className="text-violet-400/60" />
      </div>
      <div>
        <h3 className="text-white/50 font-semibold text-xs mb-1">Ready to generate</h3>
        <p className="text-white/25 text-[11px] max-w-xs leading-relaxed">
          Fill in your idea, choose category &amp; tone, then hit Generate.
        </p>
      </div>
    </div>
  );
}

const ActionBtn = ({ onClick, disabled, active, children, id }) => (
  <button
    id={id}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200
      ${active
        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        : 'bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed'}`}
  >
    {children}
  </button>
);

export default function OutputBox({ result, loading, tokensUsed, provider, model, onRefine }) {
  const [copied, setCopied]       = useState(false);
  const [isFavorite, setFavorite] = useState(false);

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2200);
  };

  const download = () => {
    if (!result) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([result], { type: 'text/plain' })),
      download: `prompt-beast-${Date.now()}.txt`,
    });
    a.click();
    toast.success('Downloaded!');
  };

  const share = async () => {
    if (!result) return;
    const url = `${location.origin}?prompt=${encodeURIComponent(result.slice(0, 400))}`;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied!');
  };

  const toggleFav = () => {
    if (!result) return;
    const favs = JSON.parse(localStorage.getItem('pb_favorites') || '[]');
    if (!isFavorite) {
      favs.unshift({ id: Date.now(), result, ts: new Date().toISOString() });
      localStorage.setItem('pb_favorites', JSON.stringify(favs.slice(0, 100)));
      toast.success('Saved to favorites ⭐');
    }
    setFavorite(f => !f);
  };

  return (
    <div className="card flex flex-col h-full min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs font-semibold text-white/70">Generated Prompt</span>
          {model && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] text-white/30 font-mono">
              {model}
            </span>
          )}
        </div>
        {tokensUsed > 0 && (
          <div className="flex items-center gap-1 text-white/25 text-[10px]">
            <Hash size={10} />
            {tokensUsed} tokens
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {loading
            ? <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Skeleton /></motion.div>
            : result
            ? <motion.div key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="p-4">
                <p className="prompt-text text-sm leading-relaxed">{result}</p>
              </motion.div>
            : <motion.div key="em" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Empty /></motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      <div className="border-t border-white/6 px-4 py-2.5 flex flex-wrap items-center gap-1.5">
        <ActionBtn id="out-copy" onClick={copy} disabled={!result} active={copied}>
          {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </ActionBtn>
        <ActionBtn id="out-download" onClick={download} disabled={!result}>
          <Download size={12} />
          Download
        </ActionBtn>
        <ActionBtn id="out-share" onClick={share} disabled={!result}>
          <Share2 size={12} />
          Share
        </ActionBtn>
        {onRefine && (
          <ActionBtn id="out-refine" onClick={onRefine} disabled={!result || loading}>
            <Sparkles size={12} className="text-purple-400 animate-pulse" />
            Refine
          </ActionBtn>
        )}
        <button
          id="out-fav"
          onClick={toggleFav}
          disabled={!result}
          className={`ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-200
            ${isFavorite
              ? 'bg-amber-500/12 border-amber-500/25 text-amber-400'
              : 'bg-white/4 border-white/8 text-white/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed'}`}
        >
          {isFavorite ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
          {isFavorite ? 'Saved' : 'Fav'}
        </button>
      </div>
    </div>
  );
}
