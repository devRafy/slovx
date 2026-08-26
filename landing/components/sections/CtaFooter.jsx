'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowRight, Zap } from 'lucide-react';
import { cta, footer } from '../../lib/content';

const Globe = dynamic(() => import('../3d/Globe'), { ssr: false });

export default function CtaFooter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      const url = `https://frontend-pi-pearl-81.vercel.app/register?email=${encodeURIComponent(email.trim())}`;
      window.location.href = url;
    }
  };

  return (
    <>
      {/* Final CTA — full-viewport snap section */}
      <section className="snap-section relative">
        <div className="absolute inset-0 opacity-60">
          <Globe />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 60%)',
          }}
        />

        <div className="container-narrow relative z-10 text-center max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow"
          >
            {cta.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            {cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed"
          >
            {cta.subtitle}
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder={cta.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 backdrop-blur-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/60"
            >
              {cta.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
          <p className="mt-4 text-xs text-white/40">{cta.smallPrint}</p>
        </div>
      </section>

      {/* Footer — NOT a snap section (short + always visible below the last snap) */}
      <footer className="relative border-t border-white/5 bg-ink-950/80 backdrop-blur-sm">
        <div className="container-narrow py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">Xavier</span>
              </a>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                {footer.tagline}
              </p>
            </div>
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">{footer.copyright}</p>
            <p className="text-xs text-white/40">
              Built with <span className="text-brand-400">Xavier</span> · Powered by Meta Cloud API
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
