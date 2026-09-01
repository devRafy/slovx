'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  ShieldCheck, Braces, ScrollText, BadgeCheck, Scale, EyeOff, Lock, ArrowRight,
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { security } from '../../lib/content';

const WaveGrid = dynamic(() => import('../3d/WaveGrid'), { ssr: false });

const ICONS = { ShieldCheck, Braces, ScrollText, BadgeCheck, Scale, EyeOff, Lock };

export default function Security() {
  return (
    <section id="security" className="snap-section relative">
      <div className="absolute inset-0 opacity-25">
        <WaveGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950 pointer-events-none" />

      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow={security.eyebrow}
          title={security.title}
          subtitle={security.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {security.items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? ShieldCheck;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.35 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glow-border group relative rounded-2xl bg-ink-800/60 border border-white/5 p-5 md:p-6 backdrop-blur-md transition-all hover:border-brand-500/30 hover:bg-ink-800/80"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-base md:text-lg text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 md:mt-12 text-center"
        >
          <a
            href={security.cta.href}
            className="group inline-flex items-center gap-2 text-sm md:text-base text-brand-300 hover:text-brand-200 font-medium transition-colors"
          >
            {security.cta.label} to view complete architecture details
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
