'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight, PlayCircle, ArrowDown } from 'lucide-react';
import { hero } from '../../lib/content';
import VideoModal from '../ui/VideoModal';

const NeuralMesh = dynamic(() => import('../3d/NeuralMesh'), { ssr: false });
const HeroRobot  = dynamic(() => import('../HeroRobot'),      { ssr: false });

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="snap-section relative">
      {/* Subtle particle backdrop — dimmed so it doesn't compete with the robot */}
      <div className="absolute inset-0 opacity-30">
        <NeuralMesh />
      </div>

      {/* Radial glow — vertical center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-ink-950 pointer-events-none z-[1]" />

      <div className="container-narrow relative z-10 pt-20 md:pt-0">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* ─── LEFT COLUMN: Content ─────────────────────────── */}
          {/* Hero content drops in from the TOP with a slow staggered cascade.
             Each element starts ~40-60px above its final position and eases down. */}
          <div className="text-center lg:text-left">
            {/* Eyebrow — drops in first */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-sm mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-brand-200">{hero.eyebrow}</span>
            </motion.div>

            {/* Headline — line 1 then line 2, dropping down */}
            <h1 className="font-display font-bold leading-[0.95] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block text-white whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
              >
                {hero.headlineLine1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient whitespace-nowrap text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem]"
              >
                {hero.headlineLine2}
              </motion.span>
            </h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 md:mt-8 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-white/60 leading-relaxed"
            >
              {hero.subhead}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <a
                href="https://frontend-pi-pearl-81.vercel.app/register"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/60"
              >
                {hero.ctaPrimary}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all backdrop-blur-sm"
              >
                <PlayCircle className="w-4 h-4" />
                {hero.ctaSecondary}
              </button>
            </motion.div>

            {/* Stats row — comes last, cascade continues */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 md:mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
            >
              {[hero.stat1, hero.stat2, hero.stat3].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="font-display font-bold text-2xl md:text-3xl text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN: 3D robot that tracks the cursor ────── */}
          <div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full hidden lg:block"
            aria-hidden
          >
            <div className="absolute inset-8 blur-3xl bg-gradient-to-br from-brand-500/30 to-brand-700/20 rounded-full" />
            <HeroRobot />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src="/agent-demo.mp4"
      />
    </section>
  );
}
