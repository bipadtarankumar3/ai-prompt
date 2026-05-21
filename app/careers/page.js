'use client';

import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JOBS = [
  {
    title: 'Senior AI Research Engineer',
    dept: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    description: 'Lead the design of our structured prompt compiler algorithms, optimizing interactions with OpenAI, Anthropic, and open-source LLMs.',
    salary: '$160k - $210k · Equity'
  },
  {
    title: 'Frontend Engineer - React/Next.js',
    dept: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    description: 'Own user-facing workspaces. Build high-fidelity editors, client-side caching structures, and interactive animation states.',
    salary: '$120k - $165k · Equity'
  },
  {
    title: 'Developer Relations Advocate (AI)',
    dept: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Grow our developer community. Author high-quality prompting guides, build API code templates, and speak at dev conferences.',
    salary: '$110k - $150k · Equity'
  }
];

export default function CareersPage() {
  return (
    <main className="min-h-screen hero-bg">
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 right-10 w-[500px] h-[300px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="section-label mb-2">Join the Team</p>
            <h1 className="section-title mb-4">Work with Us</h1>
            <p className="text-sm text-muted max-w-xl mx-auto">
              Help us define the future of human-AI interfaces. We are always looking for passionate creators, builders, and engineers.
            </p>
          </div>

          {/* Intro text */}
          <div className="glass-card p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white mb-1.5" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                Why Prompt Beast?
              </h2>
              <p className="text-xs text-white/50 leading-relaxed">
                We are a lean, product-focused team of builders. We value design-first product design, fast release cycles, open communication, and high autonomy. Our team receives comprehensive healthcare, home-office stipends, learning budgets, and flexible vacation time.
              </p>
            </div>
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 px-2 mb-4">Open Positions</h3>
            
            {JOBS.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="glass-card p-6 hover:border-purple-500/30 transition-all duration-300 card-hover group flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/10 bg-purple-500/5">
                      {job.dept}
                    </span>
                    <span className="text-xs text-white/30 flex items-center gap-1">
                      <MapPin size={12} className="text-purple-400" />
                      {job.location}
                    </span>
                    <span className="text-xs text-white/30 flex items-center gap-1">
                      <Clock size={12} className="text-purple-400" />
                      {job.type}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {job.title}
                  </h4>

                  <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end gap-4 min-w-[150px] border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                  <span className="text-xs font-bold text-white/70 font-mono">{job.salary}</span>
                  <a
                    href="mailto:careers@promptbeast.com"
                    className="btn-secondary w-full md:w-auto text-xs py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5"
                  >
                    Apply Now
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
