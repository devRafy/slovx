'use client';

import { motion } from 'framer-motion';
import { Lock, Shield, BadgeCheck, Brain, Eye, Radio, ArrowRight } from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import FooterMini from '../../components/ui/FooterMini';

const HERO_TAGS = [
  { icon: Lock,       label: 'ENCRYPTION'  },
  { icon: Shield,     label: 'ISOLATION'   },
  { icon: BadgeCheck, label: 'COMPLIANCE'  },
];

const SECTIONS = [
  {
    icon: Brain,
    title: '1. Cognitive AI & Prompt Defense Layers',
    intro: 'Standard systems secure the database. SlovX structurally hardens the AI’s core cognitive reasoning layer.',
    items: [
      { label: 'Dual-Intent Interception Firewall',      body: 'Pre-execution screening layer blocks jailbreaks, prompt exfiltration, and malicious hacks before they touch the core brain.' },
      { label: 'Structural XML Input Isolation',          body: 'Advanced encapsulation architecture wraps inbound text to completely disable indirect prompt engineering exploits.' },
      { label: 'Deterministic ReAct Reasoning',           body: 'Enforced sequential routing loops (Thought → Action → Observation) completely eliminate pricing and policy hallucinations.' },
      { label: 'Strict Corporate Dictionary Validation',  body: 'Core prompts enforce validation to stop the agent from inventing unauthorized metrics outside your exact corporate data layer.' },
    ],
  },
  {
    icon: Lock,
    title: '2. Data Encryption & Privacy Protection',
    intro: 'Absolute confidentiality for your data assets at rest and in motion.',
    items: [
      { label: 'Data In-Transit',           body: 'All network requests and inbound Meta webhooks enforce strict TLS 1.3 verification protocols over secure HTTPS endpoints.' },
      { label: 'Data At-Rest Cryptography', body: 'All internal PostgreSQL tables containing customer logs or transactional histories are encrypted natively using robust AES-256 algorithms.' },
      { label: 'Asynchronous PII Masking',  body: 'Downstream logs pass through an integrated Microsoft Presidio analyzer to systematically scrub sensitive customer identifiers after response dispatch.' },
      { label: 'Paddle.com Merchant Security', body: 'SlovX does not directly store or process card details. Payments are handled by Paddle.com Market Limited (our Merchant of Record), which maintains independent PCI-DSS compliance for all payment processing.' },
    ],
  },
  {
    icon: Shield,
    title: '3. Tenant Isolation & Access Controls',
    intro: 'Granular boundaries to ensure your workspace remains completely private.',
    items: [
      { label: 'Multi-Tenant Workspace Isolation', body: 'System architectures logically separate business data by tenant identifiers at the database layer.' },
      { label: 'Row-Level Tenant Verification',     body: 'Access-control checks are enforced server-side on every request to ensure brand boundaries cannot be crossed.' },
      { label: 'Multi-User Enterprise RBAC Gating', body: 'Configure strict role-based access tokens to limit administrative actions like pausing automations or exporting lead metrics.' },
    ],
  },
  {
    icon: BadgeCheck,
    title: '4. Platform Compliance & Automation',
    intro: 'Built-in alignment with regional regulations and Meta platform guidelines.',
    items: [
      { label: 'California SB 1001 Disclosure Filter', body: 'Smart bot-identity transparency loops ensure compliance with automated commercial disclosure laws to avoid multi-million dollar penalties.' },
      { label: 'GDPR Guardrails',                       body: 'Built-in policy controls ensure data processing activities respect international user privacy mandates.' },
      { label: 'WhatsApp Regulatory Windows',           body: 'Automated logic monitors timeframe metrics to handle 24-hour communication timeouts and switch to custom Meta templates seamlessly.' },
      { label: 'Opt-out ("STOP") Interception',         body: 'Continuous text validation triggers flag sessions to block further automated messages the moment "STOP" or "UNSUBSCRIBE" is detected.' },
    ],
  },
  {
    icon: Radio,
    title: '5. Telemetry, Monitoring & Governance',
    intro: 'Deep operational visibility to track runtime performance and guarantee zero logic loops.',
    items: [
      { label: 'LLMOps Deep Tracing',             body: 'Connected Langfuse/Arize Phoenix telemetry engine maps every interaction sequence into an interactive relational tree graph layout.' },
      { label: 'Zero-Error Runtime Fallbacks',     body: 'Deterministic try-except error handling blocks wrap all database and network boundaries to trigger high-confidence fallback states safely.' },
      { label: 'Human-in-the-Loop Handover (HITL)', body: 'Specific text strings instantly trip safety flags to freeze automated generation and open direct operator intercom lines.' },
      { label: 'Sub-Processors & Infrastructure',  body: 'SlovX relies on vetted, top-tier cloud hosting and AI model sub-processors. A current infrastructure list is available upon request.' },
    ],
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function TrustPage() {
  return (
    <main>
      <PageHero
        eyebrow="TRUST & SECURITY CENTER"
        title="How Xavier is built to be trusted with your business."
        subtitle="This Trust & Security Center describes the technical and operational safeguards built into the SlovX platform — at the level of practice, not as an unconditional guarantee."
      />

      {/* 3 hero tag boxes */}
      <section className="container-narrow max-w-5xl py-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {HERO_TAGS.map(({ icon: Icon, label }, i) => (
            <motion.div key={label} {...fade(0.1 + i * 0.08)}
              className="glow-border flex items-center gap-3 rounded-2xl border border-white/5 bg-ink-800/60 backdrop-blur-sm p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <span className="font-mono text-sm tracking-widest text-white">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sections */}
      <section className="container-narrow max-w-4xl py-8 md:py-12 space-y-12 md:space-y-16">
        {SECTIONS.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.div key={sec.title} {...fade(0.1 + i * 0.05)}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-brand-400" />
                </div>
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">{sec.title}</h2>
              </div>
              <p className="text-white/55 mb-6 md:pl-12">{sec.intro}</p>
              <div className="space-y-3 md:pl-12">
                {sec.items.map((it) => (
                  <div key={it.label}
                    className="glow-border rounded-xl border border-white/5 bg-ink-800/50 backdrop-blur-sm p-5"
                  >
                    <p className="text-sm md:text-base text-white font-semibold mb-1.5">{it.label}</p>
                    <p className="text-sm text-white/60 leading-relaxed">{it.body}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Responsible Disclosure */}
      <section className="container-narrow max-w-4xl py-12">
        <motion.div {...fade(0)}
          className="glow-border rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-brand-950/40 p-7 md:p-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-brand-300" />
            <h2 className="font-display font-bold text-xl text-white">Responsible Disclosure</h2>
          </div>
          <p className="text-white/70 leading-relaxed mb-4">
            If you believe you have discovered a security vulnerability in the SlovX platform, please report it to our
            security engineering desk immediately at{' '}
            <a href="mailto:security@slovx.com" className="text-brand-300 hover:text-brand-200 underline underline-offset-2">
              security@slovx.com
            </a>. We ask that you give us a reasonable opportunity to investigate and address any issue before public
            disclosure. For formal contractual security commitments or enterprise procurement reviews, contact{' '}
            <a href="mailto:sales@slovx.com" className="text-brand-300 hover:text-brand-200 underline underline-offset-2">
              sales@slovx.com
            </a>.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors">
            Contact our team <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Legal disclaimer */}
      <section className="container-narrow max-w-4xl pt-4 pb-24">
        <div className="border-t border-white/5 pt-8">
          <p className="text-xs text-white/40 leading-relaxed">
            <strong className="text-white/60">Legal Disclaimer & Procurement Review:</strong>{' '}
            This document describes corporate security practices in effect at the time of publication. It does not
            constitute an unconditional warranty of absolute security, as no computing platform can guarantee complete
            protection against all evolving adversarial threats. For tailored contractual security commitments or
            enterprise procurement review, please contact sales@slovx.com.
          </p>
        </div>
      </section>

      <FooterMini />
    </main>
  );
}
