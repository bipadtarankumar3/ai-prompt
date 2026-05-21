'use client';

import { GitBranch, X as XIcon, Link2, PlaySquare } from 'lucide-react';
import Link from 'next/link';

const FOOTER_LINKS = {
  Product: [
    { label: 'Generator', href: '/generator' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-reference' },
    { label: 'Blog', href: '/blog' },
    { label: 'Community', href: '/community' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
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
  return (
    <footer className="relative border-t border-white/5 pt-20 pb-10 px-6 bg-black/20 backdrop-blur-md">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <img 
                src="/logo.png" 
                alt="PromptBeast Logo" 
                className="w-9 h-9 rounded-xl object-contain group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300"
              />
              <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                Prompt Beast
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
              The world&apos;s most powerful AI prompt generator. Craft perfect prompts for ChatGPT,
              Midjourney, and every AI tool you love.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all duration-350"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-purple-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-10" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Prompt Beast. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <p className="text-xs text-white/20">
              Built with ❤️ using Next.js &amp; AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

