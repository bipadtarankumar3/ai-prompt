'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Copy, Check, Share2, Sparkles, Terminal, 
  ChevronDown, BookOpen, AlertCircle, Bookmark, CheckCircle, 
  Send, HelpCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { clientApi } from '../utils/clientApi';

// Helper to map category name to URL slug
const getCategorySlug = (category) => {
  const mappings = {
    'chatgpt': 'chatgpt-prompts',
    'claude': 'claude-prompts',
    'gemini': 'gemini-prompts',
    'coding': 'coding-prompts',
    'seo': 'seo-prompts',
    'marketing': 'marketing-prompts',
    'business': 'business-prompts',
    'image': 'image-prompts',
    'video': 'video-prompts'
  };
  const raw = (category || '').toLowerCase().trim();
  return mappings[raw] || `${raw.replace(/\s+/g, '-')}-prompts`;
};

export default function PromptClientDetails({ prompt, relatedPrompts }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [saved, setSaved] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const categorySlug = getCategorySlug(prompt.category);

  // Retrieve user session if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pb_auth_token');
      setAuthToken(token);
      if (token) {
        // Fetch if prompt is saved
        clientApi.fetchSavedPrompts(token)
          .then(list => {
            const isSaved = list.some(item => item.id === prompt.id);
            setSaved(isSaved);
          })
          .catch(console.error);
      }
    }

    // Trigger View increment in backend
    clientApi.incrementPromptView(prompt.id).catch(console.error);
    // Track page views in analytics
    clientApi.trackAnalyticsEvent('page_view', prompt.slug, { category: prompt.category }).catch(console.error);
  }, [prompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    toast.success('Prompt copied to clipboard!');
    
    // Trigger copy increment in DB and event logger
    clientApi.incrementPromptCopy(prompt.id).catch(console.error);
    clientApi.trackAnalyticsEvent('copy_prompt', prompt.slug).catch(console.error);
    
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleSave = async () => {
    if (!authToken) {
      toast.error('Please log in from the admin or dashboard area to save prompts.');
      return;
    }

    try {
      const res = await clientApi.toggleSavePrompt(authToken, prompt.id);
      setSaved(res.saved);
      toast.success(res.saved ? 'Saved to your dashboard favorites!' : 'Removed from saved prompts.');
    } catch (err) {
      toast.error(err.message || 'Failed to save prompt.');
    }
  };

  const handleShare = async (platform) => {
    const pageUrl = window.location.href;
    const shareText = `Check out this amazing AI prompt: "${prompt.title}" on Revoxera!`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, '_blank');
    } else {
      await navigator.clipboard.writeText(pageUrl);
      toast.success('Share link copied to clipboard!');
    }
    clientApi.trackAnalyticsEvent('share_click', prompt.slug, { platform }).catch(console.error);
  };

  const handleUsePrompt = () => {
    clientApi.trackAnalyticsEvent('run_generator_click', prompt.slug).catch(console.error);
    router.push(`/generator?prompt=${encodeURIComponent(prompt.prompt_text)}`);
  };

  return (
    <div className="space-y-12">
      {/* ── BREADCRUMBS & NAVIGATION ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 select-none">
        <Link
          href={`/${categorySlug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 transition-all cursor-pointer select-none active:scale-95"
        >
          <ArrowLeft size={14} /> Back to {prompt.category} Prompts
        </Link>

        <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/prompt-collections" className="hover:text-amber-400 transition-colors">Prompts</Link>
          <span>/</span>
          <Link href={`/${categorySlug}`} className="hover:text-amber-400 transition-colors">{prompt.category}</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[150px]">{prompt.title}</span>
        </div>
      </div>

      {/* ── MAIN PROMPT CONTAINER CARD ── */}
      <motion.article 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-10 relative overflow-hidden glow-purple-strong"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Categories, features and saves row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href={`/${categorySlug}`}>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 transition-all">
                {prompt.category}
              </span>
            </Link>
            {prompt.is_featured && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider text-purple-400 bg-purple-500/10 border-purple-500/20">
                ⭐ Featured
              </span>
            )}
            {prompt.is_premium && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                💎 Premium
              </span>
            )}
          </div>
          
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              saved 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title={saved ? 'Unsave prompt' : 'Save prompt to dashboard'}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title & Description */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          {prompt.title}
        </h1>
        <p className="text-sm md:text-base text-white/60 mb-8 leading-relaxed max-w-3xl">
          {prompt.description || 'Professional grade instruction framework optimized for production systems and high quality outputs.'}
        </p>

        {/* COPYABLE PROMPT CODE BOX */}
        <div className="space-y-2 mb-8">
          <div className="flex items-center justify-between px-4 py-2 bg-black/40 border border-white/5 border-b-0 rounded-t-2xl font-mono text-[10px] text-white/40 uppercase tracking-widest">
            <span>Prompt Blueprint</span>
            <Terminal size={12} className="text-white/20" />
          </div>
          <div className="bg-black/35 dark:bg-black/55 border border-white/5 rounded-b-2xl p-6 font-mono text-xs leading-relaxed text-slate-350 select-all overflow-x-auto whitespace-pre-wrap max-h-96 shadow-inner relative group">
            {prompt.prompt_text}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4 items-center border-t border-white/5 pt-8 z-10 relative">
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98 border border-white/5"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400 animate-pulse" /> Copied blueprint
              </>
            ) : (
              <>
                <Copy size={14} className="text-slate-400" /> Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={handleUsePrompt}
            className="flex-2 min-w-[220px] flex items-center justify-center gap-2 btn-primary rounded-xl py-3.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98"
          >
            <Sparkles size={14} fill="currentColor" /> Run in Prompt Optimizer <ArrowRight size={12} className="opacity-70" />
          </button>
        </div>
      </motion.article>

      {/* ── USE CASES & EXAMPLES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* USE CASES CARD */}
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6 flex items-center gap-2 select-none">
              <CheckCircle size={14} /> Recommended Use Cases
            </h3>
            
            {prompt.use_cases && prompt.use_cases.length > 0 ? (
              <ul className="space-y-4">
                {prompt.use_cases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-white/70 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">No specific use cases listed. Perfect for all general workflows.</p>
            )}
          </div>

          {/* SHARE LINKS */}
          <div className="border-t border-white/5 pt-6 mt-8 flex items-center justify-between select-none">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Share Prompt</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-white/50 cursor-pointer transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-white/50 cursor-pointer transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </button>
              <button 
                onClick={() => handleShare('link')}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-white/50 cursor-pointer transition-colors"
                title="Copy Link"
              >
                <Share2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* METRICS & METADATA DETAILS */}
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between select-none">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6 flex items-center gap-2">
              <BookOpen size={14} /> Prompt Engine Specs
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-white/40 font-medium">Platform Category</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{prompt.category}</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-white/40 font-medium">Generated Copies</span>
                <span className="text-xs font-mono font-bold text-white">{prompt.copy_count || 0} copies</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-white/40 font-medium">Platform Page Views</span>
                <span className="text-xs font-mono font-bold text-white">{prompt.view_count || 0} views</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-medium">Added to Directory</span>
                <span className="text-xs font-bold text-white/70">
                  {prompt.created_at ? new Date(prompt.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'May 2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 mt-8 flex items-start gap-3">
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/50 leading-relaxed">
              This prompt is formatted with structured parameters e.g. <span className="font-mono text-amber-300 bg-amber-500/10 px-1 py-0.5 rounded">[VARIABLE]</span>. Replace variables with your contextual details prior to running inside LLM consoles.
            </p>
          </div>
        </div>
      </div>

      {/* ── BEFORE & AFTER (EXAMPLE INPUT & OUTPUT) ── */}
      {(prompt.example_inputs || prompt.example_outputs) && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 tracking-widest pl-2 select-none">
            Prompt Execution Example
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input example */}
            {prompt.example_inputs && (
              <div className="glass-card p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-amber-400 uppercase tracking-widest select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Example Variable Inputs
                </div>
                <div className="bg-black/20 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 border border-white/5 whitespace-pre-wrap select-text">
                  {prompt.example_inputs}
                </div>
              </div>
            )}

            {/* Output example */}
            {prompt.example_outputs && (
              <div className="glass-card p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Expected Quality Output
                </div>
                <div className="bg-black/20 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-350 border border-white/5 whitespace-pre-wrap select-text">
                  {prompt.example_outputs}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FAQ SECTION ── */}
      {prompt.faqs && prompt.faqs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 tracking-widest pl-2 select-none">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {prompt.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="glass-card border border-white/5 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-white hover:text-amber-400 transition-colors cursor-pointer select-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={14} className="text-amber-400 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown size={14} className={`text-white/40 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-white/60 leading-relaxed border-t border-white/5 select-text">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RELATED PROMPTS SECTION ── */}
      {relatedPrompts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 tracking-widest pl-2 select-none">
            Related Prompts you might like
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPrompts.map(item => {
              const itemSlug = item.slug || item.id;
              return (
                <Link key={item.id} href={`/prompt/${itemSlug}`}>
                  <div className="glass-card p-6 hover:border-amber-500/20 transition-all duration-300 card-hover group cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20 w-fit mb-3 block select-none">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-white/40 mt-2 line-clamp-2 leading-relaxed">
                        {item.description || 'Click to explore details and copy this template.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-white/30 mt-4 block hover:underline text-right font-medium select-none">
                      Get prompt →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
