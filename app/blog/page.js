'use client';

import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Mastering Midjourney v6: The Ultimate Prompting Guide',
    excerpt: 'Unlock the full power of Midjourney v6 with parameters, camera specifications, structural weight, and style modifiers.',
    category: 'Design',
    categoryColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    date: 'May 15, 2026',
    author: 'Sarah Chen',
    readTime: '6 min read'
  },
  {
    id: 2,
    title: 'How to Write AI Prompts That Rank #1 on Google',
    excerpt: 'Discover the prompt structures behind writing SEO-optimized blogs, headings hierarchy, meta tags, and structured formats.',
    category: 'SEO & Content',
    categoryColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    date: 'May 10, 2026',
    author: 'Alex Carter',
    readTime: '5 min read'
  },
  {
    id: 3,
    title: 'The Rise of Open-Source LLMs: Qwen vs. Mistral',
    excerpt: 'An in-depth benchmark comparison of open-source models, highlighting their instruction-following strengths and performance tags.',
    category: 'Engineering',
    categoryColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    date: 'May 1, 2026',
    author: 'David Vance',
    readTime: '8 min read'
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Ambient glow */}
        <div className="absolute top-40 right-10 w-[450px] h-[300px] rounded-full bg-amber-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Resources & Insights
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              The Revoxera AI Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-muted max-w-xl mx-auto leading-relaxed"
            >
              Expert tips, advanced prompting frameworks, and industry guides written to supercharge your generative AI workflows.
            </motion.p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card flex flex-col h-full hover:border-amber-500/30 transition-all duration-300 card-hover group"
              >
                {/* Visual placeholder header */}
                <div className="h-44 w-full bg-gradient-to-br from-amber-950/40 to-orange-950/20 border-b border-white/5 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(245,158,11,0.1),transparent_40%)]" />
                  <BookOpen className="w-12 h-12 text-amber-500/40 group-hover:scale-110 group-hover:text-amber-400/60 transition-all duration-300" />
                </div>

                {/* Content body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-xs text-white/35 font-medium">{post.readTime}</span>
                  </div>

                  <h2 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-amber-300 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-xs text-white/50 leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Footer metadata */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs">
                        <User size={10} className="text-amber-400" />
                      </div>
                      <span className="text-xs font-semibold text-white/60">{post.author}</span>
                    </div>
                    
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-200">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
