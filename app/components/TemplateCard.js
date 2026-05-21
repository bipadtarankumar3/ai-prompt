'use client';

import { motion } from 'framer-motion';
import { Zap, Copy, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { TEMPLATES } from '../utils/templates';


function TemplateCard({ template, onUse }) {
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.prompt)
      .then(() => toast.success('Template copied!'))
      .catch(() => toast.error('Failed to copy'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onClick={() => onUse(template)}
      className={`flex flex-col gap-4 p-6 rounded-2xl border bg-gradient-to-br ${template.color} ${template.border} cursor-pointer group transition-all duration-300 backdrop-blur-md relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/10`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow-sm">{template.icon}</span>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${template.tagColor}`}>
              {template.category}
            </span>
            <h3 className="text-base font-bold text-white/90 mt-1.5 tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              {template.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed min-h-[32px]">{template.description}</p>

      {/* Prompt preview */}
      <div className="flex-1 bg-white/4 rounded-xl p-3.5 border border-white/5 relative group-hover:border-white/10 transition-colors">
        <p className="text-[11px] text-white/35 font-mono leading-relaxed line-clamp-3 select-none">
          {template.prompt}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-2">
        <button
          id={`template-use-${template.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md opacity-90 group-hover:opacity-100 transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); onUse(template); }}
        >
          <Zap className="w-3 h-3" fill="currentColor" />
          Use Template
        </button>
        <button
          id={`template-copy-${template.id}`}
          onClick={handleCopy}
          className="w-9.5 h-9.5 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all duration-200"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function TemplatesSection({ onUseTemplate }) {
  return (
    <section id="templates" className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(124,58,237,0.06),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-purple mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Ready-to-Use Templates
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display, sans-serif)' }}
          >
            Popular <span className="gradient-text">Prompt Templates</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-white/50 max-w-xl mx-auto"
          >
            Start instantly with our battle-tested prompt templates crafted by experts.
            Copy, customize, and supercharge your workflow.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={onUseTemplate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
