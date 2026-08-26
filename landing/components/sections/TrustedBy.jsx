'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { trustedBy } from '../../lib/content';

const FloatingShapes = dynamic(() => import('../3d/FloatingShapes'), { ssr: false });

/**
 * Full-viewport "trusted by" — big number stat + logo marquee.
 * Feels weighty rather than a thin band.
 */
export default function TrustedBy() {
  return (
    <section className="snap-section relative">
      <div className="absolute inset-0 opacity-40">
        <FloatingShapes />
      </div>

      <div className="container-narrow relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm text-white/40 tracking-[0.3em] uppercase font-medium mb-6"
          >
            {trustedBy.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold leading-none mb-16"
          >
            <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient">
              1.2M+
            </div>
            <div className="mt-4 text-lg sm:text-xl md:text-2xl text-white/60 font-normal">
              customer conversations handled — and counting.
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div
          className="relative overflow-hidden mt-8"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          <div className="flex w-max animate-marquee gap-16 py-2">
            {[...trustedBy.logos, ...trustedBy.logos].map((logo, i) => (
              <div
                key={i}
                className="text-xl md:text-2xl font-display font-bold tracking-tight text-white/30 hover:text-white/70 transition-colors whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
