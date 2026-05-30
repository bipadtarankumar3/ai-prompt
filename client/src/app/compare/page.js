'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowLeftRight, Copy, Check, Play, RefreshCw, 
  ChevronRight, ArrowLeft, Terminal, Sliders, Cpu, Brain
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHeader from '../components/SeoHeader';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { clientApi } from '../utils/clientApi';
import ReactMarkdown from 'react-markdown';

const TONES = ['Professional', 'Creative', 'Funny', 'Expert', 'Minimal'];
const STYLES = ['Markdown', 'BulletPoints', 'StepByStep', 'JSON'];
const CATEGORIES = ['ChatGPT', 'Claude', 'Gemini', 'Coding', 'SEO', 'Marketing', 'Business', 'Image', 'Video'];

export default function ComparePage() {
  const [userInput, setUserInput] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [loading, setLoading] = useState(false);
  const [activeModels, setActiveModels] = useState([]);

  // Config Side A
  const [modelA, setModelA] = useState(null);
  const [toneA, setToneA] = useState('Professional');
  const [styleA, setStyleA] = useState('Markdown');
  const [resultA, setResultA] = useState('');
  const [copiedA, setCopiedA] = useState(false);

  // Config Side B
  const [modelB, setModelB] = useState(null);
  const [toneB, setToneB] = useState('Creative');
  const [styleB, setStyleB] = useState('BulletPoints');
  const [resultB, setResultB] = useState('');
  const [copiedB, setCopiedB] = useState(false);

  useEffect(() => {
    async function loadModels() {
      try {
        const models = await clientApi.fetchActiveModels();
        setActiveModels(models);
        if (models.length > 0) {
          setModelA(models[0]);
          setModelB(models[1] || models[0]);
        }
      } catch (err) {
        console.error('Failed to load comparison models:', err);
      }
    }
    loadModels();
    
    // Log compare view in analytics
    clientApi.trackAnalyticsEvent('compare_view').catch(console.error);
  }, []);

  const handleCompare = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || !modelA || !modelB || loading) return;

    setLoading(true);
    setResultA('');
    setResultB('');

    try {
      // Trigger API generations in parallel
      const [resA, resB] = await Promise.all([
        clientApi.generatePrompt({
          userInput,
          category,
          tone: toneA,
          mode: 'generate',
          provider: modelA.provider,
          modelCode: modelA.api_model_code,
          length: 'Balanced',
          outputStyle: styleA
        }),
        clientApi.generatePrompt({
          userInput,
          category,
          tone: toneB,
          mode: 'generate',
          provider: modelB.provider,
          modelCode: modelB.api_model_code,
          length: 'Balanced',
          outputStyle: styleB
        })
      ]);

      setResultA(resA.result || resA);
      setResultB(resB.result || resB);
      
      toast.success('Prompt comparison complete! ✨');
      clientApi.trackAnalyticsEvent('run_compare', userInput.slice(0, 50)).catch(console.error);
    } catch (err) {
      toast.error(err.message || 'Comparison failed. Please verify API configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, side) => {
    await navigator.clipboard.writeText(text);
    if (side === 'A') {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    } else {
      setCopiedB(true);
      setTimeout(() => setCopiedB(false), 2000);
    }
    toast.success('Copied variation to clipboard!');
    clientApi.trackAnalyticsEvent('compare_copy', side).catch(console.error);
  };

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="compare" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 lg:px-8 xl:px-12 relative w-full overflow-hidden">
        <div className="absolute top-20 right-1/4 w-[450px] h-[350px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto relative space-y-12">
          {/* Back */}
          <Link
            href="/prompt-collections"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-500 dark:text-slate-900 dark:text-white/50 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/5 transition-all mb-4 cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Library
          </Link>

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto select-none">
            <span className="section-label mb-3">Optimization Studio</span>
            <h1 className="section-title mb-6 text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Prompt <span className="gradient-text">Comparison Engine</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-900 dark:text-white/50 leading-relaxed">
              Input a simple prompt concept. Configure different models, tones, and formatting requirements side-by-side to compare prompt engineering improvements instantly.
            </p>
          </div>

          {/* Input & Parameters Dashboard */}
          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleCompare} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-900 dark:text-white/40 uppercase tracking-widest block">Describe your Prompt Concept</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. A follow-up email marketing proposal for SaaS buyers..."
                  rows={3}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-900 dark:text-white/40 uppercase tracking-widest block">Main Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:border-white/15 text-slate-900 dark:text-white rounded-xl p-3 text-xs focus:border-amber-500 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Configurations Side A */}
                <div className="glass-card p-4 space-y-4 border border-slate-200 dark:border-white/5">
                  <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5"><Brain size={12} /> Config Variation A</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Model Selection</label>
                      <select
                        value={modelA?.id || ''}
                        onChange={(e) => setModelA(activeModels.find(m => m.id.toString() === e.target.value))}
                        className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                      >
                        {activeModels.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Tone</label>
                        <select
                          value={toneA}
                          onChange={(e) => setToneA(e.target.value)}
                          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                        >
                          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Style</label>
                        <select
                          value={styleA}
                          onChange={(e) => setStyleA(e.target.value)}
                          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                        >
                          {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configurations Side B */}
                <div className="glass-card p-4 space-y-4 border border-slate-200 dark:border-white/5">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5"><Brain size={12} /> Config Variation B</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Model Selection</label>
                      <select
                        value={modelB?.id || ''}
                        onChange={(e) => setModelB(activeModels.find(m => m.id.toString() === e.target.value))}
                        className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                      >
                        {activeModels.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Tone</label>
                        <select
                          value={toneB}
                          onChange={(e) => setToneB(e.target.value)}
                          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                        >
                          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/40 block mb-1">Style</label>
                        <select
                          value={styleB}
                          onChange={(e) => setStyleB(e.target.value)}
                          className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-lg p-2 text-xs outline-none cursor-pointer"
                        >
                          {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="flex items-center gap-2 btn-primary rounded-xl px-8 py-3.5 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-98 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Optimizing prompt variants...
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="currentColor" /> Run Side-by-Side Comparison
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Comparison View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Output Side A */}
            <div className="glass-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4 select-none">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1"><Cpu size={12} /> Variation A Output</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/30 font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded">
                    {modelA ? modelA.name : 'LLM A'}
                  </span>
                </div>

                <div className="relative mb-6">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-black/35 border border-slate-200 dark:border-white/5 border-b-0 rounded-t-xl font-mono text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/35 uppercase select-none">
                    <span>Generated Template</span>
                    <Terminal size={10} />
                  </div>
                  <div className="bg-slate-50 dark:bg-black/25 dark:bg-black/45 border border-slate-200 dark:border-white/5 rounded-b-xl p-5 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 select-all min-h-[220px] max-h-[350px] overflow-y-auto scrollbar-none">
                    {resultA ? (
                      <div className="markdown-body space-y-3">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-md font-bold mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-amber-500" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />
                          }}
                        >
                          {resultA}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-900 dark:text-white/20 italic">Output results for Config A will display here after comparison...</span>
                    )}
                  </div>
                </div>
              </div>

              {resultA && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 select-none">
                  <span className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/30 font-bold uppercase tracking-widest font-mono">
                    Tone: {toneA} · Style: {styleA}
                  </span>
                  
                  <button
                    onClick={() => handleCopy(resultA, 'A')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-white/10 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer transition-all active:scale-95"
                  >
                    {copiedA ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Output Side B */}
            <div className="glass-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4 select-none">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1"><Cpu size={12} /> Variation B Output</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/30 font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded">
                    {modelB ? modelB.name : 'LLM B'}
                  </span>
                </div>

                <div className="relative mb-6">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100 dark:bg-black/35 border border-slate-200 dark:border-white/5 border-b-0 rounded-t-xl font-mono text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/35 uppercase select-none">
                    <span>Generated Template</span>
                    <Terminal size={10} />
                  </div>
                  <div className="bg-slate-50 dark:bg-black/25 dark:bg-black/45 border border-slate-200 dark:border-white/5 rounded-b-xl p-5 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 select-all min-h-[220px] max-h-[350px] overflow-y-auto scrollbar-none">
                    {resultB ? (
                      <div className="markdown-body space-y-3">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-md font-bold mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-purple-400" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />
                          }}
                        >
                          {resultB}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-900 dark:text-white/20 italic">Output results for Config B will display here after comparison...</span>
                    )}
                  </div>
                </div>
              </div>

              {resultB && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5 select-none">
                  <span className="text-[9px] text-slate-500 dark:text-slate-900 dark:text-white/30 font-bold uppercase tracking-widest font-mono">
                    Tone: {toneB} · Style: {styleB}
                  </span>
                  
                  <button
                    onClick={() => handleCopy(resultB, 'B')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-white/10 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer transition-all active:scale-95"
                  >
                    {copiedB ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
