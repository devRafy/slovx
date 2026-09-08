import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';
import { authApi } from '../../api/auth.api.js';
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirm]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [done, setDone]                 = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch', "Passwords don't match."));
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      // Send them to /login after a short beat.
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        t('auth.resetFailed', 'Something went wrong. Please request a new reset link.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="light" align="right" />
      </div>

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
          {!token ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {t('auth.invalidLink', 'Invalid reset link')}
              </h1>
              <p className="text-sm text-gray-500 text-center">
                {t('auth.invalidLinkBody', 'This link is missing or malformed. Please request a new one.')}
              </p>
            </>
          ) : done ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-brand-600" />
                </div>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {t('auth.passwordUpdated', 'Password updated')}
              </h1>
              <p className="text-sm text-gray-500 text-center">
                {t('auth.redirectingToLogin', 'Redirecting you to sign in…')}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {t('auth.resetTitle', 'Set a new password')}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                {t('auth.resetSubtitle', 'Choose a strong password you haven\'t used elsewhere.')}
              </p>

              {error && (
                <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('auth.newPassword', 'New password')}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {t('auth.passwordHint')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('auth.confirmPassword', 'Confirm new password')}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? t('common.loading') : t('auth.updatePassword', 'Update password')}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            {t('auth.backToLogin', 'Back to sign in')}
          </Link>
        </p>
      </div>
    </div>
  );
}
