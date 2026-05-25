'use client';

import { Sparkles } from 'lucide-react';
import PromptHistory from './PromptHistory';

const MAX = 2000;

export default function PromptBox({
  input,
  setInput,
  mode,
  handleHistoryLoad,
}) {
  return (
    <div className="card flex flex-col h-full min-h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
            <Sparkles size={10} className="text-purple-400" />
          </div>
          <h2 className="text-xs font-bold text-white/70">
            {mode === 'generate' ? 'Your Idea / Prompt Core' : mode === 'improve' ? 'Prompt to Improve' : 'Prompt to Rewrite'}
          </h2>
        </div>
        <PromptHistory onLoad={handleHistoryLoad} />
      </div>

      {/* Body / Textarea workspace */}
      <div className="flex-1 p-4 relative flex flex-col">
        <textarea
          id="prompt-input"
          maxLength={MAX}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'generate'
              ? 'Describe your prompt idea in plain English... e.g., "A marketing email for launching a SaaS that automates social media posts. Make it punchy and target developers."'
              : mode === 'improve'
              ? 'Paste the existing prompt you want optimized here...'
              : 'Paste your prompt here to have the engine rewrite it in a different style...'
          }
          className="w-full flex-1 bg-transparent resize-none text-xs leading-relaxed text-white/85 placeholder-white/20 focus:outline-none font-mono"
          style={{ minHeight: 250 }}
        />
      </div>

      {/* Footer information */}
      <div className="border-t border-white/6 px-4 py-2.5 flex items-center justify-between">
        <span className="text-[10px] text-white/35">
          Type clean details for best generation output.
        </span>
        <span className={`text-[10px] font-mono tabular-nums ${input.length > MAX * 0.85 ? 'text-amber-400' : 'text-white/20'}`}>
          {input.length}/{MAX}
        </span>
      </div>
    </div>
  );
}
