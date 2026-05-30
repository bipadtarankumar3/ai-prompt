'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Copy, Check, ExternalLink, LayoutGrid, Loader, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { clientApi } from '../utils/clientApi';
import toast from 'react-hot-toast';
import SeoHeader from '../components/SeoHeader';

export default function PromptCollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await clientApi.fetchCollections();
        setCollections(data);
      } catch (err) {
        console.error('Failed to load collections:', err);
        toast.error('Failed to load prompt collections');
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (promptText) => {
    router.push(`/generator?prompt=${encodeURIComponent(promptText)}`);
  };

  // Filter logic
  const categories = ['All', ...new Set(collections.map(c => c.category))];
  
  const filteredCollections = collections.filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.prompt_text.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="collections" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow background */}
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Library & Presets
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Expert Prompt Collections
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-xl mx-auto leading-relaxed"
            >
              Discover curated, battle-tested prompt architectures ready to run. Copy them instantly or open in the generator.
            </motion.p>
          </div>

          {/* Controls: Search and Categories */}
          <div className="glass-card p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search prompts, tags, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
              {loading ? null : (
                categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all duration-200 active:scale-95 ${
                      activeCategory === cat
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Loading prompts...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <LayoutGrid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-white/60">No prompt collections match your search.</p>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCollections.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="glass-card p-6 flex flex-col h-full hover:border-amber-500/25 transition-all duration-300 card-hover group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-white/30 font-medium">Prompt ID: #{item.id}</span>
                  </div>

                  <Link href={`/prompt/${item.slug || item.id}`}>
                    <h3 className="text-sm font-bold text-white mb-3 group-hover:text-amber-300 transition-colors cursor-pointer hover:underline">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Prompt box */}
                  <div className="bg-black/30 dark:bg-black/40 border border-white/5 rounded-xl p-3.5 flex-1 mb-5 font-mono text-[11px] leading-relaxed text-slate-350 select-all line-clamp-4 relative group/code overflow-hidden">
                    <Terminal size={12} className="absolute right-3.5 top-3 text-white/10 group-hover/code:text-white/20 transition-all pointer-events-none" />
                    {item.prompt_text}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                    <button
                      onClick={() => handleCopy(item.id, item.prompt_text)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98 border border-white/5"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={14} className="text-green-400 animate-pulse" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-slate-400" /> Copy Prompt
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleUsePrompt(item.prompt_text)}
                      className="flex-1 flex items-center justify-center gap-1.5 btn-primary rounded-xl py-2.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98"
                    >
                      <Sparkles size={14} fill="currentColor" /> Run Generator <ExternalLink size={11} className="opacity-70" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
