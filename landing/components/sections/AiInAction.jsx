'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Wifi, Battery, Signal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { aiInAction } from '../../lib/content';

const FloatingShapes = dynamic(() => import('../3d/FloatingShapes'), { ssr: false });

export default function AiInAction() {
  const sectionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    let idx = 0;

    const step = async () => {
      while (idx < aiInAction.chat.length) {
        if (cancelled) return;
        const msg = aiInAction.chat[idx];
        if (msg.role === 'ai') {
          setTyping(true);
          await new Promise((r) => setTimeout(r, msg.delay ?? 800));
          if (cancelled) return;
          setTyping(false);
        } else {
          await new Promise((r) => setTimeout(r, msg.delay ?? 400));
          if (cancelled) return;
        }
        setMessages((prev) => [...prev, msg]);
        idx++;
      }
    };
    step();
    return () => { cancelled = true; };
  }, [started]);

  return (
    <section ref={sectionRef} className="snap-section relative">
      <div className="absolute inset-0 opacity-40">
        <FloatingShapes />
      </div>

      <div className="container-narrow relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <SectionHeader
            eyebrow={aiInAction.eyebrow}
            title={aiInAction.title}
            subtitle={aiInAction.subtitle}
            align="left"
          />
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
              Detects budget
            </span>
            <span className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
              Recommends plan
            </span>
            <span className="px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300">
              Books demo
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneMock messages={messages} typing={typing} />
        </div>
      </div>
    </section>
  );
}

function PhoneMock({ messages, typing }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, typing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <div className="absolute inset-0 blur-3xl bg-brand-500/20 rounded-full" />
      <div className="relative w-[300px] md:w-[320px] h-[600px] md:h-[640px] rounded-[3rem] bg-black border-4 border-ink-700 shadow-2xl overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
        <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-between px-6 pt-2 text-white text-[10px] z-10">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /><Battery className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="absolute top-10 inset-x-0 h-14 bg-[#075E54] flex items-center px-4 gap-3 z-10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">X</div>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Xavier · your AI</div>
            <div className="text-white/60 text-[10px]">online</div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="absolute top-24 inset-x-0 bottom-14 bg-[#0b141a] p-3 overflow-y-auto no-scrollbar space-y-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='0.6' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-snug shadow ${
                    msg.role === 'ai'
                      ? 'bg-[#202c33] text-white/95 rounded-bl-sm'
                      : 'bg-[#005c4b] text-white rounded-br-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="px-3 py-2.5 rounded-2xl bg-[#202c33] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-14 bg-[#1f2c33] flex items-center px-3 gap-2 z-10">
          <div className="flex-1 h-9 rounded-full bg-[#2a3942] px-4 flex items-center text-white/40 text-xs">Message</div>
          <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white text-sm">✓</div>
        </div>
      </div>
    </motion.div>
  );
}
