import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Users, Settings, CreditCard,
  LogOut, Zap, Menu, X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth.store.js';
import { authApi } from '../../api/auth.api.js';
import LanguageSwitcher from '../LanguageSwitcher.jsx';

const buildNavItems = (t) => [
  { to: '/dashboard',           label: t('nav.overview'), icon: LayoutDashboard, end: true },
  { to: '/dashboard/chats',     label: t('nav.chats'),    icon: MessageSquare },
  { to: '/dashboard/leads',     label: t('nav.leads'),    icon: Users },
  { to: '/dashboard/settings',  label: t('nav.settings'), icon: Settings },
  { to: '/dashboard/billing',   label: t('nav.billing'),  icon: CreditCard },
];

export default function Layout() {
  const { t } = useTranslation();
  const navItems = buildNavItems(t);
  const { subscriber, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile drawer whenever route changes
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll while drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await authApi.logout(refreshToken).catch(() => {});
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile top bar (only < md) */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-brand-950 text-white flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-500 rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold">Xavier</span>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher variant="dark" align="right" />
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
            {subscriber?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — off-canvas on mobile, fixed on desktop */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-0
          w-64 h-screen shrink-0
          bg-brand-950 text-white flex flex-col
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Xavier</div>
              <div className="text-white/40 text-xs">AI Sales Platform</div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-1">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
              {subscriber?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{subscriber?.name}</div>
              <div className="text-xs text-white/40 truncate">{subscriber?.plan}</div>
            </div>
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher variant="dark" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content — top padding on mobile to clear the fixed header */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
