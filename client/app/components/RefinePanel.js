'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Bot, Copy, CheckCheck, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RefinePanel({ 
  isOpen, 
  onClose, 
  chatHistory = [], 
  onSendMessage, 
  loading,
  onApplyPrompt 
}) {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const copyToClipboard = async (text, index) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(index);
    toast.success('Prompt copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const SUGGESTIONS = [
    'Make it shorter',
    'Add step-by-step instructions',
    'Make it more creative',
    'Optimize for GPT-4',
    'Add negative guidelines'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020208] z-[140] backdrop-blur-xs md:backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-[#090911]/95 border-l border-slate-200 dark:border-white/8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[150] flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/6 bg-slate-50/50 dark:bg-white/1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Refine with AI</h3>
                  <p className="text-[10px] text-slate-500 dark:text-white/40">Iterate and polish your prompt</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/15 transition-all"
              >
                <X size={15} />
              </button>
            </div>
 
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 flex flex-col custom-scrollbar">
              {chatHistory.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isFirst = index === 0;
 
                return (
                  <div 
                    key={index}
                    className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    {/* Header line inside chat */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-white/30 font-semibold tracking-wider uppercase px-1">
                      {isUser ? (
                        <>
                          <span>You</span>
                          <User size={10} />
                        </>
                      ) : (
                        <>
                          <Bot size={10} className="text-purple-500 dark:text-purple-400" />
                          <span>{isFirst ? 'Original Prompt' : 'Refined Prompt'}</span>
                        </>
                      )}
                    </div>
 
                    {/* Bubble */}
                    <div 
                      className={`relative group ${
                        isUser
                          ? 'bg-purple-600 border border-purple-500 text-white rounded-xl px-4 py-3 text-sm max-w-[80%] shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-slate-800 dark:text-white/90 rounded-xl px-4 py-3 text-sm max-w-[80%] shadow-sm'
                      }`}
                    >
                      {msg.content}
 
                      {/* AI Response Quick Action Toolbar */}
                      {!isUser && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => copyToClipboard(msg.content, index)}
                            title="Copy prompt"
                            className="w-7 h-7 rounded-lg bg-white/90 dark:bg-black/60 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-black/80 transition-all shadow-sm cursor-pointer"
                          >
                            {copiedId === index ? <CheckCheck size={12} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={12} />}
                          </button>
                          
                          {/* Apply Prompt Button: Sets the main output to this history item */}
                          <button
                            onClick={() => {
                              onApplyPrompt(msg.content);
                              toast.success('Prompt applied to editor!');
                            }}
                            title="Apply to main editor"
                            className="w-7 h-7 rounded-lg bg-purple-600/80 hover:bg-purple-600 border border-purple-500/30 flex items-center justify-center text-slate-50 transition-all cursor-pointer"
                          >
                            <Undo2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
 
              {/* Bot loading state */}
              {loading && (
                <div className="flex flex-col gap-1.5 items-start">
                  <div className="flex items-center gap-1 text-[10px] text-purple-500 dark:text-purple-400/70 font-semibold tracking-wider uppercase px-1">
                    <Bot size={10} className="animate-spin" />
                    <span>Beast is refining...</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl rounded-tl-sm px-4 py-3.5 max-w-[80%] flex flex-col gap-2 w-full shadow-inner">
                    <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              )}
 
              <div ref={chatEndRef} />
            </div>
 
            {/* Suggestions */}
            {chatHistory.length > 0 && !loading && (
              <div className="px-5 py-2.5 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/3 border border-slate-200 dark:border-white/6 text-slate-600 dark:text-white/60 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-600/10 transition-all duration-200 cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
 
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-white/6 bg-slate-50/50 dark:bg-white/1 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to refine, shorten, extend, or rewrite..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-white/4 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/25 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-100 dark:disabled:bg-white/5 flex items-center justify-center shadow-lg disabled:shadow-none hover:shadow-purple-500/20 transition-all border border-transparent disabled:border-slate-200 dark:disabled:border-white/5 cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95 disabled:scale-100"
              >
                <Send 
                  size={15} 
                  className={(!input.trim() || loading) ? 'text-slate-400 dark:text-white/30 transition-colors' : 'text-white transition-colors'} 
                />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
