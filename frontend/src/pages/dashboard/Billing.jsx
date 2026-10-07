import { useAuthStore } from '../../store/auth.store.js';
import { CreditCard, Sparkles, Check } from 'lucide-react';

// The DB Plan enum is still TRIAL | STARTER | PRO; `key` maps each tier onto it.
const PLANS = [
  {
    name: 'Assistant',
    key: 'STARTER',
    pitch: 'For boutique brands testing AI on their WhatsApp inbound.',
    price: '$549',
    period: '/ month',
    limit: '300 inbound leads / month',
    overage: '$0.50 / extra lead',
    features: [
      '24/7 smart screening agent',
      'Anti-hallucination guardrails',
      'Multi-language auto-reply',
      'Smart message-burst queue',
      'Meta-compliant + STOP handling',
      'Pause bot switch',
    ],
    cta: { label: 'Upgrade to Assistant', href: 'mailto:billing@slovx.com?subject=Upgrade%20to%20Assistant' },
  },
  {
    name: 'BDR Suite',
    key: 'PRO',
    badge: 'MOST POPULAR',
    highlighted: true,
    pitch: 'For scale-ups and clinics ready to fully outsource inbound qualification.',
    price: '$1,499',
    period: '/ month',
    limit: '1,000 high-ticket conversations / month',
    overage: '$0.35 / extra conversation',
    includes: 'Everything in Assistant, plus:',
    features: [
      '2-agent closer combo',
      'Hands-free calendar booking',
      'Live Google Sheets sync',
      'Instant FAQ answer cache',
      'Audio voice-note transcription',
    ],
    cta: { label: 'Upgrade to BDR Suite', href: 'mailto:billing@slovx.com?subject=Upgrade%20to%20BDR%20Suite' },
  },
  {
    name: 'Enterprise',
    key: 'ENTERPRISE',
    pitch: 'For agencies and luxury brands running the whole show through Xavier.',
    price: '$3,500',
    period: '/ month · starting',
    limit: '3,000 deep B2B pipelines / month',
    overage: '$0.25 / extra conversation',
    includes: 'Everything in BDR, plus:',
    features: [
      '3-agent full combo + sentiment audit',
      '"Whale catcher" lead enrichment',
      'Dynamic tone shifting',
      'Global cultural adapter (Khaleeji, EU)',
      'CRM sync (HubSpot / Salesforce / Pipedrive)',
      'Team access controls (RBAC)',
    ],
    cta: { label: 'Book a demo', href: 'mailto:sales@slovx.com?subject=Xavier%20Enterprise%20demo', secondary: true },
  },
];

const planLabel = (key) =>
  PLANS.find((p) => p.key === key)?.name ?? (key === 'TRIAL' ? 'Free trial' : key);

export default function Billing() {
  const { subscriber } = useAuthStore();
  const currentPlan = subscriber?.plan ?? 'TRIAL';

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Billing & subscription</h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1">Manage your plan and view invoices.</p>
      </div>

      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-amber-200">Payments coming soon</div>
          <p className="text-xs text-amber-100/80 mt-0.5">
            You're on the <span className="font-medium">{planLabel(currentPlan)}</span> plan. Automated billing and
            plan upgrades are launching in the next release. For now, contact us at{' '}
            <a href="mailto:billing@slovx.com" className="underline">billing@slovx.com</a> to change your plan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          return (
            <div
              key={plan.key}
              className={`flex flex-col rounded-2xl border p-6 sm:p-7 backdrop-blur ${
                plan.highlighted
                  ? 'border-brand-500/50 bg-ink-800/80 ring-2 ring-brand-500/20'
                  : 'border-white/10 bg-ink-800/60'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-500/60 bg-brand-500/15 text-white">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">
                    CURRENT
                  </span>
                )}
              </div>
              <p className="text-sm text-white/50 mb-5 min-h-[2.5rem]">{plan.pitch}</p>

              <div className="mb-5">
                <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-sm text-white/50 ml-1.5">{plan.period}</span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 mb-5">
                <div className="text-sm font-medium text-white">{plan.limit}</div>
                <div className="text-xs text-white/50 mt-0.5">{plan.overage}</div>
              </div>

              {plan.includes && <div className="text-sm font-medium text-white/80 mb-3">{plan.includes}</div>}
              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold border border-white/10 text-white/40 cursor-not-allowed"
                >
                  Current plan
                </button>
              ) : (
                <a
                  href={plan.cta.href}
                  className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-colors ${
                    plan.cta.secondary
                      ? 'border border-white/15 text-white hover:bg-white/5'
                      : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/25'
                  }`}
                >
                  {plan.cta.label}
                </a>
              )}
            </div>
          );
        })}
      </div>

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
