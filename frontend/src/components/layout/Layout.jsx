import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Settings, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store.js';
import { authApi } from '../../api/auth.api.js';

const navItems = [
  { to: '/dashboard',            label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/chats',      label: 'Chats',    icon: MessageSquare },
  { to: '/dashboard/leads',      label: 'Leads',    icon: Users },
  { to: '/onboarding/business',  label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { subscriber, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout(refreshToken).catch(() => {});
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-brand-950 text-white flex flex-col shrink-0">
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Xavier</div>
              <div className="text-white/40 text-xs">AI Sales Platform</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
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

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
              {subscriber?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{subscriber?.name}</div>
              <div className="text-xs text-white/40 truncate">{subscriber?.plan}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
