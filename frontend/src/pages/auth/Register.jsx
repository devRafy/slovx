import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';
import { authApi } from '../../api/auth.api.js';
import { Zap } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!acceptTerms) {
      setErrors({ acceptTerms: 'You must accept the Terms and Privacy Policy to continue' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register({ ...form, acceptTerms: true });
      login(data.data);
      navigate('/onboarding/business');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) {
        const map = {};
        res.errors.forEach(({ field, message }) => { map[field] = message; });
        setErrors(map);
      } else {
        setErrors({ _global: res?.message ?? 'Registration failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Xavier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Start your AI sales platform</p>

          {errors._global && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {errors._global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" error={errors.name}>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls(errors.name)}
                placeholder="Jane Smith"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputCls(errors.email)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password" error={errors.password} hint="Min 8 chars, 1 uppercase, 1 number">
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputCls(errors.password)}
                placeholder="••••••••"
              />
            </Field>
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-brand-600 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" className="text-brand-600 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-600">{errors.acceptTerms}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputCls = (err) =>
  `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
    err ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
