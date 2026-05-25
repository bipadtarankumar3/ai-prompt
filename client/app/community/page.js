'use client';

import { motion } from 'framer-motion';
import { MessageSquare, GitBranch, Share2, Heart, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import Footer from '../components/Footer';

const CHANNELS = [
  {
    title: 'Discord Server',
    icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
    description: 'Join over 10,000+ AI enthusiasts and prompt engineers. Share your creations, get feedback, and join weekly prompt challenges.',
    action: 'Join Chat',
    href: '#',
    badge: 'Active'
  },
  {
    title: 'GitHub Community',
    icon: <GitBranch className="w-5 h-5 text-purple-400" />,
    description: 'Submit bug reports, request new templates, propose features, or contribute to our shared prompt utilities library.',
    action: 'View Source',
    href: 'https://github.com',
    badge: 'Open Source'
  },
  {
    title: 'Twitter / X discussions',
    icon: <Share2 className="w-5 h-5 text-purple-400" />,
    description: 'Follow our official handle for release announcements, prompt tips, AI industry highlights, and showcase highlights.',
    action: 'Follow Us',
    href: '#',
    badge: 'Updates'
  }
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="community" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 left-10 w-[500px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Get Involved
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Join the Revoxera AI Community
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-xl mx-auto leading-relaxed"
            >
              Connect with fellow prompt engineers, developers, and creators pushing the boundaries of generative AI.
            </motion.p>
          </div>

          {/* Social Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {CHANNELS.map((ch, index) => (
              <motion.div
                key={ch.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 md:p-8 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      {ch.icon}
                    </div>
                    <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/5">
                      {ch.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {ch.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {ch.description}
                  </p>
                </div>
                <a
                  href={ch.href}
                  className="btn-secondary w-full justify-center text-xs py-2.5 rounded-xl mt-6 font-semibold"
                >
                  {ch.action}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Code of Conduct */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 border border-purple-500/10"
          >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
              <Shield size={18} className="text-purple-400" />
              Community Guidelines & Code of Conduct
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Heart size={14} className="text-purple-400" />
                  Be Respectful
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Support others, offer constructive feedback, and treat all community members with kindness and patience.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Share2 size={14} className="text-purple-400" />
                  Share Openly
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  We believe in sharing knowledge. Publish your successful prompt templates and formulas so others can learn from them.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Shield size={14} className="text-purple-400" />
                  Protect Privacy
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Do not share confidential keys, private tokens, or proprietary database schema details inside public forums.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
