'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { MessageSquare, Brain, Target } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { howItWorks } from '../../lib/content';

const WaveGrid = dynamic(() => import('../3d/WaveGrid'), { ssr: false });

const ICONS = [MessageSquare, Brain, Target];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const lineProgress = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  return (
    <section id="how" ref={ref} className="snap-section relative">
      <div className="absolute inset-0 opacity-50">
        <WaveGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950 pointer-events-none" />

      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          subtitle={howItWorks.subtitle}
        />

        <div className="relative mt-12 md:mt-16">
          {/* Timeline connector */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-white/10" aria-hidden />
          <motion.div
            className="hidden md:block absolute top-10 left-[10%] h-px bg-gradient-to-r from-brand-500 to-brand-400"
            style={{
              width: useTransform(lineProgress, (v) => `${v * 80}%`),
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            }}
            aria-hidden
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {howItWorks.steps.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-ink-800 border border-brand-500/30 mb-6 glow-ring backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-brand-400" />
                    <span className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold shadow-lg shadow-brand-500/30">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-xs mx-auto">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
