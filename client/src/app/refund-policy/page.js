'use client';

import { motion } from 'framer-motion';
import { CreditCard, Calendar, RefreshCw, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import SeoHeader from '../components/SeoHeader';
import Footer from '../components/Footer';

const REFUND_SECTIONS = [
  {
    title: '1. Money-Back Guarantee',
    icon: <Calendar className="w-5 h-5 text-purple-400" />,
    content: 'We offer a standard 14-day refund policy for all subscription tiers (Pro and Team) purchased via our platform. If you are not satisfied with Revoxera AI, you can request a full refund within 14 days of your initial purchase.'
  },
  {
    title: '2. Usage Conditions',
    icon: <CreditCard className="w-5 h-5 text-purple-400" />,
    content: 'To prevent abuse of our services, refunds are only eligible if your account has consumed fewer than 100 premium prompt generation tokens during the active billing period. Accounts with excessive API usage are not eligible for refunds.'
  },
  {
    title: '3. Processing Times',
    icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
    content: 'Once approved, refunds are processed automatically back to your original payment method. Depending on your financial institution, refunds may take between 5 to 10 business days to appear on your statement.'
  },
  {
    title: '4. Non-Refundable Items',
    icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
    content: 'Enterprise contracts, bespoke custom prompt engineering services, and bulk API credits packages are fully non-refundable. Monthly subscriptions are only refundable on the initial month of service.'
  }
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen hero-bg">
      <SeoHeader pageKey="refund-policy" />
      <Navbar />

      <section className="mt-16 md:mt-20 py-24 px-4 container relative">
        {/* Glow */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label mb-3"
            >
              Billing &amp; Payments
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title mb-6"
            >
              Refund Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed"
            >
              Last Updated: May 21, 2026. Review our rules regarding subscriptions, trials, and refund eligibility conditions.
            </motion.p>
          </div>

          {/* Main Content Card */}
          <div className="glass-card p-6 md:p-10 mb-12 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                Overview
              </h2>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Thank you for choosing Revoxera AI. We want to make sure you have the best possible experience generating and optimizing AI prompts. Because our platform provides instant access to premium prompt templates and real-time generation APIs, we enforce structured refund terms to protect our content and platform integrity.
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                If you believe you qualify for a refund, or have questions about a recent charge, please reach out to our billing support desk at <a href="mailto:billing@revoxera.ai" className="text-purple-400 hover:underline">billing@revoxera.ai</a> with your invoice ID.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* Grid of Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REFUND_SECTIONS.map((sec, idx) => (
                <div key={sec.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {sec.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-white/5" />

            <div>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                5. Subscription Cancellation
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                You may cancel your Revoxera AI subscription at any time directly through your billing portal settings. Upon cancellation, your account will remain active as a premium user until the end of your current billing period, after which it will downgrade to our free tier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
