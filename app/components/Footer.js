"use client";

import { useState, useEffect } from "react";
import { GitBranch, X as XIcon, Link2, PlaySquare, Cpu, Radio, Activity, Terminal, Mail, Phone, MapPin, Shield } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = {
  "Tools": [
    { label: "AI Prompt Generator", href: "https://tools.orbytara.com/ai-prompt" },
    { label: "SQL Formatter", href: "https://tools.orbytara.com/sql-formatter" },
    { label: "JSON Formatter", href: "https://tools.orbytara.com/json-formatter" },
    { label: "Color Code Tool", href: "https://tools.orbytara.com/color-code" },
    { label: "Case Converter", href: "https://tools.orbytara.com/case-converter" },
  ],
  "Company": [
    // { label: "Careers", href: "/careers" },
    // { label: "Our Blog", href: "/blog" },
    { label: "Affiliates", href: "#" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const SOCIAL = [
  { icon: <XIcon className="w-4 h-4" />, href: "#", label: "X (Twitter)" },
  { icon: <GitBranch className="w-4 h-4" />, href: "https://github.com", label: "GitHub" },
  { icon: <Link2 className="w-4 h-4" />, href: "#", label: "LinkedIn" },
  { icon: <PlaySquare className="w-4 h-4" />, href: "#", label: "YouTube" },
];

/* Clean SVG payment logos */
const PaymentLogo = ({ viewBox, path, width = 32 }) => (
  <svg
    width={width}
    height="20"
    viewBox={viewBox}
    fill="currentColor"
    className="text-white/20 transition-colors duration-500 hover:text-white/40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
);

const logos = {
  visa: { viewBox: "0 0 32 10", path: "M13.2 0l-2.1 9.9h3.3L16.5 0h-3.3z M22.7 0c-.8 0-2.1.2-3 .7l-.5 2.5c.3-.2.8-.3 1.3-.3 1 0 1.2.3 1.2.9 0 1.3-1.8 1.4-1.8 3 0 .7.6 1.3 1.6 1.3.8 0 1.6-.2 2.2-.5l.4-2c-.3.2-.9.4-1.4.4-.7 0-1-.3-1-1 0-1.1 1.8-1.5 1.8-3C23.5.7 23.3 0 22.7 0M10.1 0L6.7 6.8 5.4.9C5.2.3 4.8 0 4 0H0l.1.3c.8.2 1.6.5 2 1 l1.7 8.6h3.4l5.1-9.9h-2.1z M27.1 0h-2.6c-.6 0-1 .3-1.2.9L19.4 9.9h3.4l.7-1.9h4.1l.4 1.9h3L27.1 0z m-2.8 5.7l1.3-3.6h.1l.6 3.6h-2z" },
  mastercard: { viewBox: "0 0 32 20", path: "M10.7 10A6.3 6.3 0 0 1 13 4.9a6.6 6.6 0 0 0 0 10.2 6.3 6.3 0 0 1-2.3 5.1z M6.7 3.3a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4z M19.3 3.3a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4z" },
  paypal: { viewBox: "0 0 32 32", path: "M26.3 9.4c0-3.3-2.6-5.4-6.8-5.4H11.2c-.6 0-1 .4-1.1 1L7 26.6c0 .4.4.7.7.7h4.8l1-6.1c0-.4.5-.6.9-.6h2.8c4 0 7-1.8 8-5.3.4-1.3.5-2.5.5-3.6zM22.5 15c-.6 2.3-2.7 3.4-5.5 3.4h-2l-1.3 8H9l2-13h5.6c2.4 0 4.1.8 4.7 2.6.2.7.2 1.4.2 2.2z" },
  amex: { viewBox: "0 0 32 32", path: "M30.6 9.4H1.4C.6 9.4 0 10 0 10.8v10.4c0 .8.6 1.4 1.4 1.4h29.2c.8 0 1.4-.6 1.4-1.4V10.8c0-.8-.6-1.4-1.4-1.4zM7 19.3L5.4 15l-1.6 4.3H2L5.4 11h.1l3.5 8.3H7zm9.4 0L14.7 15v4.3h-1.6V11h2l1.3 3.8L17.7 11h2v8.3h-1.6v-4.3l-1.7 4.3zm6.6 0v-1.7h-2.5V16h2.3v-1.6h-2.3v-1.6h2.7v-1.7h-4.4v8.3h4.2zm6.2 0l-1.5-2.6-1.5 2.6h-1.9l2.4-4.2-2.3-4.1h2l1.4 2.6 1.4-2.6h1.9l-2.4 4.1 2.4 4.2h-1.9zM5.5 12.3L4.4 15h2l-1-2.7z" },
};

export default function Footer() {
  const [synapses, setSynapses] = useState(849204912);
  const [load, setLoad] = useState(42.8);
  const [activeNodes, setActiveNodes] = useState(14892);
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
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
    setConsoleOutput("Establishing link...");
    setTimeout(() => {
      setConsoleOutput("Mapping vector weights...");
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
        style={{ backgroundImage: "url('/ai_neural_footer.png')" }}
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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0 bg-transparent">
                <img src="/logo.png" alt="Revoxera Logo" className="w-full h-full object-cover invert dark:invert-0 hue-rotate-180 dark:hue-rotate-0 contrast-125 dark:contrast-100 saturate-150 dark:saturate-100 rounded-xl" />
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Precision-crafted developer tools designed to streamline your daily programming, formatting, and design workflows.
            </p>

            {/* Contact cards */}
            <div className="space-y-2 mt-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 ml-1">
                Get in touch
              </p>

              <a
                href="mailto:support@revoxera.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 px-3.5 py-3 transition-all duration-500 ease-out hover:translate-y-[-2px] hover:border-violet-500/20 hover:bg-white/4 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 transition-all duration-500 group-hover:bg-violet-500/20">
                  <Mail size={13} className="text-violet-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-none text-white">support@revoxera.com</p>
                  <p className="mt-1 text-[11px] text-white/30 transition-colors group-hover:text-white/50">24/7 email support</p>
                </div>
              </a>

              <a
                href="tel:+447858102081"
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 px-3.5 py-3 transition-all duration-500 ease-out hover:translate-y-[-2px] hover:border-cyan-400/20 hover:bg-white/4 hover:shadow-[0_8px_30px_rgba(6,182,212,0.06)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 transition-all duration-500 group-hover:bg-cyan-500/20">
                  <Phone size={13} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-none text-white">+44 7858 10 20 81</p>
                  <p className="mt-1 text-[11px] text-white/30 transition-colors group-hover:text-white/50">Mon – Fri, 9am – 6pm</p>
                </div>
              </a>
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
                  placeholder="Enter a prompt core... e.g. cyberpunk car"
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  className="w-full text-xs bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 font-mono"
                  suppressHydrationWarning
                />
              </div>
              <button
                type="submit"
                disabled={isSynthesizing}
                className="w-full py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
                suppressHydrationWarning
              >
                {isSynthesizing ? "Synthesizing..." : "Synthesize Vector"}
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
                placeholder="neural-address@domain.com"
                className="w-full text-xs bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50"
                suppressHydrationWarning
              />
              <button
                className="w-full py-2.5 bg-[#0c0c14] text-white border border-white/10 rounded-xl text-xs font-bold hover:bg-[#161622] transition-colors duration-200 cursor-pointer"
                suppressHydrationWarning
              >
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

          {/* Office Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-500/70" />
              Office
            </h4>
            <div className="flex items-start gap-2.5">
              {/* <MapPin size={13} className="mt-0.5 shrink-0 text-white/20" />
              <p className="text-xs leading-relaxed text-white/50">
                6A Hampstead High St
                <br />
                London, NW3 1PR
              </p> */}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30" suppressHydrationWarning>
            © {new Date().getFullYear()} Revoxera. Neural Architecture Sync v4.8.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>

            <div className="flex items-center gap-2 text-[11px] font-medium text-white/20">
              <Shield size={11} className="text-violet-400/30" />
              Secure payments
            </div>

            {/* SVG Payment Logos */}
            {/* <div className="flex items-center gap-3">
              <PaymentLogo viewBox={logos.visa.viewBox} path={logos.visa.path} width={34} />
              <PaymentLogo viewBox={logos.mastercard.viewBox} path={logos.mastercard.path} width={24} />
              <PaymentLogo viewBox={logos.paypal.viewBox} path={logos.paypal.path} width={36} />
              <PaymentLogo viewBox={logos.amex.viewBox} path={logos.amex.path} width={28} />
            </div> */}

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
