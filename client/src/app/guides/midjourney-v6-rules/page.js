import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Midjourney v6 Art Prompting Rules & Parameters',
  description: 'Learn the strict syntax guidelines for Midjourney v6. Master text weight ratios, dynamic aspect ratios, style parameters, and how to write descriptive image prompts.',
  alternates: {
    canonical: 'https://aiprompt.revoxera.com/guides/midjourney-v6-rules',
  },
};

export default function MidjourneyGuide() {
  return (
    <main className="min-h-screen hero-bg text-slate-350 font-light leading-relaxed">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 px-4 container max-w-4xl mx-auto space-y-8 relative z-10">
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
              Art & Image Prompts
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-mono">
              Midjourney v6 Prompting Guide
            </h1>
            <div className="flex items-center gap-4 text-xs opacity-50 font-bold uppercase">
              <span className="flex items-center gap-1"><BookOpen size={14} /> 5 Min Read</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={14} /> Published 2026</span>
            </div>
          </header>

          <div className="glass-card p-8 md:p-12 border border-purple-500/10 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold uppercase text-amber-400">Midjourney v6 Key Upgrades</h2>
            <p>
              Midjourney version 6 features a much cleaner natural language processing engine. Unlike older versions (v4, v5) which relied heavily on lists of keywords like "photorealistic, 8k, Unreal Engine", v6 is designed to follow descriptive sentence structures and understands text prompts directly.
            </p>

            <h2 className="text-xl font-bold uppercase text-amber-400">Essential Parameters Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block font-mono">--ar [width]:[height]</strong>
                <p className="opacity-75 mt-1">Sets the target aspect ratio. Common settings include `--ar 16:9` for widescreen video or `--ar 4:5` for social portrait formats.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block font-mono">--stylize [0-1000]</strong>
                <p className="opacity-75 mt-1">Controls how strongly Midjourney applies its artistic aesthetic style. Defaults to 100.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block font-mono">--weird [0-3000]</strong>
                <p className="opacity-75 mt-1">Adds unique, quirky, and unconventional variations to your generated art outcomes.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block font-mono">--style raw</strong>
                <p className="opacity-75 mt-1">Reduces Midjourney's default branding bias, resulting in a more photographic, literal interpretation.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold uppercase text-amber-400">How to Write Text in Images</h2>
            <p>
              Midjourney v6 is the first version to support accurate text generation. Wrap your target text tokens in double quotes:
            </p>
            <pre className="bg-black/40 border border-white/10 p-5 rounded-3xl font-mono text-xs overflow-x-auto text-emerald-400">
{`/imagine prompt: A neon glowing billboard in a futuristic cyberpunk city with the text "REVOXERA" --ar 16:9 --style raw`}
            </pre>

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
