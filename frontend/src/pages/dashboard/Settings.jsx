import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api.js';
import { businessApi } from '../../api/business.api.js';
import { useAuthStore } from '../../store/auth.store.js';
import { Bot, Building2, MessageSquare, Loader2, Sliders } from 'lucide-react';

export default function Settings() {
  const { subscriber, setSubscriber } = useAuthStore();
  const [botEnabled, setBotEnabled] = useState(subscriber?.botEnabled ?? true);
  const [connection, setConnection] = useState(null);
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Load fresh profile + WhatsApp status on mount
  useEffect(() => {
    Promise.all([authApi.me(), businessApi.whatsappStatus(), businessApi.getConfig()])
      .then(([profile, wa, cfg]) => {
        const p = profile.data.data;
        setBotEnabled(p?.botEnabled ?? true);
        setSubscriber(p);
        setConnection(wa.data.data);
        setConfig(cfg.data.data);
      })
      .catch(() => {});
  }, [setSubscriber]);

  const handleToggle = async (nextValue) => {
    setBotEnabled(nextValue);
    setSaving(true);
    try {
      await businessApi.toggleBot(nextValue);
      setToast({ type: 'success', message: nextValue ? 'Bot resumed — AI will reply to messages.' : 'Bot paused — messages will be received but not auto-answered.' });
    } catch (err) {
      setBotEnabled(!nextValue); // revert
      setToast({ type: 'error', message: err.response?.data?.message ?? 'Failed to update' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="flex-1 p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your bot behavior, business config, and WhatsApp connection.</p>
      </div>

      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          toast.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="space-y-4">
        {/* Bot Pause / Resume */}
        <Section
          icon={Bot}
          title="AI Bot"
          description="When paused, incoming messages are still saved to your Chats but the AI will not auto-reply."
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {botEnabled ? 'Bot is active' : 'Bot is paused'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {botEnabled
                  ? 'AI is answering customer messages automatically.'
                  : 'AI is silent. Reply to customers manually via WhatsApp.'}
              </div>
            </div>
            <Toggle enabled={botEnabled} onChange={handleToggle} disabled={saving} />
          </div>
        </Section>

        {/* Business config */}
        <Section
          icon={Building2}
          title="Business configuration"
          description="Company details, products, policies, and FAQs used by the AI."
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {config?.companyName || 'Not configured yet'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {config?.isComplete ? 'Configuration complete' : 'Setup incomplete'}
              </div>
            </div>
            <Link
              to="/onboarding/business"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Edit →
            </Link>
          </div>
        </Section>

        {/* WhatsApp connection */}
        <Section
          icon={MessageSquare}
          title="WhatsApp connection"
          description="Your WhatsApp Business number. All customer messages flow through here."
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {connection?.isActive
                  ? (connection.displayPhone || 'Connected')
                  : 'Not connected'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {connection?.isActive ? 'Receiving messages' : 'Connect your WhatsApp Business number'}
              </div>
            </div>
            <Link
              to="/onboarding/whatsapp"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {connection?.isActive ? 'Manage →' : 'Connect →'}
            </Link>
          </div>
        </Section>

        {/* Account (read-only info) */}
        <Section
          icon={Sliders}
          title="Account"
          description="Your Xavier account details."
        >
          <div className="space-y-2 text-sm">
            <Row label="Name"  value={subscriber?.name} />
            <Row label="Email" value={subscriber?.email} />
            <Row label="Plan"  value={subscriber?.plan} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="pl-12">{children}</div>
    </div>
  );
}

function Toggle({ enabled, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-brand-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {disabled && (
        <Loader2 className="w-3 h-3 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value ?? '—'}</span>
    </div>
  );
}
