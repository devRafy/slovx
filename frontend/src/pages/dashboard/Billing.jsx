import { useAuthStore } from '../../store/auth.store.js';
import { CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';

const PLANS = [
  {
    name: 'Trial',
    key: 'TRIAL',
    price: 'Free',
    period: '14 days',
    features: ['1 WhatsApp number', '100 conversations / month', 'Basic AI replies', 'Community support'],
  },
  {
    name: 'Starter',
    key: 'STARTER',
    price: '$29',
    period: '/ month',
    features: ['1 WhatsApp number', '1,000 conversations / month', 'AI + guardrails', 'Email support'],
  },
  {
    name: 'Pro',
    key: 'PRO',
    price: '$99',
    period: '/ month',
    features: ['3 WhatsApp numbers', '10,000 conversations / month', 'Advanced analytics', 'Priority support'],
    highlighted: true,
  },
];

export default function Billing() {
  const { subscriber } = useAuthStore();
  const currentPlan = subscriber?.plan ?? 'TRIAL';

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Billing & subscription</h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">Manage your plan and view invoices.</p>
      </div>

      {/* Coming soon banner */}
      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-200">Payments coming soon</div>
          <p className="text-xs text-amber-100/80 mt-0.5">
            You're on the <span className="font-medium">{currentPlan}</span> plan. Automated billing and plan upgrades
            are launching in the next release. For now, contact us at{' '}
            <a href="mailto:billing@slovx.com" className="underline">billing@slovx.com</a> to change your plan.
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          return (
            <div
              key={plan.key}
              className={`rounded-xl border p-6 backdrop-blur ${
                plan.highlighted
                  ? 'border-brand-500/50 bg-ink-800/80 ring-2 ring-brand-500/20'
                  : 'border-white/10 bg-ink-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-300">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-white/50 ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-2 rounded-lg text-sm font-medium border border-white/10 text-white/40 cursor-not-allowed"
              >
                {isCurrent ? 'Current plan' : 'Upgrade coming soon'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice history placeholder */}
      <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white">Invoice history</h2>
        </div>
        <p className="text-sm text-white/50">
          No invoices yet. Once payments are enabled, your billing history will appear here.
        </p>
      </div>
    </div>
  );
}
