'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, Copy, Check, ExternalLink, Loader,
  Terminal, LayoutGrid, SlidersHorizontal, ChevronLeft, ChevronRight,
  ArrowRight, TrendingUp, Star, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CategoryPageClient({ initialPrompts, initialTotal, initialPages, categoryName, categorySlug }) {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────────────────────
  const [items, setItems] = useState(initialPrompts || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [totalPages, setTotalPages] = useState(initialPages || 1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterType, sortBy]);

  // Fetch from server when filters/page change (client-side search/sort/filter)
  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sort: sortBy,
        filter: filterType,
      });

      let url = `${API_URL}/api/prompt-collections/category/${encodeURIComponent(categoryName)}?${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      const result = json.data || json;

      let data = result.data || result;
      // Client-side search filter (API doesn't support search yet — fast in-memory)
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        data = data.filter(
          item =>
            (item.title || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q) ||
            (item.prompt_text || '').toLowerCase().includes(q)
        );
      }

      setItems(data);
      setTotal(result.total || data.length);
      setTotalPages(result.totalPages || Math.ceil((result.total || data.length) / 12));
    } catch (err) {
      console.error('Category page fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, filterType, debouncedSearch, categoryName]);

  // Only refetch when user changes filters (initial render uses SSR data)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) { setMounted(true); return; }
    fetchPage();
  }, [mounted, currentPage, sortBy, filterType, debouncedSearch]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Prompt copied to clipboard!');
    try { await fetch(`${API_URL}/api/prompt-collections/${id}/copy`, { method: 'POST' }); } catch {}
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (promptText) => {
    router.push(`/generator?prompt=${encodeURIComponent(promptText)}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── FILTER BAR ── */}
      <div className="glass-card p-5 mb-10 flex flex-col gap-4 select-none">
        <div className="w-full relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            aria-label={`Search ${categoryName} prompts`}
            placeholder={`Search ${categoryName} prompts...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2" role="group" aria-label="Filter prompts">
            {[
              { key: 'all', label: 'All' },
              { key: 'featured', label: '⭐ Featured' },
              { key: 'premium', label: '💎 Premium' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                aria-pressed={filterType === key}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                  filterType === key
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/40 flex items-center gap-1"><SlidersHorizontal size={12} /> Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/30 border border-white/10 hover:border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:border-amber-500 outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Added</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {total > 0 && (
          <p className="text-[10px] text-white/30 font-mono">
            Showing {items.length} of {total} {categoryName} prompts
          </p>
        )}
      </div>

      {/* ── GRID ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm text-white/50">Loading prompts...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <LayoutGrid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-sm text-white/60">No prompts found matching your filters.</p>
          <button
            onClick={() => { setSearch(''); setFilterType('all'); setSortBy('popular'); }}
            className="mt-4 text-xs text-amber-400 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.article
                  key={item.id || item.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  className="glass-card p-6 flex flex-col h-full hover:border-amber-500/25 transition-all duration-300 card-hover group"
                >
                  <div className="flex items-center justify-between mb-4 select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                        {item.category}
                      </span>
                      {item.is_featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase">
                          Featured
                        </span>
                      )}
                      {item.is_premium && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                          Premium
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-white/30 font-medium font-mono">
                      {item.copy_count?.toLocaleString()} copies
                    </span>
                  </div>

                  <Link href={`/prompt/${item.slug}`}>
                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-300 transition-colors cursor-pointer hover:underline leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors font-mono"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="bg-black/30 dark:bg-black/40 border border-white/5 rounded-xl p-3.5 flex-1 mb-5 font-mono text-[11px] leading-relaxed text-slate-350 select-all line-clamp-4 relative group/code overflow-hidden">
                    <Terminal size={12} className="absolute right-3.5 top-3 text-white/10 group-hover/code:text-white/20 transition-all pointer-events-none" />
                    {item.prompt_text}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto select-none">
                    <button
                      onClick={() => handleCopy(item.id, item.prompt_text)}
                      aria-label={`Copy prompt: ${item.title}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98 border border-white/5"
                    >
                      {copiedId === item.id ? (
                        <><Check size={14} className="text-green-400 animate-pulse" /> Copied</>
                      ) : (
                        <><Copy size={14} className="text-slate-400" /> Copy Prompt</>
                      )}
                    </button>

                    <button
                      onClick={() => handleUsePrompt(item.prompt_text)}
                      aria-label={`Optimize prompt: ${item.title}`}
                      className="flex-1 flex items-center justify-center gap-1.5 btn-primary rounded-xl py-2.5 text-xs font-semibold cursor-pointer select-none transition-all active:scale-98"
                    >
                      <Sparkles size={14} fill="currentColor" /> Optimize <ExternalLink size={11} className="opacity-70" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <nav aria-label="Prompt pagination" className="flex items-center justify-center gap-4 select-none pt-4 border-t border-white/5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all text-white cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-white/50 font-bold font-mono">
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 7 && <span className="text-white/30">…{totalPages}</span>}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all text-white cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      )}
    </>
  );
}
