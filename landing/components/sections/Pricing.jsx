'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Check } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { pricing } from '../../lib/content';

const WaveGrid = dynamic(() => import('../3d/WaveGrid'), { ssr: false });

/**
 * Framer-inspired pricing layout: uniform cards, no lifted "featured" tier,
 * price + limit chip, checklist beneath, CTA at the bottom. Only the CTA
 * button colour differentiates the featured tier. Glow-border hover kept.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="snap-section relative">
      <div className="absolute inset-0 opacity-25">
        <WaveGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950 pointer-events-none" />

      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          subtitle={pricing.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {pricing.tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="glow-border relative rounded-2xl border border-white/10 bg-ink-950/90 p-7 md:p-8 flex flex-col"
            >
              {/* Name + pitch */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-xl text-white">{tier.name}</h3>
                  {tier.badge && (
                    <span className="text-[9px] font-bold tracking-wider text-brand-300 bg-brand-500/15 border border-brand-500/25 px-2 py-0.5 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/45 leading-snug">{tier.pitch}</p>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-4xl text-white">
                    ${tier.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-white/40">{tier.cadence}</span>
                </div>
              </div>

              {/* Limit chip */}
              <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-white/85 font-medium">{tier.limit}</p>
                <p className="text-xs text-white/40 mt-0.5">{tier.overage}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.slice(0, 8).map((feat, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-white/70">
                    {feat.startsWith('Everything in') ? (
                      <span className="text-brand-300 font-medium">{feat}</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-white/60 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{feat}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA at bottom */}
              <a
                href="https://frontend-pi-pearl-81.vercel.app/register"
                className={`block w-full text-center px-4 py-3 rounded-lg font-semibold text-sm transition-all mt-auto ${
                  tier.ctaVariant === 'primary'
                    ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/50'
                    : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'
                }`}
              >
                {tier.ctaLabel}
              </a>
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
