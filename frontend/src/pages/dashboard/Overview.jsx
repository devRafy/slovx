import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dashboardApi } from '../../api/dashboard.api.js';
import {
  Users, MessageSquare, TrendingUp, CheckCircle2,
  XCircle, Star, Zap, RefreshCw,
} from 'lucide-react';

export default function Overview() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    refetchInterval: 60_000,
  });

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">{t('dashboard.overviewTitle')}</h1>
          <p className="text-xs sm:text-sm text-white/50 mt-0.5">{t('dashboard.overviewSubtitle')}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">{t('common.refresh')}</span>
        </button>
      </div>

      {isLoading && <SkeletonGrid />}
      {isError && (
        <div className="text-center py-16 text-white/40">
          <p className="mb-2">{t('dashboard.failedStats')}</p>
          <button onClick={() => refetch()} className="text-brand-400 text-sm hover:underline">{t('common.tryAgain')}</button>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard label={t('dashboard.totalConversations')} value={data.totalConversations} icon={MessageSquare} color="blue" />
            <StatCard label={t('dashboard.totalLeads')}         value={data.totalLeads}         icon={Users}         color="indigo" />
            <StatCard label={t('dashboard.qualifiedLeads')}     value={data.qualifiedLeads}     icon={TrendingUp}    color="amber" />
            <StatCard label={t('dashboard.dealsClosed')}        value={data.closedWon}          icon={CheckCircle2}  color="green" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <MetricCard label={t('dashboard.lostDeals')} value={data.closedLost} icon={XCircle} color="red" />
            <MetricCard
              label={t('dashboard.avgSentiment')}
              value={data.avgSentiment != null ? `${(data.avgSentiment * 10).toFixed(1)} / 10` : '—'}
              icon={Star} color="purple"
            />
            <MetricCard
              label={t('dashboard.avgIntent')}
              value={data.avgBuyingIntent != null ? `${(data.avgBuyingIntent * 10).toFixed(1)} / 10` : '—'}
              icon={Zap} color="brand"
            />
          </div>

          <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 sm:p-6">
            <h2 className="text-sm font-semibold text-white mb-4">{t('dashboard.conversionFunnel')}</h2>
            <FunnelBar label={t('dashboard.conversations')}   value={data.totalConversations} max={data.totalConversations} color="bg-blue-500" />
            <FunnelBar label={t('dashboard.leadsCaptured')}   value={data.totalLeads}         max={data.totalConversations} color="bg-indigo-500" />
            <FunnelBar label={t('dashboard.qualified')}       value={data.qualifiedLeads}     max={data.totalConversations} color="bg-amber-500" />
            <FunnelBar label={t('dashboard.closedWon')}       value={data.closedWon}          max={data.totalConversations} color="bg-green-500" />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue:   'bg-blue-500/10 text-blue-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    amber:  'bg-amber-500/10 text-amber-400',
    green:  'bg-green-500/10 text-green-400',
  };
  return (
    <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 sm:p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white">{value ?? 0}</div>
      <div className="text-xs sm:text-sm text-white/50 mt-0.5">{label}</div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const colors = {
    red:    'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
    brand:  'bg-brand-500/10 text-brand-400',
  };
  return (
    <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-sm text-white/50">{label}</div>
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white/60">{label}</span>
        <span className="font-medium text-white">{value} <span className="text-white/40 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-ink-800/60 rounded-xl border border-white/10 p-5 animate-pulse">
          <div className="w-9 h-9 bg-white/5 rounded-lg mb-3" />
          <div className="h-7 bg-white/5 rounded w-1/2 mb-1" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
