'use client';

import { motion } from 'framer-motion';

/**
 * Shared top-of-page hero for inner pages (About, Architecture, Contact).
 * Not full-viewport like the landing hero — just an eyebrow + big title + subtitle.
 * Cinematic fade-in on mount.
 */
export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
      {/* Same radial glow as landing hero, positioned at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 30% at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />
      <div className="container-narrow relative z-10 max-w-3xl">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/60 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
