'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Globe, Shield, Brain, Zap, Pause, Users } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { features } from '../../lib/content';

const FloatingShapes = dynamic(() => import('../3d/FloatingShapes'), { ssr: false });

const ICONS = { Globe, Shield, Brain, Zap, Pause, Users };

function FeatureCard({ item, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const Icon = ICONS[item.icon] ?? Globe;

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 8 });
    setCursor({ x: x * 100, y: y * 100 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: 0.4 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative rounded-2xl bg-ink-800/70 border border-white/5 p-6 md:p-7 transition-all duration-300 hover:border-brand-500/30 backdrop-blur-md overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${cursor.x}% ${cursor.y}%, rgba(99, 102, 241, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-5">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
      <h3 className="relative font-display font-bold text-lg md:text-xl text-white mb-2">
        {item.title}
      </h3>
      <p className="relative text-sm text-white/60 leading-relaxed">
        {item.body}
      </p>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="snap-section relative">
      <div className="absolute inset-0 opacity-30">
        <FloatingShapes />
      </div>

      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow={features.eyebrow}
          title={features.title}
          subtitle={features.subtitle}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.items.map((item, i) => (
            <FeatureCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
