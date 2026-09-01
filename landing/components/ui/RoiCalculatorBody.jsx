'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, Zap } from 'lucide-react';

/**
 * Reusable ROI calculator body — inputs + outputs grid, no section wrapper.
 * Used on the home page (wrapped in .snap-section by RoiCalculator.jsx) and
 * standalone on /roi-calculator.
 *
 * Formula (conservative, capped): faster reply time recovers a share of the
 * conversion odds that decay by ~9% per hour of delay (max 75% decay).
 *   additional_revenue = (instantConvLeads − currentConvLeads) × dealValue
 *   monthly_hours       = weeklyHours × 4.33
 */
const BASELINE_CONVERSION_RATE  = 0.08;   // 8% converts at instant response
const CONVERSION_DECAY_PER_HOUR = 0.09;   // ~9% relative drop per hour of delay
const MAX_CONVERSION_DECAY      = 0.75;   // never model more than a 75% drop

const formatCurrency = (n) => '$' + Math.round(n).toLocaleString('en-US');

function Slider({ label, value, min, max, step, format, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm text-white/70">{label}</label>
        <span className="text-sm font-mono text-brand-300">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand-500"
      />
    </div>
  );
}

export default function RoiCalculatorBody({ ctaHref = '#pricing' }) {
  const [leads, setLeads]       = useState(300);
  const [deal, setDeal]         = useState(500);
  const [replyHrs, setReplyHrs] = useState(4);
  const [teamHrs, setTeamHrs]   = useState(15);

  const { additionalRevenue, monthlyHours } = useMemo(() => {
    const decay = Math.min(MAX_CONVERSION_DECAY, CONVERSION_DECAY_PER_HOUR * replyHrs);
    const currentConv   = BASELINE_CONVERSION_RATE * (1 - decay);
    const projectedConv = BASELINE_CONVERSION_RATE;
    const additionalRevenue = Math.max(0, (leads * projectedConv - leads * currentConv) * deal);
    return { additionalRevenue, monthlyHours: Math.round(teamHrs * 4.33) };
  }, [leads, deal, replyHrs, teamHrs]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {/* Inputs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glow-border rounded-2xl border border-white/5 bg-ink-800/60 p-6 md:p-8 space-y-7 backdrop-blur-md"
      >
        <Slider label="Leads per month"                        value={leads}    min={20}   max={5000}  step={10}   format={(v) => v.toLocaleString('en-US')} onChange={setLeads} />
        <Slider label="Average deal value"                     value={deal}     min={50}   max={20000} step={50}   format={formatCurrency}                  onChange={setDeal} />
        <Slider label="Your current reply time (hours)"        value={replyHrs} min={0.25} max={24}    step={0.25} format={(v) => `${v} hrs`}                onChange={setReplyHrs} />
        <Slider label="Hours/week team spends on manual replies" value={teamHrs} min={1}    max={80}    step={1}    format={(v) => `${v} hrs`}                onChange={setTeamHrs} />
        <p className="text-xs text-white/40 leading-relaxed pt-3 border-t border-white/5">
          Estimates use industry research linking faster lead-response time to higher conversion.
          Actual results vary by industry, offer, and lead quality.
        </p>
      </motion.div>

      {/* Outputs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div
          className="glow-border rounded-2xl border border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-brand-950/40 p-6 md:p-8"
          style={{ boxShadow: '0 0 40px -10px rgba(99, 102, 241, 0.35)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-300" />
            <p className="text-xs font-mono tracking-wider text-brand-300">ESTIMATED ADDITIONAL REVENUE / MONTH</p>
          </div>
          <p className="font-display font-bold text-4xl md:text-5xl text-gradient">
            {formatCurrency(additionalRevenue)}/mo
          </p>
          <p className="text-xs text-white/45 mt-2">From leads recovered by replying in seconds instead of hours.</p>
        </div>

        <div className="glow-border rounded-2xl border border-white/5 bg-ink-800/60 p-6 md:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-brand-300" />
            <p className="text-xs font-mono tracking-wider text-white/50">TEAM HOURS SAVED / MONTH</p>
          </div>
          <p className="font-display font-bold text-3xl md:text-4xl text-white">{monthlyHours} hrs</p>
          <p className="text-xs text-white/45 mt-2">Time your team gets back from screening and repetitive replies.</p>
        </div>

        <div className="glow-border rounded-2xl border border-white/5 bg-ink-800/60 p-6 md:p-7">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-300" />
            <p className="text-xs font-mono tracking-wider text-white/50">RESPONSE TIME, WITH XAVIER</p>
          </div>
          <p className="font-display font-bold text-3xl md:text-4xl text-white">&lt; 30 sec</p>
          <p className="text-xs text-white/45 mt-2">Down from your current average — day or night.</p>
        </div>

        <a
          href={ctaHref}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm py-3.5 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50"
        >
          Start Recovering This Revenue <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}
