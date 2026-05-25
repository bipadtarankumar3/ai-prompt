'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Copy, Check, ExternalLink, Loader, ArrowLeft, Terminal, LayoutGrid } from 'lucide-react';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { clientApi } from '../utils/clientApi';
import { TEMPLATES } from '../utils/templates';
import toast from 'react-hot-toast';

// Helper to check if a category is valid and map it to original capitalization
const mapSlugToCategory = (slug) => {
  if (!slug || !slug.endsWith('-prompts')) return null;
  const raw = slug.slice(0, -8).replace(/-/g, ' ').toLowerCase();
  
  const mappings = {
    'chatgpt': 'ChatGPT',
    'midjourney': 'Midjourney',
    'coding': 'Coding',
    'marketing': 'Marketing',
    'seo': 'SEO',
    'youtube': 'YouTube',
    'blogging': 'Blogging',
    'business': 'Business',
    'design': 'Design'
  };
  
  return mappings[raw] || raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category_slug = params.category_slug;

  const categoryName = mapSlugToCategory(category_slug);

  // If the slug doesn't follow the proper pattern, trigger 404 immediately
  if (!categoryName) {
    notFound();
    return null;
  }

  const [dbCollections, setDbCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);



  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await clientApi.fetchCollections();
        // Filter collections from DB by matching category name (case-insensitive)
        const filtered = data.filter(
          item => (item.category || '').toLowerCase() === categoryName.toLowerCase()
        );
        setDbCollections(filtered);
      } catch (err) {
        console.error('Failed to load DB collections for category page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, [categoryName]);

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (promptText) => {
    router.push(`/generator?prompt=${encodeURIComponent(promptText)}`);
  };

  // Get static templates for this category
  const staticTemplates = TEMPLATES.filter(
    t => t.category.toLowerCase() === categoryName.toLowerCase()
  ).map(t => ({
    id: `template-${t.id}`,
    title: t.title,
    prompt_text: t.prompt,
    category: t.category,
    description: t.description,
    isStatic: true
  }));

  // Combine static and dynamic collections
  const allItems = [
    ...staticTemplates,
    ...dbCollections.map(item => ({
      id: item.id || item.pc_id,
      title: item.pc_title || item.title,
      prompt_text: item.pc_prompt_text || item.prompt_text,
      category: item.pc_category || item.category,
      description: 'Community contributed prompt collection template.',
      isStatic: false
    }))
  ];

  // Apply search query filtering
  const filteredItems = allItems.filter(item => {
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt_text.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="category" data={{ categoryName, category_slug }} />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow backdrop */}
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          
          {/* Back to Collections */}
          <Link
            href="/prompt-collections"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all mb-8 cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Collections
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Curated Prompt Library
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Premium <span className="gradient-text">{categoryName} Prompts</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-xl mx-auto leading-relaxed"
            >
              Discover and deploy professional-grade instructions engineered for {categoryName}. Copy them instantly or refine them dynamically in the AI Generator.
            </motion.p>
          </div>

          {/* Search bar */}
          <div className="glass-card p-4 md:p-6 mb-10 flex gap-4 items-center justify-between">
            <div className="w-full relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${categoryName} prompts...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Content Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Fetching library items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <LayoutGrid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-white/60">No prompts found matching your criteria.</p>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, idx) => (
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
                    <span className="text-[10px] text-white/30 font-medium">
                      {item.isStatic ? 'Static Presets' : `Database Collection #${item.id}`}
                    </span>
                  </div>

                  {/* Title linking to the detail page */}
                  <Link href={`/${category_slug}/${item.id}`}>
                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-300 transition-colors cursor-pointer hover:underline">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-white/40 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Prompt Preview Block */}
                  <div className="bg-black/30 dark:bg-black/40 border border-white/5 rounded-xl p-3.5 flex-1 mb-5 font-mono text-[11px] leading-relaxed text-slate-350 select-all line-clamp-4 relative group/code overflow-hidden">
                    <Terminal size={12} className="absolute right-3.5 top-3 text-white/10 group-hover/code:text-white/20 transition-all pointer-events-none" />
                    {item.prompt_text}
                  </div>

                  {/* Actions */}
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
