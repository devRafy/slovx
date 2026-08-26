'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Check, Sparkles } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { pricing } from '../../lib/content';

const WaveGrid = dynamic(() => import('../3d/WaveGrid'), { ssr: false });

export default function Pricing() {
  return (
    <section id="pricing" className="snap-section relative">
      <div className="absolute inset-0 opacity-30">
        <WaveGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950 pointer-events-none" />

      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          subtitle={pricing.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-4">
          {pricing.tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-7 backdrop-blur-md transition-all ${
                tier.featured
                  ? 'bg-gradient-to-b from-brand-500/10 to-brand-950/50 border-2 border-brand-500/40 lg:-translate-y-4 shadow-2xl shadow-brand-500/20'
                  : 'bg-ink-800/60 border border-white/5 hover:border-white/10'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 text-white text-[10px] font-bold tracking-widest shadow-lg shadow-brand-500/50">
                  <Sparkles className="w-3 h-3" />
                  {tier.badge}
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-display font-bold text-2xl text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-white/50 leading-snug">{tier.pitch}</p>
              </div>

              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-display font-bold text-4xl md:text-5xl text-white">${tier.price.toLocaleString()}</span>
                <span className="text-sm text-white/40">{tier.cadence}</span>
              </div>
              <p className="text-xs text-white/40 mb-5">
                {tier.limit} · {tier.overage}
              </p>

              <a
                href="https://frontend-pi-pearl-81.vercel.app/register"
                className={`block w-full text-center px-4 py-3 rounded-lg font-medium text-sm transition-all mb-6 ${
                  tier.ctaVariant === 'primary'
                    ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/50'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                {tier.ctaLabel}
              </a>

              <ul className="space-y-2.5">
                {tier.features.slice(0, 6).map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs md:text-sm text-white/70">
                    {feat.startsWith('Everything in') ? (
                      <span className="text-brand-400 font-semibold">{feat}</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          14-day free trial · No credit card · Cancel anytime
        </p>
      </div>
    </section>
  );
}
