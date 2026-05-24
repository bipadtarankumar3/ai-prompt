'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: <Zap className="w-5 h-5" />,
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Revoxera AI',
    badge: null,
    gradient: 'from-slate-900/60 to-slate-950/60',
    borderColor: 'border-white/5 hover:border-white/15',
    iconBg: 'bg-white/5 text-white/60',
    features: [
      '50 AI generations/day',
      'Hugging Face models (free)',
      'All 8 categories',
      'Prompt history (last 20)',
      'Copy & download',
      '5 prompt templates',
    ],
    cta: 'Get Started Free',
    ctaHref: '/generator',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Crown className="w-5 h-5" />,
    price: '$12',
    period: '/month',
    description: 'For creators who need the best results',
    badge: '🔥 Most Popular',
    gradient: 'from-purple-950/40 to-indigo-950/40',
    borderColor: 'border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1)]',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white',
    features: [
      'Unlimited AI generations',
      'GPT-4o (OpenAI) access',
      'All AI models',
      'Unlimited prompt history',
      'Cloud sync & favorites',
      'All 50+ templates',
      'Priority support',
      'Token usage analytics',
    ],
    cta: 'Start Pro Trial',
    ctaHref: '/generator',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: <Building2 className="w-5 h-5" />,
    price: 'Custom',
    period: 'pricing',
    description: 'For teams and organizations at scale',
    badge: null,
    gradient: 'from-indigo-950/20 to-slate-950/40',
    borderColor: 'border-white/5 hover:border-white/15',
    iconBg: 'bg-white/5 text-white/60',
    features: [
      'Unlimited everything',
      'Custom AI models / BYOK',
      'Team workspace',
      'SSO / SAML',
      'SLA guarantee',
      'Custom integrations',
      'Dedicated account manager',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    ctaHref: 'mailto:sales@revoxera.ai',
    highlighted: false,
  },
];

export default function PricingCard() {
  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-purple mb-4">
              <Crown className="w-3.5 h-3.5" />
              Simple, Transparent Pricing
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display, sans-serif)' }}
          >
            Start Free, <span className="gradient-text">Scale Anytime</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-white/50 max-w-lg mx-auto"
          >
            No credit card required. Cancel anytime. All plans include our core prompt generation features.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-3xl border bg-gradient-to-br ${plan.gradient} ${plan.borderColor} ${
                plan.highlighted ? 'md:scale-[1.03] z-10' : 'z-0'
              } transition-all duration-300 backdrop-blur-xl group`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Plan header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                      {plan.name}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">{plan.description}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plan.iconBg}`}>
                    {plan.icon}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8 border-b border-white/5 pb-6">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/40 font-medium">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-4 h-4 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-amber-400" strokeWidth={3} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                id={`pricing-cta-${plan.id}`}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-[1.02]'
                    : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-white/30 mt-12 flex items-center justify-center gap-2"
        >
          <span>🔒 Secure payments via Stripe</span>
          <span>·</span>
          <span>Cancel anytime</span>
          <span>·</span>
          <span>14-day money-back guarantee</span>
        </motion.p>
      </div>
    </section>
  );
}
