import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store.js';

import Login          from './pages/auth/Login.jsx';
import Register       from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword  from './pages/auth/ResetPassword.jsx';
import BusinessSetup from './pages/onboarding/BusinessSetup.jsx';
import WhatsAppConnect from './pages/onboarding/WhatsAppConnect.jsx';
import Overview      from './pages/dashboard/Overview.jsx';
import Leads         from './pages/dashboard/Leads.jsx';
import LeadDetail    from './pages/dashboard/LeadDetail.jsx';
import Chats         from './pages/dashboard/Chats.jsx';
import SettingsPage  from './pages/dashboard/Settings.jsx';
import Billing       from './pages/dashboard/Billing.jsx';
import Layout        from './components/layout/Layout.jsx';
import Privacy       from './pages/legal/Privacy.jsx';
import Terms         from './pages/legal/Terms.jsx';

// Wait for the initial Supabase session hydrate before deciding public vs
// private, so we don't briefly flash /login for a signed-in user on refresh.
const useAuthReady = () => useAuthStore((s) => s.ready);

const PrivateRoute = ({ children }) => {
  const ready   = useAuthReady();
  const session = useAuthStore((s) => s.session);
  if (!ready) return null;
  return session ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const ready   = useAuthReady();
  const session = useAuthStore((s) => s.session);
  if (!ready) return null;
  return session ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — legal (always accessible, auth-agnostic) */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />

        {/* Public */}
        <Route path="/login"           element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"        element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        {/* /reset-password must NOT bounce authenticated users away — a
            recovery-session user IS technically signed in and needs to
            land on this page to set their new password. */}
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Onboarding — requires auth */}
        <Route path="/onboarding/business"  element={<PrivateRoute><BusinessSetup /></PrivateRoute>} />
        <Route path="/onboarding/whatsapp"  element={<PrivateRoute><WhatsAppConnect /></PrivateRoute>} />

        {/* Dashboard — requires auth */}
        <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index             element={<Overview />} />
          <Route path="chats"      element={<Chats />} />
          <Route path="leads"      element={<Leads />} />
          <Route path="leads/:phone" element={<LeadDetail />} />
          <Route path="settings"   element={<SettingsPage />} />
          <Route path="billing"    element={<Billing />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
