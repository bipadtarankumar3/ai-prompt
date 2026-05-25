'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, User, Clock, Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { clientApi } from '../../utils/clientApi';

export default function BlogPostView() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    async function loadPost() {
      try {
        const blog = await clientApi.fetchBlogBySlug(slug);
        setPost(blog);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Revoxera AI Blog`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt || post.title);
      }
    }
  }, [post]);

  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative">
          {/* Back button */}
          <button
            onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all mb-8 cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Blog
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-sm text-white/50">Loading article content...</p>
            </div>
          ) : error || !post ? (
            <div className="text-center py-20 glass-card">
              <BookOpen className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
              <p className="text-sm text-white/70 font-semibold">{error || 'Article not found.'}</p>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-6 md:p-12 relative overflow-hidden glow-purple-strong"
            >
              {/* Background gradient subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-transparent to-transparent pointer-events-none" />

              {/* Category & Read Time */}
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                  {post.category}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-xs text-white/40 font-medium flex items-center gap-1">
                  <Clock size={12} /> {post.read_time}
                </span>
              </div>

              {post.image_url && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-white/5 relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${post.image_url}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h1 
                className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight relative z-10" 
                style={{ fontFamily: 'var(--font-display, sans-serif)' }}
              >
                {post.title}
              </h1>

              {/* Author Metadata */}
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <User size={14} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white/70">{post.author}</div>
                  <div className="text-[10px] text-white/40">Published on {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/70 whitespace-pre-line relative z-10">
                {post.content}
              </div>
            </motion.article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
