'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageSquare, Clock, ArrowRight, Check, Loader2 } from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import FooterMini from '../../components/ui/FooterMini';

const CONTACT_METHODS = [
  {
    icon:  Mail,
    label: 'Email',
    value: 'hello@slovx.com',
    href:  'mailto:hello@slovx.com',
    note:  'Best for detailed questions',
  },
  {
    icon:  MessageSquare,
    label: 'WhatsApp',
    value: '+92 300 1234567',
    href:  'https://wa.me/923001234567',
    note:  'Yes, we use our own product',
  },
  {
    icon:  Clock,
    label: 'Response time',
    value: 'Under 4 hours',
    href:  null,
    note:  'On business days (Mon–Sat)',
  },
];

const SUBJECTS = [
  'General inquiry',
  'Book a demo',
  'Enterprise plan / custom quote',
  'Partnership / integration',
  'Support',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    setStatus('sending');
    setError('');
    // No backend yet — open the user's email client with a pre-filled draft.
    // Later we can swap this for a real POST to /api/contact (or Resend, Formspree, etc.)
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const mailto = `mailto:hello@slovx.com?subject=${encodeURIComponent(`[${form.subject}] Contact from ${form.name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    // Optimistic success
    setTimeout(() => setStatus('sent'), 500);
  };

  return (
    <main>
      <PageHero
        eyebrow="GET IN TOUCH"
        title="Let's talk."
        subtitle="Have questions, want a demo, or need a custom Enterprise setup? We reply fast — usually within 4 hours on business days."
      />

      <section className="container-narrow py-8 md:py-16">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* ─── Contact form ────────────────────────────────────── */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-ink-800/50 border border-white/5 p-6 md:p-8 backdrop-blur-sm space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Your name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-lg bg-ink-950/60 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500/50 focus:bg-ink-950 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Work email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@company.com"
                className="w-full px-4 py-3 rounded-lg bg-ink-950/60 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500/50 focus:bg-ink-950 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-ink-950/60 border border-white/10 text-white focus:outline-none focus:border-brand-500/50 focus:bg-ink-950 transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a5b4fc' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem',
                  paddingRight: '2.5rem',
                }}
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your business and how we can help…"
                className="w-full px-4 py-3 rounded-lg bg-ink-950/60 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-500/50 focus:bg-ink-950 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                {error}
              </div>
            )}

            {status === 'sent' && (
              <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Your email client should have opened. If not, email us directly at hello@slovx.com.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-medium transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/60"
            >
              {status === 'sending'
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : <>Send message <ArrowRight className="w-4 h-4" /></>}
            </button>
          </motion.form>

          {/* ─── Contact methods sidebar ─────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            {CONTACT_METHODS.map((m) => {
              const Icon = m.icon;
              const inner = (
                <div className="rounded-xl bg-ink-800/40 border border-white/5 p-5 hover:border-brand-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20">
                      <Icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                      {m.label}
                    </div>
                  </div>
                  <div className="text-base font-semibold text-white">{m.value}</div>
                  <div className="text-xs text-white/50 mt-1">{m.note}</div>
                </div>
              );
              return m.href ? (
                <a key={m.label} href={m.href} target={m.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={m.label}>{inner}</div>
              );
            })}

            {/* Quick link to FAQ */}
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5">
              <p className="text-sm text-white/70 mb-3">
                Looking for quick answers? Most questions are covered in our FAQ.
              </p>
              <Link
                href="/#faq"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200 transition-colors"
              >
                Browse the FAQ <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </section>

      <FooterMini />
    </main>
  );
}
