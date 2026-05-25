'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Copy, Check, ExternalLink, Loader, Terminal, Download, LayoutGrid, Cpu } from 'lucide-react';
import Navbar from '../../components/Navbar';
import SeoHeader from '../../components/SeoHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { clientApi } from '../../utils/clientApi';
import { TEMPLATES } from '../../utils/templates';
import toast from 'react-hot-toast';

// Helper to map category slug to capitalized name
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

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { category_slug, prompt_id } = params;

  const categoryName = mapSlugToCategory(category_slug);

  if (!categoryName) {
    notFound();
    return null;
  }

  const [promptItem, setPromptItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPromptDetails() {
      try {
        let selectedItem = null;
        let allCategoryItems = [];

        // 1. Check if it is a static template
        if (prompt_id.startsWith('template-')) {
          const templateIdStr = prompt_id.replace('template-', '');
          const templateItem = TEMPLATES.find(t => t.id.toString() === templateIdStr);
          if (templateItem) {
            selectedItem = {
              id: prompt_id,
              title: templateItem.title,
              prompt_text: templateItem.prompt,
              category: templateItem.category,
              description: templateItem.description,
              isStatic: true
            };
          }
        }

        // 2. Fetch from database collections
        const dbData = await clientApi.fetchCollections();
        
        // Find matching item in DB if not already found in templates
        if (!selectedItem) {
          const dbItem = dbData.find(
            item => (item.id || item.pc_id).toString() === prompt_id
          );
          if (dbItem) {
            selectedItem = {
              id: dbItem.id || dbItem.pc_id,
              title: dbItem.pc_title || dbItem.title,
              prompt_text: dbItem.pc_prompt_text || dbItem.prompt_text,
              category: dbItem.pc_category || dbItem.category,
              description: 'Community contributed prompt collection template.',
              isStatic: false
            };
          }
        }

        if (!selectedItem) {
          setLoading(false);
          return; // trigger 404 in layout
        }

        setPromptItem(selectedItem);

        // 3. Find related items (same category, excluding current)
        const staticRelated = TEMPLATES.filter(
          t => t.category.toLowerCase() === categoryName.toLowerCase() && `template-${t.id}` !== selectedItem.id.toString()
        ).map(t => ({
          id: `template-${t.id}`,
          title: t.title,
          category: t.category,
          isStatic: true
        }));

        const dbRelated = dbData.filter(
          item => (item.category || '').toLowerCase() === categoryName.toLowerCase() && (item.id || item.pc_id).toString() !== selectedItem.id.toString()
        ).map(item => ({
          id: item.id || item.pc_id,
          title: item.pc_title || item.title,
          category: item.pc_category || item.category,
          isStatic: false
        }));

        const combinedRelated = [...staticRelated, ...dbRelated].slice(0, 3);
        setRelatedItems(combinedRelated);
        
      } catch (err) {
        console.error('Failed to load prompt details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPromptDetails();
  }, [category_slug, prompt_id, categoryName]);

  // Dynamic SEO Metadata handled via SeoHeader component below

  if (!loading && !promptItem) {
    notFound();
    return null;
  }

  const handleCopy = async () => {
    if (!promptItem) return;
    await navigator.clipboard.writeText(promptItem.prompt_text);
    setCopied(true);
    toast.success('Prompt copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!promptItem) return;
    const blob = new Blob([promptItem.prompt_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${promptItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-prompt.txt`;
    link.click();
    toast.success('Downloaded prompt file!');
  };

  const handleUsePrompt = () => {
    if (!promptItem) return;
    router.push(`/generator?prompt=${encodeURIComponent(promptItem.prompt_text)}`);
  };

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="prompt_detail" data={{ promptItem, categoryName, category_slug }} />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Ambient background glow */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          
          {/* Breadcrumb back navigation */}
          <Link
            href={`/${category_slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all mb-8 cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft size={14} /> Back to {categoryName} Library
          </Link>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Assembling prompt layout details...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Card Detail */}
              <motion.article
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-6 md:p-12 relative overflow-hidden glow-purple-strong"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-transparent to-transparent pointer-events-none" />
                
                {/* Meta details */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <Link href={`/${category_slug}`} className="hover:underline">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                      {promptItem.category}
                    </span>
                  </Link>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                    {promptItem.isStatic ? 'Static Library' : 'Database Preset'}
                  </span>
                </div>

                {/* Prompt Title */}
                <h1
                  className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight relative z-10"
                  style={{ fontFamily: 'var(--font-display, sans-serif)' }}
                >
                  {promptItem.title}
                </h1>

                {/* Description */}
                <p className="text-sm text-white/50 mb-8 max-w-2xl leading-relaxed">
                  {promptItem.description}
                </p>

                {/* Displaying Prompt Code block */}
                <div className="relative mb-8 z-10 group/code">
                  <div className="flex items-center justify-between px-4 py-2 border border-white/5 border-b-0 bg-black/40 rounded-t-2xl font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    <span>Prompt Structure</span>
                    <Terminal size={12} className="text-white/20" />
                  </div>
                  <div className="bg-black/30 dark:bg-black/50 border border-white/5 rounded-b-2xl p-6 font-mono text-xs leading-relaxed text-slate-300 select-all overflow-x-auto whitespace-pre-wrap max-h-96">
                    {promptItem.prompt_text}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 items-center relative z-10 border-t border-white/5 pt-8">
                  <button
                    onClick={handleCopy}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98 border border-white/5"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-400 animate-pulse" /> Copied Prompt
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-slate-400" /> Copy to Clipboard
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98 border border-white/5"
                  >
                    <Download size={14} className="text-slate-400" /> Download .txt
                  </button>

                  <button
                    onClick={handleUsePrompt}
                    className="flex-2 min-w-[200px] flex items-center justify-center gap-2 btn-primary rounded-xl py-3 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98"
                  >
                    <Sparkles size={14} fill="currentColor" /> Run in AI Generator <ExternalLink size={11} className="opacity-70" />
                  </button>
                </div>
              </motion.article>

              {/* Related Prompts Grid Section */}
              {relatedItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white tracking-wide uppercase text-[10px] text-white/30 tracking-widest pl-2">
                    Related {categoryName} Prompts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedItems.map(item => (
                      <Link key={item.id} href={`/${category_slug}/${item.id}`}>
                        <div className="glass-card p-5 hover:border-amber-500/20 transition-all duration-300 card-hover group cursor-pointer h-full flex flex-col justify-between">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20 w-fit mb-3">
                            {item.category}
                          </span>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-white/30 mt-4 block hover:underline text-right font-medium">
                            View details →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
