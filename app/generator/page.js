'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Sparkles, Menu, X, Plus, Send, History, Trash2,
  Settings, ChevronDown, ChevronUp, Sliders, Copy, Check,
  Download, Share2, Star, StarOff, ChevronRight, Cpu,
  PanelLeftClose, PanelLeft, ArrowUp, User, Bot, ArrowLeft,
  Globe, Brain, Info, ExternalLink, Moon, Sun, Lock, Atom
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { TEMPLATES } from '../utils/templates';
import toast from 'react-hot-toast';
import { useBackground } from '../components/BackgroundProvider';

/* ── Constants ───────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'ChatGPT', emoji: '🤖' }, { id: 'Midjourney', emoji: '🎨' },
  { id: 'Coding', emoji: '💻' }, { id: 'Marketing', emoji: '📣' },
  { id: 'SEO', emoji: '🔍' }, { id: 'YouTube', emoji: '▶️' },
  { id: 'Blogging', emoji: '✍️' }, { id: 'Business', emoji: '💼' },
];
const TONES = [
  { id: 'Professional', emoji: '👔' }, { id: 'Creative', emoji: '🎭' },
  { id: 'Funny', emoji: '😄' }, { id: 'Expert', emoji: '🎓' },
  { id: 'Minimal', emoji: '✨' },
];
const MODES = [
  { id: 'generate', label: 'Generate', Icon: Zap },
  { id: 'improve', label: 'Improve', Icon: Sparkles },
  { id: 'rewrite', label: 'Rewrite', Icon: Sliders },
];
const SUGGESTIONS = [
  { title: 'Cyberpunk Midjourney art', desc: 'Detailed visual art prompt', cat: 'Midjourney', tone: 'Creative', text: 'Create a Midjourney portrait of a cyberpunk neon city at night, 8k resolution, cinematic lighting.' },
  { title: 'SaaS launch email', desc: 'Persuasive campaign copy', cat: 'Marketing', tone: 'Professional', text: 'Write a marketing email announcing the launch of our new AI automation SaaS product.' },
  { title: 'Refactor React hook', desc: 'Clean coding guidelines', cat: 'Coding', tone: 'Expert', text: 'Explain how to refactor a complex React useEffect hook state sync issue.' },
  { title: 'AI trends Twitter thread', desc: 'Developer audience threads', cat: 'Blogging', tone: 'Funny', text: 'Generate an engaging Twitter thread on the latest AI generation trends in 2025.' },
];

/* ── Custom Interactive Selector Pill ────────────────────────── */
const CustomSelector = ({ value, options, icon: Icon, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.id === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 dark:bg-[#3c3c3c]/80 dark:hover:bg-[#4a4a4a] text-slate-655 dark:text-slate-350 transition-all duration-200 cursor-pointer border border-slate-200/40 dark:border-transparent select-none active:scale-95 shadow-sm"
      >
        {activeOption.emoji && <span className="mr-0.5 text-xs">{activeOption.emoji}</span>}
        {activeOption.Icon && <activeOption.Icon size={12} className="text-amber-500 mr-0.5" />}
        <span>{activeOption.label || activeOption.id}</span>
        <ChevronDown size={11} className={`text-slate-400 dark:text-slate-500 transition-transform duration-250 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, type: 'spring', damping: 20, stiffness: 350 }}
            className="absolute bottom-full left-0 mb-2 w-48 max-h-60 overflow-y-auto scrollbar-none rounded-2xl border border-slate-200/80 dark:border-[#3e3e3e] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl shadow-2xl p-1.5 z-40"
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer select-none
                  ${value === opt.id
                    ? 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-[#282828] text-slate-700 dark:text-slate-300'}`}
              >
                <span className="flex items-center gap-2">
                  {opt.emoji && <span className="text-xs">{opt.emoji}</span>}
                  {opt.Icon && <opt.Icon size={13} className={value === opt.id ? 'text-amber-500' : 'text-slate-400'} />}
                  <span>{opt.label || opt.id}</span>
                </span>
                {value === opt.id && <Check size={12} className="text-amber-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================================================================
   GENERATOR SECTION
   ================================================================ */
function GeneratorSection() {
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { backgroundEffect, setBackgroundEffect } = useBackground();

  const toggleBackground = () => {
    if (backgroundEffect === 'atom') {
      setBackgroundEffect('bubble');
    } else if (backgroundEffect === 'bubble') {
      setBackgroundEffect('none');
    } else {
      setBackgroundEffect('atom');
    }
  };

  /* ── UI state ──────────────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  /* ── Chat state ────────────────────────────────────────────── */
  const [input, setInput] = useState('');
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingIdx, setStreamingIdx] = useState(null); // track current streaming index
  const [tokens, setTokens] = useState(0);
  const [model, setModel] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [favs, setFavs] = useState({});

  /* ── Config state ──────────────────────────────────────────── */
  const [mode, setMode] = useState('generate');
  const [category, setCategory] = useState('ChatGPT');
  const [tone, setTone] = useState('Professional');
  const [provider, setProvider] = useState('openai');
  const [hfModel, setHfModel] = useState('Qwen/Qwen2.5-7B-Instruct');

  /* ── History ───────────────────────────────────────────────── */
  const [historyList, setHistoryList] = useState([]);
  const chatEnd = useRef(null);
  const textareaRef = useRef(null);
  const modelDropdownRef = useRef(null);

  useEffect(() => {
    refreshHistory();
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const refreshHistory = () => {
    setHistoryList(JSON.parse(localStorage.getItem('pb_history') || '[]'));
  };

  /* URL params → pre-fill */
  useEffect(() => {
    const tid = searchParams.get('template');
    const p = searchParams.get('prompt');
    if (tid) {
      const t = TEMPLATES.find(x => x.id.toString() === tid);
      if (t) setInput(t.prompt);
    } else if (p) {
      setInput(p);
    }
  }, [searchParams]);

  /* Scroll to bottom on new messages / loading */
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread, loading, streamingIdx]);

  /* Click outside to close model dropdown */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Handlers ──────────────────────────────────────────────── */
  const handleNew = () => {
    setThread([]);
    setInput('');
    setTokens(0);
    setModel('');
    setFavs({});
    setStreamingIdx(null);
    toast.success('New session started');
  };

  const handleLoadHistory = (entry) => {
    setThread([
      { role: 'user', content: entry.userInput },
      { role: 'assistant', content: entry.result },
    ]);
    setInput('');
    setTokens(entry.tokensUsed || 0);
    setProvider(entry.provider || 'openai');
    setModel('');
    setStreamingIdx(null);
    if (entry.category) setCategory(entry.category);
    if (entry.tone) setTone(entry.tone);
    if (entry.mode) setMode(entry.mode);
    setMobileSidebar(false);
    toast.success('Loaded from history');
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    const updated = historyList.filter(h => h.id !== id);
    localStorage.setItem('pb_history', JSON.stringify(updated));
    setHistoryList(updated);
  };

  const handleCopy = async (text, idx) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleDownload = (text) => {
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
      download: `prompt-beast-${Date.now()}.txt`,
    });
    a.click();
    toast.success('Downloaded!');
  };

  const handleShare = async (text) => {
    const url = `${location.origin}/generator?prompt=${encodeURIComponent(text.slice(0, 400))}`;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied!');
  };

  const handleFav = (text, idx) => {
    if (!favs[idx]) {
      const list = JSON.parse(localStorage.getItem('pb_favorites') || '[]');
      list.unshift({ id: Date.now(), result: text, ts: new Date().toISOString() });
      localStorage.setItem('pb_favorites', JSON.stringify(list.slice(0, 100)));
      toast.success('Added to favorites ⭐');
    }
    setFavs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  /* ── Simulated Live Typing Stream ──────────────────────────── */
  const simulateStreaming = (fullText, callback, onFinish) => {
    let index = 0;
    const charsPerStep = 6; // very fast streaming chunks
    const timer = setInterval(() => {
      index += charsPerStep;
      if (index >= fullText.length) {
        clearInterval(timer);
        callback(fullText);
        onFinish();
      } else {
        callback(fullText.slice(0, index));
      }
    }, 12);
  };

  /* ── Send / Generate ───────────────────────────────────────── */
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || streamingIdx !== null) return;
    const text = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    const newThread = [...thread, { role: 'user', content: text }];
    setThread(newThread);
    setLoading(true);

    try {
      const isRefine = thread.length > 0;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          category,
          tone,
          mode: isRefine ? 'generate' : mode,
          provider,
          hfModel,
          chatHistory: isRefine ? thread : [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed');

      // Stop loading wave, trigger streaming index
      setLoading(false);
      const assistantMessageIdx = newThread.length;
      setStreamingIdx(assistantMessageIdx);
      
      // Append blank assistant message to start character streaming
      setThread(prev => [...prev, { role: 'assistant', content: '' }]);

      simulateStreaming(data.result, (chunk) => {
        setThread(prev => {
          const updated = [...prev];
          updated[assistantMessageIdx] = { role: 'assistant', content: chunk };
          return updated;
        });
      }, () => {
        // stream complete!
        setStreamingIdx(null);
        setTokens(data.tokensUsed);
        setModel(data.model);

        if (!isRefine) {
          const hist = JSON.parse(localStorage.getItem('pb_history') || '[]');
          hist.unshift({
            id: Date.now(),
            userInput: text,
            category,
            tone,
            mode,
            provider: data.provider,
            result: data.result,
            tokensUsed: data.tokensUsed,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem('pb_history', JSON.stringify(hist.slice(0, 50)));
          refreshHistory();
        }
        toast.success(isRefine ? 'Refined! ✨' : 'Generated! ✨');
      });

    } catch (err) {
      toast.error(err.message || 'Failed');
      setInput(text);
      setThread(prev => prev.slice(0, -1));
      setLoading(false);
      setStreamingIdx(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-transparent text-slate-800 dark:text-[#ececec] font-sans antialiased">
      
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="hidden md:flex flex-col h-full bg-white/60 dark:bg-[#121212]/75 backdrop-blur-xl border-r border-slate-200/50 dark:border-[#2d2d2d]/30 flex-shrink-0 overflow-hidden text-slate-800 dark:text-[#ececec] select-none z-30"
      >
        <div className="flex flex-col h-full w-[260px] flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-200/60 dark:border-[#2d2d2d]/80">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-all">
                <Zap size={14} className="text-white fill-white animate-spark" />
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                PromptBeast <span className="text-[10px] text-amber-500 dark:text-amber-400/80 font-mono">v1.2</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2f2f2f] cursor-pointer transition-colors active:scale-95"
              title="Close sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* New Prompt Button */}
          <div className="p-3">
            <button
              onClick={handleNew}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-slate-200/60 dark:border-[#3e3e3e]/60 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-[#212121]/80 dark:hover:bg-[#2c2c2c]/80 text-sm text-slate-800 dark:text-[#ececec] font-medium transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] group"
            >
              <span className="flex items-center gap-2">
                <Plus size={15} className="text-amber-500 dark:text-amber-400 group-hover:rotate-90 transition-transform duration-250" />
                New Prompt
              </span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-mono bg-slate-200/60 dark:bg-[#2c2c2c]/60 border border-slate-300/40 dark:border-[#3e3e3e]/50 rounded text-slate-500 dark:text-slate-400 select-none">Ctrl+N</kbd>
            </button>
          </div>

          {/* Chronological Prompt History */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4 scrollbar-none">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2 block select-none">
                Recent Prompts
              </span>
              {historyList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 dark:text-[#676767]">
                  No recent prompts yet
                </div>
              ) : (
                <div className="space-y-0.5">
                  {historyList.slice(0, 30).map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistory(item)}
                      className="group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-sm hover:bg-slate-200/50 dark:hover:bg-[#2f2f2f]/60 text-slate-600 dark:text-[#b4b4b4] hover:text-slate-900 dark:hover:text-[#ececec] transition-all cursor-pointer hover:translate-x-1 duration-200"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <History size={13} className="text-slate-400 dark:text-[#676767] group-hover:text-slate-600 dark:group-hover:text-slate-400 flex-shrink-0" />
                        <span className="truncate pr-1">{item.userInput}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteHistory(e, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-300/50 dark:hover:bg-[#212121] text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-all cursor-pointer flex-shrink-0"
                        title="Delete prompt"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="p-3 border-t border-slate-200/50 dark:border-[#2d2d2d]/80 bg-transparent space-y-2">
            
            {/* Collapse Advanced Panel */}
            <div className="rounded-2xl border border-slate-200/60 dark:border-[#3e3e3e]/60 bg-slate-100/40 dark:bg-[#212121]/50 overflow-hidden">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="w-full flex items-center justify-between p-3 text-xs text-slate-500 dark:text-[#b4b4b4] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Settings size={12} className={`text-amber-500 dark:text-amber-400 ${settingsOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
                  Engine Settings
                </span>
                {settingsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              
              <AnimatePresence initial={false}>
                {settingsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-205/60 dark:border-[#3e3e3e] p-3 space-y-3 bg-slate-50/30 dark:bg-[#1c1c1c]/50 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mode Configuration</span>
                      <div className="grid grid-cols-3 gap-1">
                        {MODES.map(m => (
                          <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer
                              ${mode === m.id
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold shadow-sm'
                                : 'border-slate-200/50 dark:border-[#333] hover:border-slate-300 dark:hover:border-[#444] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                          >
                            <m.Icon size={10} />
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Engine Source</span>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setProvider('openai')}
                          className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-semibold text-left transition-all
                            ${provider === 'openai'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-655 dark:text-amber-400'
                              : 'border-slate-200/50 dark:border-[#333] text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'}`}
                        >
                          <span className="flex items-center gap-1.5"><Cpu size={12} /> OpenAI API</span>
                          {provider === 'openai' && <Check size={11} />}
                        </button>
                        
                        <button
                          onClick={() => setProvider('huggingface')}
                          className={`flex items-center justify-between p-2 rounded-xl border text-[10px] font-semibold text-left transition-all
                            ${provider === 'huggingface'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-655 dark:text-amber-400'
                              : 'border-slate-200/50 dark:border-[#333] text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'}`}
                        >
                          <span className="flex items-center gap-1.5"><Bot size={12} /> HuggingFace</span>
                          {provider === 'huggingface' && <Check size={11} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back to Home Link */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs hover:bg-slate-200/50 dark:hover:bg-[#2f2f2f] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* ── MOBILE SIDEBAR DRAWER ────────────────────────────────── */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            {/* Mobile overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black md:hidden"
              onClick={() => setMobileSidebar(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-white/90 dark:bg-[#121212]/95 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-850/50 flex flex-col text-slate-800 dark:text-[#ececec] md:hidden select-none"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-slate-200/50 dark:border-[#2d2d2d]/80">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Zap size={13} className="text-white fill-white" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">PromptBeast</span>
                </div>
                <button
                  onClick={() => setMobileSidebar(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2f2f2f] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile "New chat" button */}
              <div className="p-3">
                <button
                  onClick={() => { handleNew(); setMobileSidebar(false); }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/60 dark:border-[#3e3e3e]/60 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-[#212121]/80 dark:hover:bg-[#2f2f2f] text-sm text-slate-800 dark:text-[#ececec] font-medium transition-colors"
                >
                  <Plus size={15} className="text-amber-500 dark:text-amber-400" />
                  New Prompt
                </button>
              </div>

              {/* History list */}
              <div className="flex-grow overflow-y-auto px-3 pb-3 space-y-4 scrollbar-none">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2 block">
                    Recent Prompts
                  </span>
                  {historyList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 dark:text-[#676767]">
                      No recent prompts
                    </div>
                  ) : (
                    historyList.slice(0, 20).map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="flex items-center justify-between px-2.5 py-2.5 rounded-xl text-sm hover:bg-slate-200/50 dark:hover:bg-[#2f2f2f]/60 text-slate-600 dark:text-[#b4b4b4] hover:text-slate-900 dark:hover:text-[#ececec] cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <History size={13} className="text-slate-400 dark:text-[#676767] flex-shrink-0" />
                          <span className="truncate pr-1">{item.userInput}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistory(e, item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-200/50 dark:border-[#2d2d2d]/80 space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs hover:bg-slate-200/50 dark:hover:bg-[#2f2f2f] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <ArrowLeft size={13} />
                  Back to Home
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN WORKSPACE ───────────────────────────────────────── */}
      <div className="flex-grow h-full flex flex-col overflow-hidden relative">
        
        {/* Topbar Navigation */}
        <header className="h-14 border-b border-slate-200/40 dark:border-[#2d2d2d]/40 flex items-center justify-between px-4 bg-white/50 dark:bg-[#171717]/50 backdrop-blur-xl select-none flex-shrink-0 z-25 shadow-sm">
          <div className="flex items-center gap-2">
            {/* Sidebar closed panel trigger */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f] cursor-pointer transition-colors active:scale-90"
                title="Open sidebar"
              >
                <PanelLeft size={16} />
              </button>
            )}
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebar(true)}
              className="flex md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f] cursor-pointer"
            >
              <Menu size={16} />
            </button>

            {/* Topbar Custom Dropdown Select */}
            <div className="relative" ref={modelDropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f] text-sm font-semibold text-slate-700 dark:text-white transition-all cursor-pointer select-none active:scale-95 border border-transparent hover:border-slate-200/60 dark:hover:border-[#383838]/80"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {provider === 'openai' ? 'GPT-4o Mini' : 'HuggingFace Engine'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform duration-250 ${modelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, type: 'spring', damping: 22, stiffness: 380 }}
                    className="absolute left-0 mt-1.5 w-72 rounded-2xl border border-slate-200/80 dark:border-[#3e3e3e]/80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl shadow-2xl p-2.5 z-45 space-y-1.5"
                  >
                    <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest px-2.5 block select-none">
                      Select LLM Model
                    </div>
                    
                    <button
                      onClick={() => { setProvider('openai'); setModelDropdownOpen(false); }}
                      className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer select-none
                        ${provider === 'openai' 
                          ? 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold' 
                          : 'hover:bg-slate-100/60 dark:hover:bg-[#2c2c2c]/65 text-slate-700 dark:text-slate-350'}`}
                    >
                      <Cpu size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold flex items-center justify-between">
                          GPT-4o Mini
                          {provider === 'openai' && <Check size={13} className="text-amber-500" />}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-0.5">OpenAI recommended model. High-speed, robust template styling.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setProvider('huggingface'); setModelDropdownOpen(false); }}
                      className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer select-none
                        ${provider === 'huggingface' 
                          ? 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold' 
                          : 'hover:bg-slate-100/60 dark:hover:bg-[#2c2c2c]/65 text-slate-700 dark:text-slate-350'}`}
                    >
                      <Bot size={15} className="text-orange-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold flex items-center justify-between">
                          HuggingFace Qwen
                          {provider === 'huggingface' && <Check size={13} className="text-amber-500" />}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-0.5">Qwen 2.5-7B open-source model. SOTD reasoning capabilities.</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Background Effect Toggle */}
            <button
              onClick={toggleBackground}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f] cursor-pointer transition-all active:scale-90 flex items-center justify-center relative overflow-hidden group"
              title={`Background Effect: ${backgroundEffect}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={backgroundEffect}
                  initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 15, scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {backgroundEffect === 'atom' && <Atom size={15} className="text-amber-500 dark:text-amber-400" />}
                  {backgroundEffect === 'bubble' && <Sparkles size={15} className="text-blue-500 dark:text-blue-400 animate-pulse" />}
                  {backgroundEffect === 'none' && <Zap size={15} className="text-slate-400 dark:text-slate-500" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Theme trigger */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f] cursor-pointer transition-colors active:scale-90"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            
            <Link
              href="/"
              className="flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-[#2f2f2f]"
              title="Go back to Homepage"
            >
              <ArrowLeft size={15} />
            </Link>
          </div>
        </header>

        {/* Chat Stream Window */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 scrollbar-none bg-transparent">
          <div className="max-w-2xl mx-auto w-full space-y-6 pb-40 pt-3">
            
            {thread.length === 0 ? (
              /* ── WELCOME SCREEN (Sleek minimalist staggered typography) ── */
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center justify-center text-center pt-8 md:pt-16 space-y-6 select-none"
              >
                {/* Glowing Core Logo */}
                <motion.div
                  variants={{ hidden: { scale: 0.8, opacity: 0 }, show: { scale: 1, opacity: 1 } }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 flex items-center justify-center shadow-inner relative group"
                >
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-amber-500/5 blur-md animate-pulse" />
                  <Sparkles size={24} className="text-amber-500 animate-spark relative z-10" />
                </motion.div>

                <motion.div
                  variants={{ hidden: { y: 10, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  className="space-y-2"
                >
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    What prompt can I craft for you?
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#a5a5a5] max-w-sm mx-auto leading-relaxed">
                    Describe your prompt concept and select category attributes. The model will stream an optimized template instantly.
                  </p>
                </motion.div>

                {/* Grid Suggestions */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl pt-4"
                >
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      variants={{
                        hidden: { y: 12, opacity: 0 },
                        show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } }
                      }}
                      onClick={() => { setInput(s.text); setCategory(s.cat); setTone(s.tone); }}
                      className="group flex flex-col items-start p-3.5 text-left bg-slate-50/50 hover:bg-slate-100/60 dark:bg-[#2f2f2f]/30 dark:hover:bg-[#2b2b2b]/55 border border-slate-200/50 dark:border-[#383838]/80 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-xs font-bold text-slate-800 dark:text-[#ececec] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        {s.title}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-1 flex-grow">
                        {s.desc}
                      </span>
                      <div className="w-full flex items-center justify-between mt-3 z-10">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#212121] text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-[#2d2d2d]">
                          {s.cat}
                        </span>
                        <ChevronRight size={12} className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* ── MESSAGE THREAD (Airy design with zero rigid borders) ── */
              <div className="space-y-6">
                {thread.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'user' ? (
                      /* Sleek user bubble (no rigid outlines) */
                      <div className="max-w-[75%] bg-slate-100/90 dark:bg-[#2f2f2f]/85 text-[#0d0d0d] dark:text-[#ececec] rounded-2xl rounded-tr-none px-4 py-2.5 text-sm leading-relaxed shadow-sm select-text border border-slate-200/20 dark:border-[#383838]/40">
                        {msg.content}
                      </div>
                    ) : (
                      /* Airy assistant template block */
                      <div className="flex gap-4 w-full select-none">
                        {/* Custom pulsing Avatar */}
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow shadow-amber-900/10 flex-shrink-0 relative ${streamingIdx === i ? 'animate-pulse' : ''}`}>
                          <Bot size={15} className="text-white fill-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 select-none tracking-widest uppercase">
                            <span className="text-amber-500 font-mono">OPTIMIZED PROMPT</span>
                            <span className="font-mono">
                              {model && <>{model} · </>}{tokens > 0 && <>{tokens} TOK</>}
                            </span>
                          </div>
                          
                          {/* Inner clean prompt card (No heavy border outlines) */}
                          <div className="bg-slate-50/50 dark:bg-[#2a2a2a]/30 border border-slate-250/20 dark:border-[#2d2d2d]/60 rounded-2xl p-5 relative select-text transition-all duration-300">
                            <p className="prompt-text text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-[#e4e4e4] font-medium tracking-wide">
                              {msg.content}
                              {/* Blinking neon stream cursor */}
                              {streamingIdx === i && (
                                <span className="inline-block w-1.5 h-3.5 bg-amber-500 dark:bg-amber-400 ml-1 animate-pulse rounded-sm" />
                              )}
                            </p>
                          </div>

                          {/* Borderless minimalist micro-controls under response */}
                          <div className="flex items-center gap-1 mt-1.5 select-none opacity-85 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer"
                            >
                              {copiedIdx === i ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              <span>{copiedIdx === i ? 'Copied' : 'Copy'}</span>
                            </button>

                            <button
                              onClick={() => handleDownload(msg.content)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer"
                            >
                              <Download size={11} />
                              <span>Download</span>
                            </button>

                            <button
                              onClick={() => handleShare(msg.content)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2d2d2d] transition-all cursor-pointer"
                            >
                              <Share2 size={11} />
                              <span>Share</span>
                            </button>

                            <button
                              onClick={() => handleFav(msg.content, i)}
                              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ml-auto
                                ${favs[i] 
                                  ? 'text-amber-500 bg-amber-500/10' 
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2d2d2d]'}`}
                            >
                              {favs[i] ? <Star size={11} fill="currentColor" /> : <StarOff size={11} />}
                              <span>{favs[i] ? 'Saved' : 'Fav'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Blinking dots thinking state */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 w-full select-none"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow shadow-amber-900/10 flex-shrink-0 animate-pulse">
                  <Bot size={15} className="text-white fill-white" />
                </div>
                <div className="flex-grow min-w-0 pt-2.5 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-[#a5a5a5] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-[#a5a5a5] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-[#a5a5a5] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={chatEnd} />
          </div>
        </div>

        {/* ── FLOATING BOTTOM INPUT BAR (Premium polished version) ── */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/98 via-white/80 to-transparent dark:from-[#0d0d14]/98 dark:via-[#0d0d14]/70 dark:to-transparent pt-12 pb-5 px-4 select-none flex-shrink-0 z-20">
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-2.5">

            {/* Input Card Container */}
            <form
              onSubmit={handleSend}
              className="group relative flex flex-col rounded-[10px] border border-slate-200/80 dark:border-[#383838]/80 bg-white/95 dark:bg-[#252525]/95 backdrop-blur-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/30 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-black/40 transition-all duration-300 focus-within:border-amber-400/60 dark:focus-within:border-amber-500/40 focus-within:shadow-xl focus-within:shadow-amber-500/8 dark:focus-within:shadow-amber-500/5"
              style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.04)' }}
            >
              {/* Subtle inner top highlight line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/10 to-transparent rounded-full pointer-events-none" />

              {/* Textarea + clear row */}
              <div className="relative flex items-start gap-1 px-4 pt-3.5 pb-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    const ta = textareaRef.current;
                    if (ta) {
                      ta.style.height = 'auto';
                      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={thread.length === 0
                    ? 'Describe your prompt idea... (e.g., "A viral Twitter thread on AI trends")'
                    : 'Refine this prompt... (e.g., "make it shorter" or "add more technical terms")'}
                  rows={1}
                  disabled={loading || streamingIdx !== null}
                  className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none resize-none text-sm leading-relaxed text-slate-900 dark:text-[#e8e8e8] placeholder-slate-400/80 dark:placeholder-[#5a5a5a] min-h-[40px] max-h-[200px] overflow-y-auto scrollbar-none py-0.5 font-[450] tracking-[0.01em]"
                />
                {/* Clear input button */}
                <AnimatePresence>
                  {input.length > 0 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.12 }}
                      onClick={() => { setInput(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; textareaRef.current?.focus(); }}
                      className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-slate-100 dark:bg-[#3a3a3a] hover:bg-slate-200 dark:hover:bg-[#444] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Clear input"
                    >
                      <X size={10} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom controls row */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1.5 gap-2">

                {/* Selector pills */}
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <CustomSelector value={mode} options={MODES} icon={Sliders} onChange={setMode} />
                  <CustomSelector value={category} options={CATEGORIES} onChange={setCategory} />
                  <CustomSelector value={tone} options={TONES} onChange={setTone} />
                </div>

                {/* Right side: char count + send button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Character counter */}
                  <AnimatePresence>
                    {input.length > 0 && (
                      <motion.span
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ duration: 0.15 }}
                        className={`text-[10px] font-mono tabular-nums select-none transition-colors ${
                          input.length > 1800
                            ? 'text-red-400 dark:text-red-400'
                            : input.length > 1200
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-slate-350 dark:text-[#5a5a5a]'
                        }`}
                      >
                        {input.length}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || loading || streamingIdx !== null}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 overflow-hidden flex-shrink-0 ${
                      (loading || streamingIdx !== null)
                        ? 'bg-amber-500/90 dark:bg-amber-500/80 text-white cursor-not-allowed'
                        : input.trim()
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 cursor-pointer'
                        : 'bg-slate-100 dark:bg-[#2c2c2c] text-slate-300 dark:text-[#444] cursor-not-allowed'
                    }`}
                    title="Generate Prompt (Enter)"
                  >
                    {/* Spinning ring when generating */}
                    {(loading || streamingIdx !== null) && (
                      <span className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    )}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loading || streamingIdx !== null ? 'loading' : 'idle'}
                        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-center"
                      >
                        <ArrowUp size={14} strokeWidth={2.8} />
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </form>

            {/* Micro disclaimer */}
            <p className="text-[10px] text-center text-slate-400 dark:text-[#4a4a4a] select-none leading-relaxed">
              <span className="hidden sm:inline">
                <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#2a2a2a] border border-slate-200/70 dark:border-[#383838]/70 text-slate-500 dark:text-[#5a5a5a] font-mono text-[9px]">Enter</kbd>
                {' '}to send · {' '}
                <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#2a2a2a] border border-slate-200/70 dark:border-[#383838]/70 text-slate-500 dark:text-[#5a5a5a] font-mono text-[9px]">Shift+Enter</kbd>
                {' '}for line · {' '}
              </span>
              PromptBeast can make mistakes. Verify important outputs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================================================================
   PAGE WRAPPER
   ================================================================ */
export default function GeneratorPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-transparent">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0d14]">
          <div className="flex flex-col items-center gap-4 select-none">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-450 dark:text-slate-500 text-sm font-semibold animate-pulse">Starting generator engine...</p>
          </div>
        </div>
      }>
        <GeneratorSection />
      </Suspense>
    </main>
  );
}
