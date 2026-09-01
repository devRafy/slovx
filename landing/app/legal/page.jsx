'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ScrollText, Shield, ShieldCheck, Cookie } from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import FooterMini from '../../components/ui/FooterMini';

const CARDS = [
  {
    tag: 'T&C',
    icon: ScrollText,
    title: 'Terms & Conditions',
    body:  'Platform rules, billing boundaries, and the responsibilities of using an autonomous AI sales agent.',
    href:  '/legal/terms',
  },
  {
    tag: 'PRIVACY',
    icon: Shield,
    title: 'Privacy Policy',
    body:  "What data Xavier processes, how it's used, and the rights you and your leads have over it.",
    href:  '/legal/privacy',
  },
  {
    tag: 'SECURITY',
    icon: ShieldCheck,
    title: 'Trust & Security Center',
    body:  'Encryption, tenant isolation, AI output safeguards, and how we handle vulnerability reports.',
    href:  '/trust',
  },
  {
    tag: 'COOKIES',
    icon: Cookie,
    title: 'Website Tracking & Cookies',
    body:  'What SlovX.com tracks, why, and how to control it — separate from your Xavier conversations.',
    href:  '/legal/cookies',
  },
];

export default function LegalHubPage() {
  return (
    <main>
      <PageHero
        eyebrow="TRANSPARENCY BY DESIGN"
        title="Legal & Privacy Central"
        subtitle="Everything about how Xavier and SlovX handle your data, your rights, and your business — in plain language, no fine-print games."
      />

      <section className="container-narrow max-w-5xl py-12 md:py-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={card.href}
                  className="glow-border group block rounded-2xl border border-white/5 bg-ink-800/60 backdrop-blur-sm p-7 md:p-8 hover:border-brand-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono text-brand-400 tracking-widest">{card.tag}</span>
                    <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <p className="font-display font-bold text-white text-lg mb-2">{card.title}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{card.body}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Brand statement */}
      <section className="container-narrow max-w-4xl pb-28">
        <div className="border-t border-white/5 pt-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white leading-snug max-w-3xl mx-auto"
            style={{ textShadow: '0 0 40px rgba(99, 102, 241, 0.25)' }}
          >
            "We don't compromise on trust to move faster.
            <br />
            <span className="text-gradient">We move faster because we don't compromise."</span>
          </motion.p>
          <p className="font-mono text-xs text-white/30 tracking-widest mt-8">
            — SLOVX ENGINEERING PRINCIPLE
          </p>
        </div>
      </section>

      <FooterMini />
    </main>
  );
}
