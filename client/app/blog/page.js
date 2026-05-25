'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowRight, User, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { clientApi } from '../utils/clientApi';
import SeoHeader from '../components/SeoHeader';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const blogs = await clientApi.fetchBlogs();
        setPosts(blogs);
      } catch (err) {
        console.error('Failed to load blog posts dynamically:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="blog" />
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

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Fetching articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-white/60">No articles published yet.</p>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
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
                    {post.image_url ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${post.image_url}`} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(245,158,11,0.1),transparent_40%)]" />
                        <BookOpen className="w-12 h-12 text-amber-500/40 group-hover:scale-110 group-hover:text-amber-400/60 transition-all duration-300" />
                      </>
                    )}
                  </div>

                  {/* Content body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                        {post.category}
                      </span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-xs text-white/35 font-medium">{post.read_time}</span>
                    </div>

                    <h2 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-amber-300 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-xs text-white/50 leading-relaxed mb-6 flex-1 line-clamp-3">
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
                      
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-200"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
