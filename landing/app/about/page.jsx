'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Moon, Target, HandshakeIcon, ArrowRight, Check } from 'lucide-react';
import PageHero from '../../components/ui/PageHero';
import FooterMini from '../../components/ui/FooterMini';

const THREE_BOXES = [
  {
    icon: Moon,
    title: 'Never sleeps, never forgets',
    body:  'Xavier replies at 11 PM the same way it replies at 11 AM — no lead ever waits until morning.',
  },
  {
    icon: Target,
    title: 'Knows a lead from a browser',
    body:  'Understands the difference between a curious visitor and a ready-to-buy customer, and treats each one accordingly.',
  },
  {
    icon: HandshakeIcon,
    title: 'Knows when to step back',
    body:  "When a conversation truly needs a human touch, it hands off cleanly — it never stumbles through what it can't answer.",
  },
];

const WHY_BETTER = [
  'A coordinated system, not a single script',
  'Locked to your real pricing — never invents an answer',
  'Built for the moment a lead actually messages you',
  'Gives you back your time, not just automation',
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="OUR STORY"
        title="We didn't build another chatbot."
        subtitle="Every founder we talked to said the same thing: 'I'm losing deals not because my product is bad — but because I can't reply fast enough.' A lead messages at 11 PM. By the time someone sees it, they've already messaged your competitor."
      />

      {/* Narrative */}
      <section className="container-narrow max-w-3xl py-8 md:py-12 space-y-6 text-base md:text-lg text-white/70 leading-relaxed">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          That frustration is where Xavier was born. We're a small team of engineers who got tired of watching businesses lose winnable deals to something as simple as timing. So we built something that doesn't sleep, doesn't forget, and doesn't guess — an autonomous sales executive that actually understands the difference between a curious visitor and a ready-to-buy lead, and treats them accordingly.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Xavier isn't a script pretending to be smart. It's a coordinated system — one part of it listens for intent, another reads the room, another knows exactly when to close. It never invents a price you didn't give it. It never leaves a hot lead waiting until morning. And when a conversation truly needs a human touch, it knows to step back and hand it to you — not stumble through it.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We called it <span className="text-white font-semibold">SlovX</span> because we believe the future of business isn't about replacing people. It's about giving people back their time — so a founder can stop replying to messages at midnight, and start building the thing they actually set out to build.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl font-display font-bold text-gradient pt-4"
        >
          We're not selling automation. We're selling back your attention.
        </motion.p>
      </section>

      {/* 3 Boxes */}
      <section className="container-narrow py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {THREE_BOXES.map((box, i) => {
            const Icon = box.icon;
            return (
              <motion.div
                key={box.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-ink-800/50 border border-white/5 p-6 md:p-8 hover:border-brand-500/30 transition-colors backdrop-blur-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-5">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-2">
                  {box.title}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed">
                  {box.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why We Are Better */}
      <section className="container-narrow max-w-3xl py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">WHY WE ARE BETTER</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white mb-3">
            Why our approach is different from others.
          </h2>
        </motion.div>

        <div className="mt-10 space-y-3">
          {WHY_BETTER.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-xl bg-ink-800/40 border border-white/5"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/20 shrink-0">
                <Check className="w-4 h-4 text-brand-400" />
              </span>
              <p className="text-base md:text-lg text-white/80 pt-1">{point}</p>
            </motion.div>
          ))}
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
            Get your time back.
          </h2>
          <p className="text-white/60 mb-8">
            Set up in 15 minutes. Free for the first 20 conversations.
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
              href="/architecture"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
            >
              See how it works
            </Link>
          </div>
        </motion.div>
      </section>

      <FooterMini />
    </main>
  );
}
