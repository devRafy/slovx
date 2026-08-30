'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Star, GitBranch, TrendingUp, Paintbrush, ShieldCheck,
  Cpu, Zap, Network, Webhook, Sheet, Calendar, MessageCircle, Mic, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  platformHero, platformTrusted, platformBadges, platformBoxes, platformStats,
  platformTestimonial, platformEnterprise, platformVerticals, platformPartners,
  platformSecurity, platformCta,
} from '../../lib/platformContent';

const ICONS = { GitBranch, TrendingUp, Paintbrush, ShieldCheck, Cpu, Zap, Network, Webhook, Sheet, Calendar, MessageCircle, Mic };

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─── Shared section wrapper ─────────────────────────────────────────────── */
function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  );
}

function Eyebrow({ text }) {
  return (
    <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full mb-4">
      {text}
    </span>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-ink-950 to-ink-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-24">
        <motion.div {...fade(0)}>
          <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-full mb-6">
            {platformHero.eyebrow}
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight text-white mb-6">
            {platformHero.headline}{' '}
            <span className="text-gradient">{platformHero.brand}</span>
          </h1>
          <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
            {platformHero.subhead}
          </p>
          <a
            href={platformHero.ctaHref}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50"
          >
            {platformHero.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Right column — decorative glow grid */}
        <motion.div {...fade(0.2)} className="hidden lg:flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-brand-700/10 rounded-3xl border border-brand-500/20 backdrop-blur-sm" />
            <div className="absolute inset-8 grid grid-cols-3 gap-3 opacity-60">
              {[GitBranch, ShieldCheck, Zap, TrendingUp, Cpu, Network, Webhook, Mic, MessageCircle].map((Icon, i) => (
                <div key={i} className="rounded-xl bg-brand-500/10 border border-brand-500/15 flex items-center justify-center p-3">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/40">
                  <Zap className="w-9 h-9 text-white" />
                </div>
                <p className="font-display font-bold text-white text-lg">slovX</p>
                <p className="text-white/50 text-xs mt-1">Revenue AI Engine</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Trusted By ─────────────────────────────────────────────────────────── */
function TrustedBy() {
  return (
    <Section className="py-12 md:py-16 border-b border-white/5">
      <motion.p {...fade(0)} className="text-center text-xs tracking-[0.3em] uppercase text-white/40 mb-8">
        {platformTrusted.label}
      </motion.p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div className="flex w-max animate-marquee gap-16 py-2">
          {[...platformTrusted.logos, ...platformTrusted.logos].map((logo, i) => (
            <span key={i} className="text-xl font-display font-bold text-white/25 hover:text-white/60 transition-colors whitespace-nowrap">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Badges ─────────────────────────────────────────────────────────────── */
function Badges() {
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
          {platformBadges.eyebrow}
        </h2>
        <p className="text-white/55 text-sm sm:text-base leading-relaxed">{platformBadges.subtitle}</p>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformBadges.items.map((b, i) => (
          <motion.div key={i} {...fade(0.1 + i * 0.08)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-ink-800/60 border border-white/5 hover:border-brand-500/30 transition-colors text-center"
          >
            <div className="flex gap-0.5 mb-1">
              {[...Array(b.stars)].map((_, s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="font-display font-bold text-white text-sm leading-tight">{b.label}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">{b.sub}</p>
            <span className="mt-1 text-[10px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
              {b.platform}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Platform 4 Boxes ───────────────────────────────────────────────────── */
function PlatformBoxes() {
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-14">
        <Eyebrow text={platformBoxes.eyebrow} />
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
          {platformBoxes.title}
        </h2>
      </motion.div>

      {/* 2×2 grid of platform boxes */}
      <div className="grid md:grid-cols-2 gap-5 mb-14">
        {platformBoxes.items.map((box, i) => {
          const Icon = ICONS[box.icon] ?? Zap;
          return (
            <motion.div key={i} {...fade(0.1 + i * 0.1)}
              className="rounded-2xl bg-ink-800/60 border border-white/5 p-7 hover:border-brand-500/25 transition-all"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base leading-tight">{box.title}</h3>
                  <p className="text-xs text-brand-400/80 mt-0.5">{box.subtitle}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {box.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3">
                    <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-white/60 leading-relaxed">
                      <strong className="text-white/85 font-medium">{b.label}: </strong>{b.body}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* 4 feature pills below */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformBoxes.features.map((f, i) => {
          const Icon = ICONS[f.icon] ?? Zap;
          return (
            <motion.div key={i} {...fade(0.35 + i * 0.08)}
              className="flex gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-brand-500/20 transition-colors"
            >
              <Icon className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white/90 leading-snug">{f.label}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <Section className="border-b border-white/5 bg-gradient-to-r from-brand-950/60 via-ink-950 to-brand-950/60">
      <motion.h2 {...fade(0)} className="font-display font-bold text-2xl sm:text-3xl text-white text-center mb-12">
        {platformStats.title}
      </motion.h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {platformStats.items.map((s, i) => (
          <motion.div key={i} {...fade(0.1 + i * 0.1)} className="text-center">
            <div className="font-display font-bold text-4xl sm:text-5xl text-gradient mb-2">{s.value}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─── Testimonial ────────────────────────────────────────────────────────── */
function Testimonial() {
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="max-w-3xl mx-auto text-center">
        <div className="flex gap-1 justify-center mb-6">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
        </div>
        <blockquote className="text-lg sm:text-xl text-white/80 leading-relaxed italic mb-8">
          {platformTestimonial.quote}
        </blockquote>
        <div>
          <p className="font-semibold text-white">{platformTestimonial.author}</p>
          <p className="text-sm text-white/45 mt-1">{platformTestimonial.role}</p>
        </div>
      </motion.div>
    </Section>
  );
}

/* ─── Enterprise ─────────────────────────────────────────────────────────── */
function Enterprise() {
  const [active, setActive] = useState(0);
  const tab = platformEnterprise.tabs[active];
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-14">
        <Eyebrow text={platformEnterprise.eyebrow} />
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
          {platformEnterprise.title}
        </h2>
      </motion.div>
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 lg:gap-10 items-start">
        {/* Left — tab list */}
        <div className="space-y-2">
          {platformEnterprise.tabs.map((t, i) => (
            <motion.button key={i} {...fade(0.05 + i * 0.06)}
              onClick={() => setActive(i)}
              className={`w-full text-left px-5 py-4 rounded-xl transition-all text-sm font-medium flex items-center justify-between gap-3 ${
                active === i
                  ? 'bg-brand-500/10 border border-brand-500/30 text-white'
                  : 'bg-ink-800/40 border border-white/5 text-white/55 hover:text-white/80 hover:border-white/10'
              }`}
            >
              {t.title}
              {active === i && <ArrowRight className="w-4 h-4 text-brand-400 shrink-0" />}
            </motion.button>
          ))}
        </div>
        {/* Right — detail */}
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-ink-800/60 border border-brand-500/20 p-7"
        >
          <h3 className="font-display font-bold text-xl text-white mb-6">{tab.title}</h3>
          <ul className="space-y-4">
            {tab.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-brand-400" />
                </div>
                <span className="text-white/70 text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Verticals ──────────────────────────────────────────────────────────── */
function Verticals() {
  const [active, setActive] = useState(0);
  const tab = platformVerticals.tabs[active];
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="text-center max-w-3xl mx-auto mb-12">
        <Eyebrow text={platformVerticals.eyebrow} />
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
          {platformVerticals.title}
        </h2>
      </motion.div>

      {/* Horizontal tab pills on mobile, left column on desktop */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {platformVerticals.tabs.map((t, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`shrink-0 lg:w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                active === i
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                  : 'text-white/50 hover:text-white/80 border border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl bg-ink-800/60 border border-white/5 p-6 md:p-8"
        >
          <h3 className="font-display font-bold text-xl text-white mb-6">
            {tab.label} — {tab.title}
          </h3>
          <div className="space-y-5">
            {tab.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3 h-3 text-brand-400" />
                </div>
                <div>
                  <p className="text-white/90 font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Partners ───────────────────────────────────────────────────────────── */
function Partners() {
  return (
    <Section className="border-b border-white/5">
      <motion.div {...fade(0)} className="text-center max-w-xl mx-auto mb-12">
        <Eyebrow text={platformPartners.eyebrow} />
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">{platformPartners.title}</h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {platformPartners.items.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Zap;
          return (
            <motion.div key={i} {...fade(0.1 + i * 0.1)}
              className="rounded-2xl bg-ink-800/60 border border-white/5 p-6 hover:border-brand-500/25 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 leading-snug">{p.name}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{p.body}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── Security FAQ ───────────────────────────────────────────────────────── */
function SecurityFaq() {
  const [open, setOpen] = useState(null);
  return (
    <Section className="border-b border-white/5">
      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16 items-start">
        <motion.div {...fade(0)}>
          <Eyebrow text={platformSecurity.eyebrow} />
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight mb-4">
            {platformSecurity.title}
          </h2>
          <p className="text-white/55 leading-relaxed">{platformSecurity.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            {['AES-256', 'SOC 2 Type II', 'GDPR', 'PII Masking', 'HITL Gating'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
        <div className="space-y-3">
          {platformSecurity.faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={i} {...fade(0.1 + i * 0.07)}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isOpen ? 'bg-brand-500/5 border-brand-500/30' : 'bg-ink-800/50 border-white/5 hover:border-white/10'
                }`}
              >
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white pr-2">{faq.q}</span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-brand-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{faq.a}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────────── */
function Cta() {
  return (
    <Section className="text-center">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent pointer-events-none" />
      <motion.div {...fade(0)} className="relative">
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
          {platformCta.title}
        </h2>
        <p className="text-white/50 mb-10 text-lg">No credit card required · 14-day free trial</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {platformCta.items.map((item, i) => (
            <a key={i} href={item.href}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all ${
                item.primary
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {item.label}
              {item.primary && <ArrowRight className="w-4 h-4" />}
            </a>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

/* ─── Page assembly ──────────────────────────────────────────────────────── */
export default function PlatformPage() {
  return (
    <main className="bg-ink-950 text-white">
      <Hero />
      <TrustedBy />
      <Badges />
      <PlatformBoxes />
      <Stats />
      <Testimonial />
      <Enterprise />
      <Verticals />
      <Partners />
      <SecurityFaq />
      <Cta />
    </main>
  );
}
