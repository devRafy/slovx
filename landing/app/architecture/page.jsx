'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain, Shield, MessageSquare, Zap, Lock, Users,
  ArrowRight, ArrowDown, Bot, Cpu, Database, Cloud,
} from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import FooterMini from '../../components/ui/FooterMini';

const AGENTS = [
  {
    icon:  MessageSquare,
    name:  'Screening Agent',
    role:  'The first responder',
    body:  "Reads every incoming message. Detects language, sentiment, and intent in the first two exchanges. Decides whether it's a browser, a lead, or a hot buyer — and routes accordingly.",
  },
  {
    icon:  Brain,
    name:  'Closing Agent',
    role:  'The negotiator',
    body:  'Activates when the screener flags real buying intent. Handles pricing questions, objections, calendar booking. Trained on your product catalog + policies — never freelances.',
  },
  {
    icon:  Shield,
    name:  'Sentiment Audit Agent',
    role:  'The safety net',
    body:  'Runs in parallel to every conversation. Watches for frustration, complexity, or edge cases the closer might miss. Triggers human handoff before a deal goes cold.',
  },
];

const GUARDRAILS = [
  {
    icon: Lock,
    title: 'Locked pricing system',
    body:  'Xavier can only quote prices and terms you explicitly provided. If a customer asks about something outside the list, it says "let me confirm" — never guesses.',
  },
  {
    icon: Shield,
    title: 'Anti-hallucination scanner',
    body:  'Every outbound message is scanned against your source-of-truth data before it sends. Off-script replies are blocked and logged for review.',
  },
  {
    icon: Users,
    title: 'Human-in-the-loop handoff',
    body:  'When a conversation exceeds Xavier\'s capacity — legal, medical, custom terms — it pauses that chat, alerts your team, and hands off cleanly.',
  },
  {
    icon: Cloud,
    title: 'Meta-compliant by default',
    body:  '24-hour messaging window enforced automatically. STOP/opt-out compliance built-in. No risk of your WhatsApp number being flagged.',
  },
];

const TECH_STACK = [
  { icon: Brain,   label: 'Anthropic Claude',   role: 'Reasoning engine' },
  { icon: MessageSquare, label: 'Meta WhatsApp Cloud API', role: 'Official messaging channel' },
  { icon: Database, label: 'PostgreSQL + Prisma', role: 'Conversation + lead storage' },
  { icon: Lock,    label: 'AES-256 encryption', role: 'Token + credential vault' },
  { icon: Cloud,   label: 'Railway + Vercel',   role: 'Zero-downtime deploys' },
  { icon: Cpu,     label: 'Edge-cached FAQ',    role: 'Sub-second common answers' },
];

export default function ArchitecturePage() {
  return (
    <main>
      <PageHero
        eyebrow="ARCHITECTURE"
        title="Multi-agent AI. Locked to your data."
        subtitle="Not one chatbot pretending to be smart. Three specialized agents working in coordination — a screener, a closer, and a sentiment auditor — with hard guardrails on top."
      />

      {/* Agent triad */}
      <section className="container-narrow py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow">THE THREE AGENTS</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white">
            One conversation. Three brains behind it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-ink-800/50 border border-white/5 p-6 md:p-7 hover:border-brand-500/30 transition-colors backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-5">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-1">
                  {agent.role}
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-3">
                  {agent.name}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {agent.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Data flow */}
      <section className="container-narrow max-w-4xl py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow">DATA FLOW</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white">
            From WhatsApp to closed deal.
          </h2>
        </motion.div>

        <div className="space-y-6">
          {[
            { step: '01', title: 'Customer sends a WhatsApp message', body: 'Meta forwards the incoming message via webhook to Xavier — encrypted in transit, verified with signature.' },
            { step: '02', title: 'Screening agent classifies intent',   body: "In ~200ms, the screener detects language, sentiment, and buying-intent score. If it's just a browsing question, a scripted reply goes out. If it's a lead, it activates the closer." },
            { step: '03', title: 'Closer engages, guardrails scan',      body: 'The closer drafts a reply based on your locked product data + FAQs. Anti-hallucination scanner verifies against source-of-truth before sending.' },
            { step: '04', title: 'Sentiment audit runs in parallel',     body: "Watches every turn for signs the conversation is going sideways — frustrated tone, out-of-scope questions, edge cases." },
            { step: '05', title: 'Reply back on WhatsApp',                body: 'Message delivered through Meta Cloud API — appears in the customer\'s WhatsApp like any real conversation. Typing indicator, read receipts, everything native.' },
            { step: '06', title: 'Lead saved, dashboard updated',        body: 'Full conversation, sentiment score, buying-intent score, next best action — all in your dashboard within seconds. Ready for CRM sync (Enterprise).' },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 md:gap-6"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/30 font-display font-bold text-brand-300 text-sm">
                  {step.step}
                </div>
                {i < 5 && <div className="w-px flex-1 bg-white/10 mt-2" />}
              </div>
              <div className="pb-6">
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guardrails */}
      <section className="container-narrow py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow">GUARDRAILS</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white">
            What stops Xavier from going rogue.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {GUARDRAILS.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-ink-800/50 border border-white/5 p-6 md:p-7 hover:border-brand-500/30 transition-colors backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20">
                    <Icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {g.title}
                  </h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {g.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech stack */}
      <section className="container-narrow max-w-4xl py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow">UNDER THE HOOD</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white">
            The pieces that power it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {TECH_STACK.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-ink-800/40 border border-white/5 p-4 md:p-5 hover:border-brand-500/30 transition-colors"
              >
                <Icon className="w-5 h-5 text-brand-400 mb-3" />
                <div className="text-sm font-semibold text-white">{t.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{t.role}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow max-w-3xl py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white mb-4">
            See it live in 15 minutes.
          </h2>
          <p className="text-white/60 mb-8">
            No sales call, no setup fee. Just connect your WhatsApp Business number and watch it work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://frontend-pi-pearl-81.vercel.app/register"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/60"
            >
              Start free trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
            >
              See pricing
            </Link>
          </div>
        </motion.div>
      </section>

      <FooterMini />
    </main>
  );
}
