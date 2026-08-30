'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Globe, ShieldCheck, DatabaseZap, Languages,
  ChevronDown, ChevronUp, Check, ArrowRight,
} from 'lucide-react';
import { servicesHero, services } from '../../lib/servicesContent';

const ICONS = { Rocket, Globe, ShieldCheck, DatabaseZap, Languages };

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─── Service Card ───────────────────────────────────────────────────────── */
function ServiceCard({ svc, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[svc.icon] ?? Rocket;

  return (
    <motion.article
      {...fade(0.1 + index * 0.08)}
      className={`relative rounded-2xl border bg-gradient-to-br ${svc.accent} ${svc.border}
        backdrop-blur-md overflow-hidden flex flex-col transition-all duration-300
        hover:shadow-lg hover:shadow-brand-500/10`}
    >
      {/* Glass sheen */}
      <div className="absolute inset-0 bg-ink-800/50 pointer-events-none" />

      <div className="relative p-6 md:p-7 flex flex-col gap-4 flex-1">
        {/* Tag + icon row */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
            {svc.tag}
          </span>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-brand-300" />
          </div>
        </div>

        {/* Title + sub */}
        <div>
          <h2 className="font-display font-bold text-white text-lg md:text-xl leading-tight mb-2">
            {svc.title}
          </h2>
          <p className="text-sm text-brand-300/90 leading-snug font-medium">{svc.sub}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">{svc.description}</p>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors mt-auto pt-2"
        >
          {expanded ? 'Show less' : 'Pain points & outcomes'}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Expandable detail */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-5 border-t border-white/8">
                {/* Pain points */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-3">
                    Client Pain Points Solved
                  </p>
                  <ul className="space-y-2.5">
                    {svc.painPoints.map((p, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                        <span className="text-white/65 leading-relaxed">
                          <strong className="text-white/85 font-semibold">{p.label}: </strong>
                          {p.body}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes */}
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-3">
                    Service Outcomes
                  </p>
                  <ul className="space-y-2.5">
                    {svc.outcomes.map((o, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                        <span className="text-white/65 leading-relaxed">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-white">
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/70 via-ink-950 to-ink-950 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.span {...fade(0)}
            className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full mb-6"
          >
            {servicesHero.eyebrow}
          </motion.span>
          <motion.h1 {...fade(0.1)}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight mb-6"
          >
            {servicesHero.title}
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-lg text-white/55 leading-relaxed max-w-xl mx-auto mb-10">
            {servicesHero.subtitle}
          </motion.p>
          <motion.a {...fade(0.3)}
            href="https://frontend-pi-pearl-81.vercel.app/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </section>

      {/* 2×2 grid + 5th card centered */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          {/* First 4 in 2×2 */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {services.slice(0, 4).map((svc, i) => (
              <ServiceCard key={svc.tag} svc={svc} index={i} />
            ))}
          </div>
          {/* 5th card — full width but max-width capped so it reads like a feature highlight */}
          <div className="max-w-2xl mx-auto">
            <ServiceCard svc={services[4]} index={4} />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto px-6">
          <motion.h2 {...fade(0)}
            className="font-display font-bold text-3xl sm:text-4xl text-white mb-4"
          >
            Ready to automate your pipeline?
          </motion.h2>
          <motion.p {...fade(0.1)} className="text-white/50 mb-8 leading-relaxed">
            14-day free trial · No credit card · Cancel anytime
          </motion.p>
          <motion.div {...fade(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://frontend-pi-pearl-81.vercel.app/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50"
            >
              Start free trial <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all"
            >
              Talk to sales
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
