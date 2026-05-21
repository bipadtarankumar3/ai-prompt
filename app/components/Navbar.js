'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Moon, Sun, Menu, X } from 'lucide-react';
import Link from 'next/link';

const LINKS = [
  { label: 'Generator', href: '/generator' },
  { label: 'Templates', href: '/templates' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="PromptBeast Logo" 
            className="w-9 h-9 rounded-xl object-contain shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
          />
          <span className="font-bold text-xl text-white whitespace-nowrap" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
            Prompt<span className="gradient-text">Beast</span>
          </span>
        </Link>
 
        {/* Desktop nav */}
        <nav className="!hidden md:!flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.label} href={l.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </nav>
 
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {mounted && (
            <button
              id="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark'
                  ? <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Sun size={16} className="text-amber-400" />
                    </motion.div>
                  : <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Moon size={16} className="text-violet-400" />
                    </motion.div>
                }
              </AnimatePresence>
            </button>
          )}
 
          <Link href="/generator" id="navbar-cta"
            className="!hidden md:!inline-flex btn-primary px-5 py-2.5 text-sm rounded-xl">
            <Zap size={14} fill="currentColor" />
            Get Started
          </Link>
 
          <button onClick={() => setOpen(!open)} id="mobile-menu-btn"
            className="!flex md:!hidden w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/8 text-white/70 cursor-pointer">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden border-t border-slate-200/60 dark:border-white/6 bg-white dark:bg-[#08080f]/95 backdrop-blur-xl shadow-lg dark:shadow-none"
          >
            <div className="flex flex-col gap-1 p-4">
              {LINKS.map(l => (
                <Link key={l.label} href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-650 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                  {l.label}
                </Link>
              ))}
              <Link href="/generator" onClick={() => setOpen(false)}
                className="btn-primary mt-2 justify-center py-3 text-sm rounded-xl flex">
                <Zap size={14} fill="currentColor" />
                Start Generating Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

