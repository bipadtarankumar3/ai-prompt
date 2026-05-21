'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronRight, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PromptHistory({ onLoad }) {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (open) refreshHistory();
  }, [open]);

  const refreshHistory = () => {
    const h = JSON.parse(localStorage.getItem('pb_history') || '[]');
    setHistory(h);
  };

  const clearHistory = () => {
    localStorage.removeItem('pb_history');
    setHistory([]);
    toast.success('History cleared');
  };

  const removeItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem('pb_history', JSON.stringify(updated));
    setHistory(updated);
    if (selected === id) setSelected(null);
  };

  const categoryIcons = {
    ChatGPT: '🤖', Midjourney: '🎨', Coding: '💻', Marketing: '📣',
    SEO: '🔍', YouTube: '▶️', Blogging: '✍️', Business: '💼',
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        id="history-toggle"
        onClick={() => { setOpen(true); refreshHistory(); }}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 text-sm font-semibold text-white/80 hover:text-white cursor-pointer shadow-sm"
      >
        <History className="w-4 h-4 text-purple-400" />
        Prompt History
        {history.length > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30">
            {history.length}
          </span>
        )}
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[140]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[140] flex flex-col bg-slate-950/95 border-l border-white/5 backdrop-blur-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <History className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                      Prompt History
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-[10px] font-bold border border-white/5">
                    {history.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {history.length > 0 && (
                    <button
                      id="clear-history-btn"
                      onClick={clearHistory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8.5 h-8.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/60">No history yet</p>
                      <p className="text-xs text-white/30 mt-1 max-w-xs leading-relaxed">
                        Generate prompts using our tools, and your history will be safely saved locally.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {history.map((entry) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group relative flex flex-col gap-3 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          selected === entry.id
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/5 bg-white/3 hover:border-white/12 hover:bg-white/5'
                        }`}
                        onClick={() => {
                          setSelected(entry.id);
                          onLoad(entry);
                          setOpen(false);
                          toast.success('Prompt configuration loaded!');
                        }}
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{categoryIcons[entry.category] || '💡'}</span>
                            <span className="text-xs font-bold text-purple-300">{entry.category}</span>
                            <span className="text-xs text-white/20">·</span>
                            <span className="text-xs text-white/40 capitalize font-medium bg-white/5 px-2 py-0.5 rounded border border-white/5">{entry.tone}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeItem(entry.id); }}
                            className="opacity-0 group-hover:opacity-100 w-6.5 h-6.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Input preview */}
                        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-medium">
                          {entry.userInput}
                        </p>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                          <span className="text-xs text-white/30 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(entry.timestamp)}
                          </span>
                          <span className="text-xs text-purple-400 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            Load <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
