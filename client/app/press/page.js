'use client';

import { motion } from 'framer-motion';
import { Download, FileText, BarChart3, Mail, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATS = [
  { label: 'Founded', value: '2026' },
  { label: 'Headquarters', value: 'San Francisco, CA' },
  { label: 'Active Users', value: '50,000+' },
  { label: 'Prompts Generated', value: '2M+' }
];

export default function PressPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="section-label mb-2">Media Kit</p>
            <h1 className="section-title mb-4">Press Resources</h1>
            <p className="text-sm text-muted max-w-xl mx-auto">
              Access the Revoxera AI brand assets, logos, factsheet, and contact info for media inquiries.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {STATS.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-5 text-center"
              >
                <span className="block text-2xl font-black text-white leading-tight mb-1" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  {s.value}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/35">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Press Releases / Kit */}
            <div className="glass-card p-6 md:p-8 space-y-6">
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                <FileText size={18} className="text-purple-400" />
                Brand Guidelines
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                Please use our official logo, icons, and colors. Do not stretch, crop, recolor, or modify our branding elements in any way.
              </p>
              <div className="border border-white/5 rounded-xl p-4 bg-white/2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">Revoxera AI Brand Kit</p>
                  <p className="text-[10px] text-white/30">SVG, PNG Logos & Guidelines (12MB)</p>
                </div>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 flex items-center justify-center text-purple-400 transition-all cursor-pointer"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Factsheet / Media contact */}
            <div className="glass-card p-6 md:p-8 space-y-6">
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                <Mail size={18} className="text-purple-400" />
                Media Contact
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                For interviews, comments, press requests, or media reviews, please email our communications team:
              </p>
              <div className="flex items-center gap-3.5 border border-white/5 rounded-xl p-4 bg-white/2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">Press Team</p>
                  <a href="mailto:press@revoxera.com" className="text-xs text-purple-400 hover:underline">
                    press@revoxera.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
