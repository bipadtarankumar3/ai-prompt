'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Share2, Star, StarOff, CheckCheck, Cpu, Hash, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

function Skeleton() {
  return (
    <div className="p-6 space-y-3">
      <div className="skeleton h-3.5 w-3/4" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-5/6" />
      <div className="skeleton h-3.5 w-2/3" />
      <div className="skeleton h-3.5 w-4/5 mt-4" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-3/4" />
      <div className="skeleton h-3.5 w-5/6" />
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[280px] gap-5 p-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-800/30 flex items-center justify-center">
        <Cpu size={32} className="text-violet-400/60" />
      </div>
      <div>
        <h3 className="text-white/60 font-semibold text-base mb-1.5">Ready to generate</h3>
        <p className="text-white/30 text-sm max-w-xs leading-relaxed">
          Fill in your idea on the left, choose a category and tone, then hit Generate.
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
    <div className="card flex flex-col h-full min-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-sm font-semibold text-white/75">Generated Prompt</span>
          {model && (
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[11px] text-white/35 font-mono">
              {model}
            </span>
          )}
        </div>
        {tokensUsed > 0 && (
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <Hash size={11} />
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
            ? <motion.div key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="p-6">
                <p className="prompt-text">{result}</p>
              </motion.div>
            : <motion.div key="em" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Empty /></motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      <div className="border-t border-white/6 px-5 py-3.5 flex flex-wrap items-center gap-2">
        <ActionBtn id="out-copy" onClick={copy} disabled={!result} active={copied}>
          {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </ActionBtn>
        <ActionBtn id="out-download" onClick={download} disabled={!result}>
          <Download size={13} />
          Download
        </ActionBtn>
        <ActionBtn id="out-share" onClick={share} disabled={!result}>
          <Share2 size={13} />
          Share
        </ActionBtn>
        {onRefine && (
          <ActionBtn id="out-refine" onClick={onRefine} disabled={!result || loading}>
            <Sparkles size={13} className="text-purple-400 animate-pulse" />
            Refine with AI
          </ActionBtn>
        )}
        <button
          id="out-fav"
          onClick={toggleFav}
          disabled={!result}
          className={`ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200
            ${isFavorite
              ? 'bg-amber-500/12 border-amber-500/25 text-amber-400'
              : 'bg-white/4 border-white/8 text-white/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed'}`}
        >
          {isFavorite ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
          {isFavorite ? 'Saved' : 'Favorite'}
        </button>
      </div>
    </div>
  );
}
