'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader, CheckCircle, AlertTriangle, Search, RefreshCw, Plus, Tag, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Extracts unique [VARIABLE] placeholders from text.
 * @param {string} text - The text containing variables
 * @returns {string[]} Array of unique variable names
 */
function extractVariables(text) {
  if (!text) return [];
  const matches = text.match(/\[[A-Z_]+\]/g) || [];
  return [...new Set(matches)];
}

export default function AdminContentPage() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gapData, setGapData] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [createForm, setCreateForm] = useState({ title: '', category: '', prompt_text: '', description: '' });
  const [creating, setCreating] = useState(false);

  const CATEGORIES = ['ChatGPT', 'Claude', 'Gemini', 'Coding', 'SEO', 'Marketing', 'Business', 'Image', 'Video'];

  useEffect(() => {
    const saved = localStorage.getItem('pb_auth_token');
    if (saved) {
      setToken(saved);
      loadGaps(saved);
    }
  }, []);

  // ── Load content gaps ─────────────────────────────────────────────────────
  const loadGaps = async (authToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/content/gaps`, {
        headers: { Authorization: `Bearer ${authToken || token}` }
      });
      const json = await res.json();
      setGapData(json.data || json);
    } catch (err) {
      toast.error('Failed to load content gaps');
    } finally {
      setLoading(false);
    }
  };

  // ── Run batch enrichment ──────────────────────────────────────────────────
  const runBatch = async () => {
    setLoading(true);
    setBatchResult(null);
    try {
      const res = await fetch(`${API_URL}/api/content/generate-batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      const result = json.data || json;
      setBatchResult(result);
      toast.success(`Enriched ${result.enriched || 0} prompts`);
      await loadGaps(token);
    } catch (err) {
      toast.error('Batch enrichment failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Enrich single prompt ──────────────────────────────────────────────────
  const enrichSingle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/content/enrich/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Prompt enriched successfully!');
        await loadGaps(token);
      } else {
        toast.error(json.message || 'Enrichment failed');
      }
    } catch (err) {
      toast.error('Failed to enrich prompt');
    }
  };

  // ── Create + enrich new prompt ────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.category || !createForm.prompt_text) {
      toast.error('Title, category, and prompt text are required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/content/generate-prompt`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });
      const json = await res.json();
      if (json.success || json.data) {
        toast.success('Prompt created and auto-enriched!');
        setCreateForm({ title: '', category: '', prompt_text: '', description: '' });
        await loadGaps(token);
      } else {
        toast.error(json.message || 'Creation failed');
      }
    } catch (err) {
      toast.error('Failed to create prompt');
    } finally {
      setCreating(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="admin-card flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> Content Generation Pipeline
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">
            Auto-enrich prompts with tags, FAQs, variations, and SEO metadata in one click.
          </p>
        </div>
        <button
          onClick={() => loadGaps(token)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* ── GAP ANALYSIS ── */}
      {gapData && (
        <div className="admin-card space-y-5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
            <Search size={14} className="text-amber-500" /> Content Gap Analysis
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <div className="text-2xl font-extrabold text-slate-800 font-mono">{gapData.total || 0}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">Total Prompts</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
              <div className="text-2xl font-extrabold text-amber-600 font-mono">{gapData.needsEnrichment || 0}</div>
              <div className="text-[10px] text-amber-600 font-medium mt-1">Need Enrichment</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
              <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                {Math.max(0, (gapData.total || 0) - (gapData.needsEnrichment || 0))}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-1">Fully Enriched</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500 font-medium">
              <span>Enrichment Coverage</span>
              <span className="font-bold text-slate-700">
                {gapData.total > 0 ? Math.round(((gapData.total - gapData.needsEnrichment) / gapData.total) * 100) : 100}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-700"
                style={{
                  width: gapData.total > 0
                    ? `${((gapData.total - gapData.needsEnrichment) / gapData.total) * 100}%`
                    : '100%'
                }}
              />
            </div>
          </div>

          {/* Batch action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <p className="text-[11px] font-semibold text-slate-700">
                {gapData.needsEnrichment > 0
                  ? `${gapData.needsEnrichment} prompts need tags, FAQs, and SEO metadata.`
                  : '✓ All prompts are fully enriched!'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Generates tags, FAQs, variations, meta_title, meta_description in batches of 10.
              </p>
            </div>
            <button
              onClick={runBatch}
              disabled={loading || gapData.needsEnrichment === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            >
              {loading ? <Loader size={13} className="animate-spin" /> : <Zap size={13} />}
              Run Batch Enrichment
            </button>
          </div>

          {/* Gap prompts list */}
          {Array.isArray(gapData.prompts) && gapData.prompts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Prompts Needing Enrichment</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {gapData.prompts.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.category} · {p.slug}</p>
                    </div>
                    <button
                      onClick={() => enrichSingle(p.id)}
                      className="ml-3 shrink-0 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 text-[10px] font-bold cursor-pointer transition-all border border-amber-200"
                    >
                      Enrich
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BATCH RESULT ── */}
      {batchResult && (
        <div className={`admin-card border ${batchResult.failed > 0 ? 'border-amber-200 bg-amber-50/40' : 'border-emerald-200 bg-emerald-50/40'}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2 mb-4">
            {batchResult.failed > 0
              ? <AlertTriangle size={14} className="text-amber-500" />
              : <CheckCircle size={14} className="text-emerald-500" />}
            Batch Enrichment Complete
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-white border border-slate-100 p-3">
              <div className="text-xl font-bold font-mono text-slate-800">{batchResult.total || 0}</div>
              <div className="text-[10px] text-slate-500">Processed</div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
              <div className="text-xl font-bold font-mono text-emerald-700">{batchResult.enriched || 0}</div>
              <div className="text-[10px] text-emerald-600">Enriched ✓</div>
            </div>
            <div className={`rounded-lg p-3 border ${batchResult.failed > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`text-xl font-bold font-mono ${batchResult.failed > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                {batchResult.failed || 0}
              </div>
              <div className={`text-[10px] ${batchResult.failed > 0 ? 'text-red-500' : 'text-slate-400'}`}>Failed</div>
            </div>
          </div>
          {batchResult.errors?.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Errors:</p>
              {batchResult.errors.map((e, i) => (
                <p key={i} className="text-[10px] text-red-500 font-mono">{e.slug}: {e.error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE NEW PROMPT ── */}
      <div className="admin-card space-y-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
          <Plus size={14} className="text-amber-500" /> Create & Auto-Enrich New Prompt
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={createForm.title}
                onChange={e => setCreateForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Email Writing Prompt for Sales Outreach"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={createForm.category}
                onChange={e => setCreateForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-amber-400 outline-none cursor-pointer"
                required
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={createForm.description}
              onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of what this prompt does..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-amber-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Prompt Text * <span className="text-amber-500 ml-1 font-normal">Use [VARIABLE] for dynamic fields</span>
            </label>
            <textarea
              value={createForm.prompt_text}
              onChange={e => setCreateForm(p => ({ ...p, prompt_text: e.target.value }))}
              placeholder={`You are a [ROLE] expert. Write a [FORMAT] about [TOPIC] for [AUDIENCE]. \n\nUse [TONE] tone. Include [REQUIREMENTS]. Aim for [LENGTH].`}
              rows={6}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono leading-relaxed focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-2">
              {extractVariables(createForm.prompt_text).map(v => (
                <span key={v} className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-200 text-amber-600 font-mono">
                  {v}
                </span>
              ))}
            </div>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            >
              {creating ? <Loader size={13} className="animate-spin" /> : <Sparkles size={13} />}
              Create & Auto-Enrich
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
