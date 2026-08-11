import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '../../api/business.api.js';
import { Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const META_APP_ID = import.meta.env.VITE_META_APP_ID ?? '';

export default function WhatsAppConnect() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | connecting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [waStatus, setWaStatus] = useState(null);
  const sdkLoaded = useRef(false);

  useEffect(() => {
    // Check if already connected
    businessApi.whatsappStatus().then(({ data }) => {
      if (data.data?.isActive) setWaStatus(data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (sdkLoaded.current) return;
    sdkLoaded.current = true;

    window.fbAsyncInit = function () {
      window.FB.init({ appId: META_APP_ID, autoLogAppEvents: true, xfbml: true, version: 'v20.0' });
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const handleMessage = (event) => {
      if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'WA_EMBEDDED_SIGNUP' && data.event === 'FINISH') {
          handleSignupComplete(data.data.code);
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSignupComplete = async (code) => {
    setStatus('connecting');
    try {
      await businessApi.connectWhatsApp(code);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Connection failed. Please try again.');
      setStatus('error');
    }
  };

  const launchEmbeddedSignup = () => {
    if (!window.FB) {
      setErrorMsg('Facebook SDK not loaded yet. Please refresh and try again.');
      setStatus('error');
      return;
    }
    window.FB.login(
      (response) => {
        if (response.authResponse?.code) {
          handleSignupComplete(response.authResponse.code);
        }
      },
      {
        config_id: import.meta.env.VITE_META_CONFIG_ID ?? '',
        response_type: 'code',
        override_default_response_type: true,
        extras: { sessionInfoVersion: '3' },
      },
    );
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect WhatsApp? You can reconnect anytime.')) return;
    try {
      await businessApi.disconnectWhatsApp();
      setWaStatus(null);
      setStatus('idle');
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Failed to disconnect');
    }
  };

  if (waStatus) {
    return (
      <ConnectedState
        displayPhone={waStatus.displayPhone}
        onContinue={() => navigate('/dashboard')}
        onDisconnect={handleDisconnect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Xavier</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-1.5 text-gray-400">
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold bg-green-100 text-green-600">✓</span>
              Business setup
            </span>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="flex items-center gap-1.5 text-brand-600 font-medium">
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold bg-brand-600 text-white">2</span>
              Connect WhatsApp
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Connect WhatsApp Business</h1>
          <p className="text-gray-500 text-sm mt-1">
            Link your WhatsApp Business number so the AI can reply to your customers.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">How it works</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            {[
              "Click the button below to open Facebook's secure signup flow",
              'Log in with the Facebook account that owns your WhatsApp Business Account',
              'Select or create your WhatsApp Business number',
              'Xavier gets a secure token — no passwords stored',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {status === 'error' && (
          <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        {status === 'success' ? (
          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-green-50 border border-green-200 text-green-700 mb-4">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium text-sm">WhatsApp connected successfully!</p>
              <p className="text-xs text-green-600 mt-0.5">Your AI is now ready to handle customer conversations.</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {status !== 'success' && (
            <button
              onClick={launchEmbeddedSignup}
              disabled={status === 'connecting'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1ebe5c] disabled:opacity-60 text-white font-medium rounded-xl transition-colors"
            >
              {status === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting…
                </>
              ) : (
                <>
                  <WhatsAppIcon /> Connect WhatsApp Business
                </>
              )}
            </button>
          )}

          {(status === 'success' || status === 'idle') && (
            <button
              onClick={() => navigate('/dashboard')}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                status === 'success'
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'success' ? 'Go to dashboard →' : 'Skip for now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConnectedState({ displayPhone, onContinue, onDisconnect }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp already connected</h1>
        <p className="text-gray-500 text-sm mb-2">{displayPhone}</p>
        <p className="text-gray-400 text-sm mb-6">Your AI is active and handling customer messages.</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onContinue}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors"
          >
            Go to dashboard
          </button>
          <button
            onClick={onDisconnect}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
