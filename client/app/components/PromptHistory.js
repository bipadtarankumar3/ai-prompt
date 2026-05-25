'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronRight, Clock, X, Check, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const categoryIcons = {
  ChatGPT: '🤖', Midjourney: '🎨', Coding: '💻', Marketing: '📣',
  SEO: '🔍', YouTube: '▶️', Blogging: '✍️', Business: '💼',
};

/* ── Inline Popover Confirm ─────────────────────────────────── */
function PopoverConfirm({ message, onConfirm, onCancel }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onCancel();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onCancel]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-50 w-52 rounded-xl border border-white/10 bg-slate-900 shadow-xl shadow-black/40 p-3 popover-confirm"
    >
      {/* Arrow */}
      <div className="absolute -top-1.5 right-3 w-3 h-3 rotate-45 bg-slate-900 border-l border-t border-white/10" />

      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/70 leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="flex-1 py-1.5 rounded-lg bg-white/6 border border-white/8 text-[11px] font-semibold text-white/55 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onConfirm(); }}
          className="flex-1 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-[11px] font-semibold text-red-400 hover:bg-red-500/25 transition-all cursor-pointer flex items-center justify-center gap-1"
        >
          <Check className="w-3 h-3" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

export default function PromptHistory({ onLoad }) {
  const [history, setHistory]       = useState([]);
  const [open, setOpen]             = useState(false);
  const [selected, setSelected]     = useState(null);
  const [isMobile, setIsMobile]     = useState(false);
  const [deleteId, setDeleteId]     = useState(null);   // item pending delete
  const [clearPending, setClearPending] = useState(false); // clear-all pending

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (open) refreshHistory();
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const refreshHistory = () => {
    const h = JSON.parse(localStorage.getItem('pb_history') || '[]');
    setHistory(h);
  };

  const confirmClear = () => {
    localStorage.removeItem('pb_history');
    setHistory([]);
    setClearPending(false);
    toast.success('History cleared');
  };

  const confirmDelete = (id) => {
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem('pb_history', JSON.stringify(updated));
    setHistory(updated);
    if (selected === id) setSelected(null);
    setDeleteId(null);
  };

  // Mobile: slide up from bottom as a bottom sheet
  // Desktop: slide in from right as a side panel
  const panelVariants = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };

  const panelClass = isMobile
    ? 'fixed inset-x-0 bottom-0 z-[200] flex flex-col rounded-t-2xl bg-slate-950/95 border-t border-white/8 max-h-[85vh] history-panel'
    : 'fixed right-0 top-0 bottom-0 w-full max-w-sm z-[200] flex flex-col bg-slate-950/95 border-l border-white/8 history-panel';

  return (
    <>
      {/* ── Toggle Button ───────────────────────────────────── */}
      <button
        id="history-toggle"
        onClick={() => { setOpen(true); refreshHistory(); }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-200 text-xs font-semibold text-white/60 hover:text-white cursor-pointer shrink-0"
      >
        <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span className="hidden sm:inline">History</span>
        {history.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-black border border-purple-500/30">
            {history.length}
          </span>
        )}
      </button>

      {/* ── Overlay + Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setOpen(false); setDeleteId(null); setClearPending(false); }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[199]"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              {...panelVariants}
              transition={{ type: 'spring', damping: 32, stiffness: 380 }}
              className={panelClass}
            >
              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-white/15 history-drag-handle" />
                </div>
              )}

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <History className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white/90 tracking-wide">
                    Prompt History
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px] font-bold border border-white/8">
                    {history.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {history.length > 0 && (
                    /* Clear All with popover */
                    <div className="relative">
                      <button
                        id="clear-history-btn"
                        onClick={(e) => { e.stopPropagation(); setClearPending(p => !p); setDeleteId(null); }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 active:bg-red-500/25 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                      <AnimatePresence>
                        {clearPending && (
                          <PopoverConfirm
                            message="Clear all prompt history? This cannot be undone."
                            onConfirm={confirmClear}
                            onCancel={() => setClearPending(false)}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <button
                    id="history-close-btn"
                    onClick={() => { setOpen(false); setDeleteId(null); setClearPending(false); }}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:bg-white/15 text-white/50 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-center px-6 py-8">
                    <div className="w-12 h-12 rounded-xl bg-white/3 border border-white/6 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white/20" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/50">No history yet</p>
                      <p className="text-xs text-white/25 mt-1 leading-relaxed">
                        Generate prompts and they'll be saved here automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 space-y-2">
                    {history.map((entry) => (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className={`relative flex flex-col gap-2 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                          selected === entry.id
                            ? 'border-purple-500/40 bg-purple-500/8'
                            : 'border-white/6 bg-white/2 active:bg-white/4'
                        }`}
                        onClick={() => {
                          if (deleteId === entry.id) return; // don't load if confirm open
                          setSelected(entry.id);
                          onLoad(entry);
                          setOpen(false);
                          toast.success('Prompt loaded! ✨');
                        }}
                      >
                        {/* Top row — category + tone + delete */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span className="text-sm shrink-0 leading-none">{categoryIcons[entry.category] || '💡'}</span>
                            <span className="text-[11px] font-bold text-purple-300 shrink-0 leading-none">{entry.category}</span>
                            <span className="text-white/20 shrink-0 leading-none">·</span>
                            <span className="text-[10px] text-white/40 capitalize font-medium bg-white/5 px-1.5 py-0.5 rounded border border-white/5 truncate leading-none">
                              {entry.tone}
                            </span>
                          </div>

                          {/* Delete button with inline popover */}
                          <div className="relative shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(prev => prev === entry.id ? null : entry.id);
                                setClearPending(false);
                              }}
                              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                deleteId === entry.id
                                  ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                  : 'bg-red-500/10 border-red-500/15 text-red-400 hover:bg-red-500/20 active:bg-red-500/25'
                              }`}
                              title="Delete this entry"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            <AnimatePresence>
                              {deleteId === entry.id && (
                                <PopoverConfirm
                                  message="Remove this prompt from history?"
                                  onConfirm={() => confirmDelete(entry.id)}
                                  onCancel={() => setDeleteId(null)}
                                />
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Input preview */}
                        <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                          {entry.userInput}
                        </p>

                        {/* Bottom row — timestamp + load hint */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-white/25 flex items-center gap-1 leading-none">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{formatDate(entry.timestamp)}</span>
                          </span>
                          <span className="text-[10px] text-purple-400 font-bold flex items-center gap-0.5 leading-none shrink-0">
                            Load <ChevronRight className="w-3 h-3" />
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
