'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent! We will get back to you soon.');
    }, 1200);
  };

  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 left-10 w-[500px] h-[300px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="section-label mb-2">Get in Touch</p>
            <h1 className="section-title mb-4">Contact Us</h1>
            <p className="text-sm text-muted max-w-xl mx-auto">
              Have questions about pricing, API access, templates, or just want to say hi? Send us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Info panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 md:p-8 space-y-6">
                <h2 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                  Support Channels
                </h2>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Email Support</h3>
                    <p className="text-xs text-white/50 mt-0.5 mb-1">Response time within 24 hours</p>
                    <a href="mailto:support@promptbeast.com" className="text-xs text-purple-400 hover:underline">
                      support@promptbeast.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Discord Community</h3>
                    <p className="text-xs text-white/50 mt-0.5 mb-1">Instant chat and community support</p>
                    <a href="/community" className="text-xs text-purple-400 hover:underline">
                      Join community server
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Office</h3>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
                      Prompt Beast Inc.<br />
                      100 Pine Street, Suite 1250<br />
                      San Francisco, CA 94111
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="lg:col-span-7">
              <div className="glass-card p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Thank You!</h2>
                      <p className="text-xs text-white/50 mt-1 max-w-sm leading-relaxed">
                        Your message has been safely received. A support representative will get back to you shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-secondary text-xs px-4 py-2 rounded-xl mt-4 cursor-pointer"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="contact-name" className="text-xs font-bold text-white/35 uppercase tracking-wider block mb-2">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="text-xs font-bold text-white/35 uppercase tracking-wider block mb-2">
                        Your Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="text-xs font-bold text-white/35 uppercase tracking-wider block mb-2">
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Tell us what you need help with..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="input text-sm leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center py-3.5 text-sm rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
