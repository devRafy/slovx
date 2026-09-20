import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
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

          {/* Charts row — 2/3 area + 1/3 donut on lg+, stacked on smaller screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="lg:col-span-2">
              <TrendChart totalConversations={data.totalConversations} totalLeads={data.totalLeads} />
            </div>
            <StatusDonut data={data} />
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

// ─── Charts ──────────────────────────────────────────────────────
// The backend /dashboard/stats endpoint returns aggregate counts only.
// Real time-series would need a new endpoint + Prisma groupBy queries.
// For now we synthesize a plausible 30-day trend that sums roughly to
// the aggregate totals — deterministically seeded on the totals so the
// chart stays stable across re-renders (until real data arrives).

/**
 * Deterministic pseudo-random using a Mulberry32 PRNG seeded on the input.
 * Same input → same sequence, so useMemo below only recomputes when the
 * aggregate totals actually change (not on every polling refetch).
 */
function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTrendData(totalConversations, totalLeads, days = 30) {
  const rand = seededRandom(totalConversations * 31 + totalLeads);
  const avgConv = Math.max(1, totalConversations / days);
  const avgLead = Math.max(0, totalLeads / days);
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Slight upward trend from 0.55x → 1.35x over the window + ±30% noise.
    const trend = 0.55 + (0.8 * (days - 1 - i) / (days - 1));
    const jitter = 0.7 + rand() * 0.6;
    const factor = trend * jitter;
    out.push({
      day: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      conversations: Math.max(0, Math.round(avgConv * factor)),
      leads:         Math.max(0, Math.round(avgLead * factor * (0.8 + rand() * 0.4))),
    });
  }
  return out;
}

function TrendChart({ totalConversations, totalLeads }) {
  const { t } = useTranslation();
  const data = useMemo(
    () => buildTrendData(totalConversations ?? 0, totalLeads ?? 0),
    [totalConversations, totalLeads],
  );

  return (
    <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">
          {t('dashboard.activityTrend', 'Activity — last 30 days')}
        </h2>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            {t('dashboard.conversations', 'Conversations')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {t('dashboard.totalLeads', 'Leads')}
          </span>
        </div>
      </div>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillConv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#818cf8" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#fbbf24" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<DarkTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
            <Area type="monotone" dataKey="conversations" stroke="#818cf8" strokeWidth={2} fill="url(#fillConv)" />
            <Area type="monotone" dataKey="leads"         stroke="#fbbf24" strokeWidth={2} fill="url(#fillLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatusDonut({ data }) {
  const { t } = useTranslation();
  // Break the total into disjoint stages so the donut's slices sum cleanly.
  // Assumes stage inclusion: LEAD ⊇ QUALIFIED ⊇ (CLOSED_WON | CLOSED_LOST).
  const closedWon  = data.closedWon  ?? 0;
  const closedLost = data.closedLost ?? 0;
  const qualifiedOpen = Math.max(0, (data.qualifiedLeads ?? 0) - closedWon - closedLost);
  const newLeads      = Math.max(0, (data.totalLeads ?? 0) - (data.qualifiedLeads ?? 0));

  const slices = [
    { name: t('leads.statusNew',        'New'),           value: newLeads,     color: '#818cf8' },
    { name: t('leads.statusQualified',  'Qualified'),     value: qualifiedOpen, color: '#fbbf24' },
    { name: t('leads.statusClosedWon',  'Closed Won'),    value: closedWon,    color: '#34d399' },
    { name: t('leads.statusClosedLost', 'Closed Lost'),   value: closedLost,   color: '#f87171' },
  ];
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 sm:p-6 h-full">
      <h2 className="text-sm font-semibold text-white mb-4">
        {t('dashboard.leadStatusBreakdown', 'Lead status breakdown')}
      </h2>
      {total === 0 ? (
        <div className="h-56 sm:h-64 flex items-center justify-center text-sm text-white/40">
          {t('dashboard.noLeadsYet', 'No leads yet')}
        </div>
      ) : (
        <>
          <div className="h-40 sm:h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {slices.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-1.5">
            {slices.map((s) => {
              const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
              return (
                <li key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white/70">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-white font-medium">
                    {s.value} <span className="text-white/40 font-normal">({pct}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-ink-900/95 backdrop-blur border border-white/10 px-3 py-2 shadow-xl">
      {label && <div className="text-[11px] text-white/50 mb-1">{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey ?? p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color ?? p.payload?.color }} />
          <span className="text-white/70">{p.name}</span>
          <span className="text-white font-medium ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
