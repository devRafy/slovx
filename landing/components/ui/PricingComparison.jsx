'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { pricingComparison } from '../../lib/content';

/**
 * Side-by-side feature matrix for the /pricing page.
 * Grouped by category with a subtle header row per section.
 * Horizontally scrollable on mobile, uses brand-themed check / muted-dash
 * markers instead of green/red.
 */
export default function PricingComparison() {
  const { eyebrow, title, tiers, categories } = pricingComparison;

  return (
    <section className="container-narrow max-w-5xl py-20 md:py-24 border-t border-white/5">
      <div className="text-center mb-12">
        <span className="inline-block text-[11px] font-mono tracking-[0.25em] uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full mb-4">
          {eyebrow}
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
          {title}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-950/60 backdrop-blur-sm"
      >
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-ink-900/60">
              <th className="py-4 px-5 text-left text-white/45 font-mono font-normal text-xs tracking-wider">
                FEATURE
              </th>
              {tiers.map((tier, i) => (
                <th
                  key={i}
                  className={`py-4 px-5 text-center font-mono font-normal text-xs tracking-wider whitespace-pre-line ${
                    tier.accent === 'featured' ? 'text-brand-300' : 'text-white/70'
                  }`}
                >
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <Fragment key={cat.name}>
                {/* Category header row */}
                <tr className="border-t border-white/5 bg-ink-900/40">
                  <td colSpan={4} className="py-2.5 px-5 text-[10px] font-mono text-white/40 tracking-widest">
                    {cat.name}
                  </td>
                </tr>
                {/* Feature rows */}
                {cat.rows.map((row) => (
                  <tr key={row.feature} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-5 text-white/80">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-3 px-5 text-center">
                        {v
                          ? <Check className="inline w-4 h-4 text-brand-400" strokeWidth={2.5} />
                          : <Minus className="inline w-4 h-4 text-white/20" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>

      <p className="text-center text-xs text-white/40 mt-6">
        <Check className="inline w-3 h-3 text-brand-400 -mt-0.5" strokeWidth={2.5} /> Included
        <span className="mx-3 text-white/20">·</span>
        <Minus className="inline w-3 h-3 text-white/30 -mt-0.5" /> Not included at this tier
      </p>
    </section>
  );
}
