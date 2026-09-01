'use client';

import SectionHeader from '../ui/SectionHeader';
import RoiCalculatorBody from '../ui/RoiCalculatorBody';

/**
 * Home-page ROI calculator section. Full-viewport snap section that hosts
 * the shared RoiCalculatorBody. Standalone /roi-calculator page uses the
 * same body directly (no snap wrapper).
 */
export default function RoiCalculator() {
  return (
    <section id="roi-calculator" className="snap-section relative">
      <div className="container-narrow relative z-10">
        <SectionHeader
          eyebrow="SEE THE MATH"
          title="What is slow replying actually costing you?"
          subtitle="Move the sliders to match your business. The numbers update instantly."
        />
        <RoiCalculatorBody ctaHref="#pricing" />
      </div>
    </section>
  );
}
