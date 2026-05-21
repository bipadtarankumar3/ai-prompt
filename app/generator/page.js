'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { TEMPLATES } from '../utils/templates';

// Components
import Navbar from '../components/Navbar';
import PromptBox from '../components/PromptBox';
import OutputBox from '../components/OutputBox';
import PromptHistory from '../components/PromptHistory';
import Footer from '../components/Footer';
import RefinePanel from '../components/RefinePanel';
import toast from 'react-hot-toast';

function GeneratorSection() {
  const searchParams = useSearchParams();
  const [initialPrompt, setInitialPrompt] = useState('');
  const [result, setResult]         = useState('');
  const [loading, setLoading]       = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [provider, setProvider]     = useState('openai');
  const [model, setModel]           = useState('');

  // Refinement states
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [chatHistory, setChatHistory]   = useState([]);
  const [refineLoading, setRefineLoading] = useState(false);
  const [category, setCategory]         = useState('ChatGPT');
  const [tone, setTone]                 = useState('Professional');
  const [hfModel, setHfModel]           = useState('Qwen/Qwen2.5-7B-Instruct');

  useEffect(() => {
    const templateId = searchParams.get('template');
    const promptText = searchParams.get('prompt');

    if (templateId) {
      const template = TEMPLATES.find(t => t.id.toString() === templateId);
      if (template) {
        setInitialPrompt(template.prompt);
      }
    } else if (promptText) {
      setInitialPrompt(promptText);
    }
  }, [searchParams]);

  // Sync initial generated result with refinement chat starting message
  useEffect(() => {
    if (result && !refineLoading) {
      setChatHistory([
        { role: 'assistant', content: result }
      ]);
    }
  }, [result]);

  const handleResult = (text, tokens, prov, mod, cat, tne, hfm) => {
    setResult(text);
    setTokensUsed(tokens);
    setProvider(prov || 'openai');
    setModel(mod || '');
    if (cat) setCategory(cat);
    if (tne) setTone(tne);
    if (hfm) setHfModel(hfm);
  };

  const handleHistoryLoad = (entry) => {
    setInitialPrompt(entry.userInput || '');
    setResult(entry.result);
    setTokensUsed(entry.tokensUsed || 0);
    setProvider(entry.provider || 'openai');
    setModel('');
    if (entry.category) setCategory(entry.category);
    if (entry.tone) setTone(entry.tone);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || refineLoading) return;

    const newUserMsg = { role: 'user', content: text };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setRefineLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          category,
          tone,
          mode: 'generate',
          provider,
          hfModel,
          chatHistory: chatHistory // Send user-turn chat history
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Refinement failed');

      const newAiMsg = { role: 'assistant', content: data.result };
      setChatHistory(prev => [...prev, newAiMsg]);

      setResult(data.result);
      setTokensUsed(data.tokensUsed);
      setProvider(data.provider);
      setModel(data.model);

      toast.success('Prompt refined! ✨');
    } catch (err) {
      toast.error(err.message || 'Failed to refine prompt');
      setChatHistory(chatHistory); // Rollback user message on failure
    } finally {
      setRefineLoading(false);
    }
  };

  const handleApplyPrompt = (appliedPrompt) => {
    setResult(appliedPrompt);
  };

  return (
    <section id="generator" className="py-20 px-4 relative min-h-screen">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative pt-10">
        {/* Compact top bar */}
        <div className="flex items-center gap-2 mb-6">
          <Zap size={15} className="text-purple-400 shrink-0" />
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">AI Prompt Generator</span>
          <span className="hidden sm:inline text-white/15 mx-1">·</span>
          <span className="hidden sm:inline text-xs text-white/30">GPT-4o &amp; open-source models</span>
        </div>

        {/* Generator layout — 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left — Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-3 md:p-4 relative z-20"
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <h3 className="text-sm font-semibold text-white/70">Configure Your Prompt</h3>
              </div>
              <PromptHistory onLoad={handleHistoryLoad} />
            </div>
            <PromptBox initialPrompt={initialPrompt} onResult={handleResult} onLoading={setLoading} />
          </motion.div>

          {/* Right — Output */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <OutputBox
              result={result}
              loading={loading}
              tokensUsed={tokensUsed}
              provider={provider}
              model={model}
              onRefine={() => setIsRefineOpen(true)}
            />
          </motion.div>
        </div>

        {/* Trending prompts row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap size={10} className="text-purple-400" />
            Trending Ideas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Write a Twitter thread about AI trends',
              'Create a Midjourney portrait of a cyberpunk city',
              'Explain blockchain to a 5-year-old',
              'Marketing email for a SaaS product launch',
              'Debug this React useEffect hook',
              'YouTube video on passive income strategies',
              'SEO meta description for an e-commerce site',
              'Business pitch for a sustainable startup',
            ].map((idea) => (
              <button
                key={idea}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/8 text-white/45 hover:text-white hover:border-purple-500/30 hover:bg-purple-600/10 transition-all duration-200"
                onClick={() => {
                  // Populate the textarea with this idea
                  const textarea = document.getElementById('prompt-input');
                  if (textarea) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLTextAreaElement.prototype, 'value'
                    )?.set;
                    nativeInputValueSetter?.call(textarea, idea);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.focus();
                    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                {idea}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <RefinePanel
        isOpen={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        loading={refineLoading}
        onApplyPrompt={handleApplyPrompt}
      />
    </section>
  );
}

export default function GeneratorPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center hero-bg">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-white/40 text-sm font-semibold tracking-wide">Loading workspace...</p>
          </div>
        </div>
      }>
        <GeneratorSection />
      </Suspense>
      <Footer />
    </main>
  );
}
