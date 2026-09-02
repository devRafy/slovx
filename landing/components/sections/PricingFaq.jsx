'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { pricingFaq } from '../../lib/content';

/**
 * Pricing-specific FAQ — sits directly under the Pricing section.
 * Answers plan/billing/refund questions before users scroll to the general FAQ.
 * Mirrors the main Faq component's style so the two feel like a set.
 */
export default function PricingFaq() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="pricing-faq" className="snap-section relative">
      <div className="container-narrow relative z-10 max-w-3xl">
        <SectionHeader eyebrow={pricingFaq.eyebrow} title={pricingFaq.title} />

        <div className="space-y-2.5">
          {pricingFaq.items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`glow-border rounded-xl border backdrop-blur-md overflow-hidden transition-colors ${
                  isOpen
                    ? 'bg-brand-500/5 border-brand-500/30'
                    : 'bg-ink-800/60 border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
                >
                  <span className="font-medium text-sm md:text-base text-white pr-4">
                    {item.q}
                  </span>
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-colors ${
                      isOpen ? 'bg-brand-500/20 text-brand-300' : 'bg-white/5 text-white/60'
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-white/60 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
