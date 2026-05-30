"use client";

import { useState, useEffect } from "react";
import { GitBranch, X as XIcon, Link2, Cpu, Radio, Mail, Shield } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = {
  "Prompt Tools": [
    { label: "AI Generator", href: "/generator" },
    { label: "Templates DB", href: "/templates" },
    { label: "Prompt Examples", href: "/examples" },
    { label: "Community", href: "/community" },
    { label: "Changelog", href: "/changelog" },
  ],
  "Guides": [
    { label: "Prompt Engineering 101", href: "/guides/prompt-engineering-basics" },
    { label: "Midjourney v6 Art Rules", href: "/guides/midjourney-v6-rules" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Contact Support", href: "/contact" },
    { label: "Services", href: "https://revoxera.com/services" },
  ],
  "Legal": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const SOCIAL = [
  { icon: <XIcon className="w-4 h-4" />, href: "https://x.com/revoxera", label: "X (Twitter)" },
  { icon: <GitBranch className="w-4 h-4" />, href: "https://github.com/revoxera", label: "GitHub" },
  { icon: <Link2 className="w-4 h-4" />, href: "https://www.linkedin.com/in/revoxera-digital", label: "LinkedIn" },
];

export default function Footer() {
  const [logoImage, setLogoImage] = useState('/logo.png');
  const [logoText, setLogoText] = useState('REVOXERA');
  const [footerText, setFooterText] = useState('Precision-crafted developer tools designed to streamline your daily programming, formatting, and design workflows.');
  const [copyrightText, setCopyrightText] = useState(`© ${new Date().getFullYear()} Revoxera. Built for Developers & Creators.`);

  useEffect(() => {
    // Fetch site configurations
    import('../utils/clientApi').then(({ clientApi }) => {
      clientApi.fetchSettings().then(settings => {
        if (settings.site_logo_image) {
          const apiHost = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const fullUrl = settings.site_logo_image.startsWith('/') 
            ? `${apiHost}${settings.site_logo_image}`
            : settings.site_logo_image;
          setLogoImage(fullUrl);
        }
        if (settings.site_logo_text) {
          setLogoText(settings.site_logo_text);
        }
        if (settings.footer_description) {
          setFooterText(settings.footer_description);
        }
        if (settings.footer_copyright) {
          // Double-layer protection: if database seed returns old cyberpunk title, replace with professional copy
          const cleanCopyright = settings.footer_copyright.includes('Neural Architecture')
            ? `© ${new Date().getFullYear()} Revoxera. Built for Developers & Creators.`
            : settings.footer_copyright;
          setCopyrightText(cleanCopyright);
        }
      }).catch(err => console.error("Error setting custom configurations in Footer:", err));
    });
  }, []);

  return (
    <footer className="relative border-t border-white/5 pt-24 pb-12 px-6 bg-[#050508] overflow-hidden">
      {/* Background overlay grid pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-[0.015] pointer-events-none grid-bg"
      />
      {/* Radial overlay to blend background borders cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/95 via-transparent to-[#050508] pointer-events-none" />

      {/* Top glowing edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Dashboard / Console Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">

          {/* Col 1: Brand & Details (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0 bg-transparent">
                <img 
                  src={logoImage} 
                  alt={`${logoText} Logo`} 
                  className={`w-full h-full object-cover rounded-xl ${
                    logoImage === '/logo.png' 
                      ? 'invert dark:invert-0 hue-rotate-180 dark:hue-rotate-0 contrast-125 dark:contrast-100 saturate-150 dark:saturate-100'
                      : ''
                  }`} 
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-white font-mono">{logoText}</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm font-sans">
              {footerText}
            </p>

            {/* Contact cards */}
            <div className="space-y-2 mt-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 ml-1 font-mono">
                Get in touch
              </p>

              <a
                href="mailto:support@revoxera.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 px-3.5 py-3 transition-all duration-500 ease-out hover:translate-y-[-2px] hover:border-amber-500/20 hover:bg-white/4 hover:shadow-[0_8px_30px_rgba(245,158,11,0.04)]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 transition-all duration-500 group-hover:bg-amber-500/20">
                  <Mail size={13} className="text-amber-400" />
                </div>
                <div className="min-w-0 font-sans">
                  <p className="text-[13px] font-semibold leading-none text-white">support@revoxera.com</p>
                  <p className="mt-1 text-[11px] text-white/30 transition-colors group-hover:text-white/50">24/7 email support</p>
                </div>
              </a>
            </div>
          </div>

          {/* Col 3: Newsletter Section (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              Get Weekly Prompt Tips
            </div>
            <p className="text-xs text-white/40 leading-relaxed font-sans">
              Practical prompt engineering guides.
            </p>
            <div className="space-y-2 max-w-sm">
              <input
                type="email"
                placeholder="your-email@domain.com"
                className="w-full text-xs bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 font-sans"
                suppressHydrationWarning
              />
              <button
                className="w-full py-2.5 bg-[#0c0c14] text-white border border-white/10 rounded-xl text-xs font-bold hover:bg-[#161622] hover:border-amber-550/30 transition-all duration-200 cursor-pointer font-sans"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Middle Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4 font-sans">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-550 flex items-center gap-1.5 font-mono">
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-550 flex items-center gap-1.5 font-mono">
              <Radio className="w-3 h-3 text-amber-500/70" />
              Office
            </h4>
            <div className="flex items-start gap-2.5">
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30" suppressHydrationWarning>
            {copyrightText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Trusted AI Productivity Tools
            </span>

            <div className="flex items-center gap-2 text-[11px] font-medium text-white/20 font-sans">
              <Shield size={11} className="text-violet-400/30" />
              Secure payments
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
