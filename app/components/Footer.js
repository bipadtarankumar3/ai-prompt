'use client';

import { useState, useEffect } from 'react';
import { GitBranch, X as XIcon, Link2, PlaySquare, Cpu, Radio, Activity, Terminal } from 'lucide-react';
import Link from 'next/link';

const FOOTER_LINKS = {
  'Neural Nodes': [
    { label: 'Generator', href: '/generator' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Services', href: 'https://tools.orbytara.com/services' },
  ],
  'Brainwaves': [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-reference' },
    { label: 'Blog', href: '/blog' },
    { label: 'Community', href: '/community' },
  ],
  'Synapses': [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
  'Protocols': [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ],
};

const SOCIAL = [
  { icon: <XIcon className="w-4 h-4" />, href: '#', label: 'X (Twitter)' },
  { icon: <GitBranch className="w-4 h-4" />, href: 'https://github.com', label: 'GitHub' },
  { icon: <Link2 className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
  { icon: <PlaySquare className="w-4 h-4" />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [synapses, setSynapses] = useState(849204912);
  const [load, setLoad] = useState(42.8);
  const [activeNodes, setActiveNodes] = useState(14892);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSynapses(prev => prev + Math.floor(Math.random() * 4) + 1);
      setLoad(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
      setActiveNodes(prev => prev + Math.floor(Math.random() * 5 - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSynthesize = (e) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    setIsSynthesizing(true);
    setConsoleOutput('Establishing link...');
    setTimeout(() => {
      setConsoleOutput('Mapping vector weights...');
      setTimeout(() => {
        setConsoleOutput(`Optimized Prompt: "${consoleInput.trim()} detailed, cinematic lighting, ultra-realistic, 8k resolution"`);
        setIsSynthesizing(false);
      }, 1000);
    }, 800);
  };

  return (
    <footer className="relative border-t border-white/5 pt-24 pb-12 px-6 bg-[#050508] overflow-hidden">
      {/* Neural Background overlay image (highly toned down dark watermark style) */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: `url('/ai_neural_footer.png')` }}
      />
      {/* Radial overlay to blend background borders cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/95 via-transparent to-[#050508] pointer-events-none" />
      
      {/* Top glowing edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Futuristic Dashboard / Console Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Col 1: Brand & Live System Status (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="PromptBeast Logo" 
                className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 invert dark:invert-0 hue-rotate-180 dark:hue-rotate-0 contrast-125 dark:contrast-100 saturate-150 dark:saturate-100"
              />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              An advanced prompt engineering engine synthesizing high-fidelity outputs for LLMs, Midjourney, and generative neural architectures.
            </p>

            {/* Live Stats Panel */}
            <div className="border border-white/[0.06] bg-[#0c0c14]/90 rounded-2xl p-5 shadow-lg shadow-black/25">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-amber-500">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Live Synthesizer Core Stats
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Synapses Generated</span>
                  <div className="text-sm font-mono font-bold text-white tracking-wider">
                    {synapses.toLocaleString('en-US')}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Gen Speed</span>
                  <div className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
                    {load} prompts/s
                  </div>
                </div>
                <div className="space-y-1 col-span-2 border-t border-white/5 pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Active Synthesizer Nodes</span>
                  <div className="text-xs font-mono font-semibold text-amber-400">
                    {activeNodes.toLocaleString('en-US')} online
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Neural Quick Console Sandbox (4 cols) */}
          <div className="lg:col-span-4 border border-white/[0.06] bg-[#0c0c14]/90 rounded-2xl p-5 shadow-lg shadow-black/25">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-amber-500">
              <Terminal className="w-3.5 h-3.5" />
              Quick Prompt Synthesizer
            </div>
            <form onSubmit={handleSynthesize} className="space-y-3">
              <div className="relative">
                <input 
                  type="text"
                  suppressHydrationWarning
                  placeholder="Enter a prompt core... e.g. cyberpunk car"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  className="w-full text-xs bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
              <button
                type="submit"
                suppressHydrationWarning
                disabled={isSynthesizing}
                className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 disabled:opacity-50"
              >
                {isSynthesizing ? 'Synthesizing...' : 'Synthesize Vector'}
              </button>
            </form>
            {consoleOutput && (
              <div className="mt-3 p-3 bg-black/80 rounded-lg border border-white/5 font-mono text-[10px] text-amber-300 break-words leading-relaxed">
                <div className="text-white/30 mb-1">&gt; OUTPUT RESPONSE:</div>
                {consoleOutput}
              </div>
            )}
          </div>

          {/* Col 3: Hivemind Sync (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
              <Cpu className="w-3.5 h-3.5" />
              Sync with Hivemind
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Connect to our weekly neural newsletter for top performing prompt sequences, tokens, and model configurations.
            </p>
            <div className="space-y-2">
              <input 
                type="email" 
                suppressHydrationWarning 
                placeholder="neural-address@domain.com"
                className="w-full text-xs bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50"
              />
              <button suppressHydrationWarning className="w-full py-2.5 bg-[#0c0c14] text-white border border-white/10 rounded-xl text-xs font-bold hover:bg-[#161622] transition-colors duration-200">
                Establish Protocol Sync
              </button>
            </div>
          </div>

        </div>

        {/* Middle Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-amber-500/70" />
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/50 hover:text-amber-400 transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Prompt Beast. Neural Architecture Sync v4.8.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-amber-500/30 transition-all duration-350"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
