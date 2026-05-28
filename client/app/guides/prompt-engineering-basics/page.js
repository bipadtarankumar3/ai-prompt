import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Prompt Engineering 101: Guide to Writing Better Prompts',
  description: 'Master the fundamentals of prompt engineering. Learn how to structure instructions, define clear roles, inject constraints, and optimize responses from ChatGPT and Claude.',
  alternates: {
    canonical: 'https://aiprompt.revoxera.com/guides/prompt-engineering-basics',
  },
};

export default function PromptBasicsGuide() {
  return (
    <main className="min-h-screen hero-bg text-slate-350 font-light leading-relaxed">
      <Navbar />

      <section className="mt-16 md:mt-20 py-16 px-4 container max-w-4xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors uppercase group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Generator
        </Link>

        <article className="space-y-6">
          <header className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider border border-purple-500/20 bg-purple-500/5 text-purple-400 uppercase">
              AI Methodology
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-mono">
              Prompt Engineering Basics
            </h1>
            <div className="flex items-center gap-4 text-xs opacity-50 font-bold uppercase">
              <span className="flex items-center gap-1"><BookOpen size={14} /> 6 Min Read</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={14} /> Published 2026</span>
            </div>
          </header>

          <div className="glass-card p-8 md:p-12 border border-purple-500/10 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold uppercase text-amber-400">What is Prompt Engineering?</h2>
            <p>
              Prompt engineering is the process of structuring instruction tokens so they are interpreted accurately by Large Language Models (LLMs). Rather than asking simple questions, prompt engineering uses structured inputs to enforce target behaviors, roles, constraints, and formats.
            </p>

            <h2 className="text-xl font-bold uppercase text-amber-400">The 4 Components of a Great Prompt</h2>
            <ul className="list-disc list-inside space-y-3 pl-2 text-xs text-slate-400">
              <li><strong className="text-white">Role/Persona:</strong> Who is the AI? (e.g. "Act as a Senior Database Administrator").</li>
              <li><strong className="text-white">Context:</strong> What background info is relevant? (e.g. "I am designing a table for a high-traffic e-commerce system").</li>
              <li><strong className="text-white">Task:</strong> What do you need the AI to generate? (e.g. "Draft the SQL CREATE TABLE schema").</li>
              <li><strong className="text-white">Format & Constraints:</strong> How should the output look? (e.g. "Provide only SQL block, no intro, lowercase tables").</li>
            </ul>

            <h2 className="text-xl font-bold uppercase text-amber-400">Example Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-2xl bg-red-950/10 border border-red-500/20">
                <h3 className="text-red-400 font-bold uppercase mb-2">Vague Prompt (Poor Output)</h3>
                <p>"Write an article about database indexes."</p>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-500/20">
                <h3 className="text-emerald-400 font-bold uppercase mb-2">Engineered Prompt (Premium Output)</h3>
                <p>"Act as a database expert. Explain how B-Tree indexes work to a junior developer. Use a restaurant menu analogy, keep it under 300 words, and structure with markdown."</p>
              </div>
            </div>

            <div className="pt-6 border-t border-purple-500/10 flex flex-col items-center">
              <Link 
                href="/generator" 
                className="px-8 py-4 rounded-2xl bg-amber-500 text-black text-xs font-black tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 uppercase"
              >
                Launch Prompt Generator →
              </Link>
            </div>
          </div>
        </article>
      </section>

      <Footer />
    </main>
  );
}
