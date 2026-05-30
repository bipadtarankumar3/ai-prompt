'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Moon, Sun, Menu, X, Atom, Sparkles, LayoutGrid, Compass, CreditCard, ChevronRight, BookOpen, Lock, Info, FileText, User, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useBackground } from './BackgroundProvider';

const STATIC_LINKS = [
  { label: 'Generator', href: '/generator', icon: Sparkles },
  { label: 'Templates', href: '/templates', icon: BookOpen },
  { label: 'Examples', href: '/examples', icon: Terminal },
  { label: 'Collections', href: '/prompt-collections', icon: LayoutGrid },
  { label: 'Compare', href: '/compare', icon: Compass },
  { label: 'Blog', href: '/blog', icon: FileText },
];

const STATIC_MOBILE_LINKS = [
  { label: 'Generator', href: '/generator', icon: Sparkles, desc: 'AI-powered prompt creation', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/10' },
  { label: 'Templates', href: '/templates', icon: BookOpen, desc: 'Copy-ready prompt templates', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10 dark:bg-rose-500/10' },
  { label: 'Examples', href: '/examples', icon: Terminal, desc: 'Input/Output prompt examples', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/10' },
  { label: 'Prompt Collections', href: '/prompt-collections', icon: LayoutGrid, desc: 'Explore ready-to-use prompts', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/10' },
  { label: 'Compare Optimizer', href: '/compare', icon: Compass, desc: 'Side-by-side prompt tuning', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/10' },
  { label: 'Guides', href: '/guides/prompt-engineering-basics', icon: BookOpen, desc: 'Master prompt engineering principles', color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10 dark:bg-cyan-500/10' },
  { label: 'Blog', href: '/blog', icon: FileText, desc: 'Read articles and guides', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-500/10' },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { backgroundEffect, setBackgroundEffect } = useBackground();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pb_auth_token');
      setIsLoggedIn(!!token);
    }
  }, [pathname]);
  const [logoImage, setLogoImage] = useState('/logo.png');
  const [logoText, setLogoText] = useState('REVOXERA');

  const toggleBackground = () => {
    if (backgroundEffect === 'atom') {
      setBackgroundEffect('bubble');
    } else if (backgroundEffect === 'bubble') {
      setBackgroundEffect('none');
    } else {
      setBackgroundEffect('atom');
    }
  };

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);

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

        // Apply theme default if not already set by visitor manually
        const userSavedTheme = localStorage.getItem('prompt-beast-theme');
        if (!userSavedTheme && settings.default_theme_mode) {
          setTheme(settings.default_theme_mode);
        }
      }).catch(err => console.error("Error setting custom configurations in Navbar:", err));
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  const isActive = (href) => {
    if (href.startsWith('/#')) {
      const linkHash = href.split('#')[1];
      return pathname === '/' && hash === `#${linkHash}`;
    }
    return pathname === href;
  };

  const authLink = isLoggedIn
    ? { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid }
    : { label: 'Login', href: '/dashboard', icon: User };

  const finalLinks = [...STATIC_LINKS, authLink];

  const mobileAuthLink = isLoggedIn
    ? { label: 'Developer Dashboard', href: '/dashboard', icon: LayoutGrid, desc: 'Saved prompts & API keys', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/10' }
    : { label: 'Login Console', href: '/dashboard', icon: User, desc: 'Sign in to access tools', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/10' };

  const finalMobileLinks = [...STATIC_MOBILE_LINKS, mobileAuthLink];

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
            src={logoImage} 
            alt={`${logoText} Logo`} 
            className={`w-10 h-10 rounded-xl object-contain shadow-lg group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
              logoImage === '/logo.png' 
                ? 'invert dark:invert-0 hue-rotate-180 dark:hue-rotate-0 contrast-125 dark:contrast-100 saturate-150 dark:saturate-100'
                : ''
            }`}
          />
          <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white font-mono">{logoText}</span>
        </Link>
 
        {/* Desktop nav */}
        <nav className="!hidden lg:!flex items-center gap-0.5">
          {finalLinks.map(l => {
            const active = isActive(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={`px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                {l.label}
              </Link>
            );
          })}
        </nav>
 
        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {mounted && (
            <>
              {/* Background Animation Toggle */}
              <button
                id="bg-effect-toggle"
                onClick={toggleBackground}
                aria-label={`Toggle background animation. Current: ${backgroundEffect}`}
                title={`Background effect: ${backgroundEffect}`}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all cursor-pointer"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {backgroundEffect === 'atom' && (
                    <motion.div key="atom" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Atom size={16} className="text-amber-400" />
                    </motion.div>
                  )}
                  {backgroundEffect === 'bubble' && (
                    <motion.div key="bubble" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Sparkles size={16} className="text-orange-400" />
                    </motion.div>
                  )}
                  {backgroundEffect === 'none' && (
                    <motion.div key="none" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Zap size={16} className="text-slate-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Theme Toggle */}
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
            </>
          )}
 
          <Link href="/generator" id="navbar-cta"
            className="!hidden lg:!inline-flex btn-primary px-4 py-2 text-[13px] rounded-xl">
            <Zap size={14} fill="currentColor" />
            Get Started
          </Link>
 
          <button onClick={() => setOpen(!open)} id="mobile-menu-btn"
            className="!flex lg:!hidden w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/8 text-white/70 cursor-pointer">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="lg:hidden fixed inset-0 top-[64px] bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute top-[72px] left-4 right-4 z-50 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0c0c14]/95 backdrop-blur-xl shadow-2xl p-3.5 flex flex-col gap-1"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.02,
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1"
            >
              {finalMobileLinks.map(l => {
                const active = isActive(l.href);
                return (
                  <motion.div
                    key={l.label}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 border border-transparent ${
                        active
                          ? 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${l.bg}`}>
                        <l.icon size={18} className={l.color} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                          {l.label}
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {l.desc}
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
                className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5"
              >
                <Link
                  href="/generator"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full justify-center py-3 text-sm rounded-xl flex shadow-lg shadow-orange-500/20"
                >
                  <Zap size={14} fill="currentColor" />
                  Start Generating Free
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

