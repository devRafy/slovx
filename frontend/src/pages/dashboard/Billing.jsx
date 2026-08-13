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
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Billing & subscription</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your plan and view invoices.</p>
      </div>

      {/* Coming soon banner */}
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-900">Payments coming soon</div>
          <p className="text-xs text-amber-800 mt-0.5">
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
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-brand-500 bg-white ring-2 ring-brand-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{plan.name}</h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                    CURRENT
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-400 cursor-not-allowed"
              >
                {isCurrent ? 'Current plan' : 'Upgrade coming soon'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice history placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Invoice history</h2>
        </div>
        <p className="text-sm text-gray-500">
          No invoices yet. Once payments are enabled, your billing history will appear here.
        </p>
      </div>
    </div>
  );
}
