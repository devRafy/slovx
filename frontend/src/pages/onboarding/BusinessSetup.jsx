import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '../../api/business.api.js';
import { Zap, Plus, Trash2 } from 'lucide-react';

const TIMEZONES = [
  'Asia/Karachi', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Riyadh',
  'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago',
  'America/Los_Angeles', 'UTC',
];

const INDUSTRIES = [
  'Real Estate', 'E-commerce', 'Healthcare', 'Education',
  'Technology', 'Finance', 'Retail', 'Hospitality', 'Other',
];

const blankProduct = () => ({
  name: '',
  price: '',
  billingCycle: 'monthly',
  description: '',
  features: '',
});

const PERSONALITIES = [
  { value: 'professional', label: 'Professional — polished, concise, businesslike' },
  { value: 'friendly',     label: 'Friendly — warm, casual, conversational' },
  { value: 'formal',       label: 'Formal — respectful, structured, deferential' },
];

export default function BusinessSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    discountPolicy: '',
    refundPolicy: '',
    calendarLink: '',
    timezone: 'Asia/Karachi',
    aiPersonality: 'professional',
    products: [blankProduct()],
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setProduct = (i, key, val) =>
    setForm((f) => {
      const products = [...f.products];
      products[i] = { ...products[i], [key]: val };
      return { ...f, products };
    });

  const addProduct = () => setForm((f) => ({ ...f, products: [...f.products, blankProduct()] }));

  const removeProduct = (i) =>
    setForm((f) => ({ ...f, products: f.products.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await businessApi.saveConfig({
        ...form,
        products: form.products.map((p) => ({
          ...p,
          price: Number(p.price),
          features: p.features
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean),
        })),
      });
      navigate('/onboarding/whatsapp');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Xavier</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <Step n={1} label="Business setup" active />
            <div className="h-px flex-1 bg-gray-200" />
            <Step n={2} label="Connect WhatsApp" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Set up your business</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tell the AI about your business so it can represent you accurately.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Company details">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Company name *</Label>
                <Input
                  required
                  value={form.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label>Industry *</Label>
                <select
                  required
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <Label>Timezone *</Label>
                <select
                  required
                  value={form.timezone}
                  onChange={(e) => set('timezone', e.target.value)}
                  className={selectCls}
                >
                  {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card title="Products / services">
            <div className="space-y-3">
              {form.products.map((p, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Product {i + 1}</span>
                    {form.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        required
                        value={p.name}
                        onChange={(e) => setProduct(i, 'name', e.target.value)}
                        placeholder="Basic Plan"
                      />
                    </div>
                    <div>
                      <Label>Price (USD) *</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={p.price}
                        onChange={(e) => setProduct(i, 'price', e.target.value)}
                        placeholder="99"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Billing cycle *</Label>
                      <select
                        required
                        value={p.billingCycle}
                        onChange={(e) => setProduct(i, 'billingCycle', e.target.value)}
                        className={selectCls}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one_time">One-time</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Label>Description *</Label>
                      <Input
                        required
                        value={p.description}
                        onChange={(e) => setProduct(i, 'description', e.target.value)}
                        placeholder="What's included…"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Features * (comma-separated)</Label>
                      <Input
                        required
                        value={p.features}
                        onChange={(e) => setProduct(i, 'features', e.target.value)}
                        placeholder="Unlimited messages, Priority support, API access"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProduct}
                className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Add product
              </button>
            </div>
          </Card>

          <Card title="Policies & booking">
            <div className="space-y-4">
              <div>
                <Label>Discount policy *</Label>
                <textarea
                  rows={2}
                  required
                  value={form.discountPolicy}
                  onChange={(e) => set('discountPolicy', e.target.value)}
                  className={textareaCls}
                  placeholder="e.g. 10% off for annual subscriptions, no discounts on single licenses"
                />
              </div>
              <div>
                <Label>Refund policy *</Label>
                <textarea
                  rows={2}
                  required
                  value={form.refundPolicy}
                  onChange={(e) => set('refundPolicy', e.target.value)}
                  className={textareaCls}
                  placeholder="e.g. 14-day money-back guarantee, no refunds after activation"
                />
              </div>
              <div>
                <Label>Booking / calendar link</Label>
                <Input
                  type="url"
                  value={form.calendarLink}
                  onChange={(e) => set('calendarLink', e.target.value)}
                  placeholder="https://calendly.com/yourname"
                />
              </div>
            </div>
          </Card>

          <Card title="AI personality">
            <div>
              <Label>Tone the AI should use with customers</Label>
              <select
                required
                value={form.aiPersonality}
                onChange={(e) => set('aiPersonality', e.target.value)}
                className={selectCls}
              >
                {PERSONALITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </Card>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium rounded-xl transition-colors"
          >
            {loading ? 'Saving…' : 'Save & continue →'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm text-gray-600 mb-1.5">{children}</label>;
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${props.className ?? ''}`}
    />
  );
}

function Step({ n, label, active }) {
  return (
    <span className={`flex items-center gap-1.5 ${active ? 'text-brand-600 font-medium' : ''}`}>
      <span
        className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold ${
          active ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {n}
      </span>
      {label}
    </span>
  );
}

const selectCls =
  'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white';

const textareaCls =
  'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none';
