'use client';

import { motion } from 'framer-motion';

/**
 * Shared header block: eyebrow + title + subtitle.
 * On scroll into view, elements rise from BELOW with a slow staggered cascade
 * (eyebrow → title → subtitle, each with a delay).
 */
export default function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignCls} mb-12 md:mb-16`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
