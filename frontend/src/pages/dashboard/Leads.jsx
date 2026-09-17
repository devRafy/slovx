import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardApi, downloadExport } from '../../api/dashboard.api.js';
import { Search, ChevronLeft, ChevronRight, User, FileText, FileSpreadsheet } from 'lucide-react';

const STATUSES = ['ALL', 'LEAD', 'QUALIFIED', 'CLOSED', 'LOST'];

const STATUS_STYLES = {
  LEAD:      'bg-white/10 text-white/70',
  QUALIFIED: 'bg-amber-500/15 text-amber-300',
  CLOSED:    'bg-green-500/15 text-green-300',
  LOST:      'bg-red-500/15 text-red-300',
};

// Translation keys — resolved via t() at render time so language switches propagate live.
const STATUS_LABEL_KEYS = {
  ALL:       'leads.statusAll',
  LEAD:      'leads.statusNew',
  QUALIFIED: 'leads.statusQualified',
  CLOSED:    'leads.statusClosedWon',
  LOST:      'leads.statusClosedLost',
};

export default function Leads() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 15;

  const fmtStatus = (s) => t(STATUS_LABEL_KEYS[s] ?? '') || s;

  const { data, isLoading } = useQuery({
    queryKey: ['leads', status, page],
    queryFn: () =>
      dashboardApi
        .getLeads({ status: status === 'ALL' ? undefined : status, page, limit })
        .then((r) => r.data.data),
    keepPreviousData: true,
  });

  const leads = data?.leads ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const filtered = search.trim()
    ? leads.filter(
        (l) =>
          l.customerPhone.includes(search) ||
          (l.customerName ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : leads;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">{t('leads.title')}</h1>
          <p className="text-xs sm:text-sm text-white/50 mt-0.5">{t('leads.totalCount', { count: total })}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadExport('/export/leads.csv', `leads-${today}.csv`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
            title="Download all leads as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => downloadExport('/export/leads.pdf', `leads-${today}.pdf`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
            title="Download leads report as PDF"
          >
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('leads.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {fmtStatus(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Card list — mobile only */}
      <div className="sm:hidden space-y-2 mb-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-ink-800/60 rounded-xl border border-white/10 p-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-ink-800/60 rounded-xl border border-white/10 py-10 text-center text-sm text-white/40">
            {t('leads.noResults')}
          </div>
        )}
        {!isLoading &&
          filtered.map((lead) => (
            <Link
              key={lead.id}
              to={`/leads/${encodeURIComponent(lead.customerPhone)}`}
              className="block bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 p-4 active:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-semibold shrink-0">
                    {lead.customerName?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">{lead.customerName ?? t('leads.unknown')}</div>
                    <div className="text-xs text-white/50 font-mono truncate">{lead.customerPhone}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${STATUS_STYLES[lead.status] ?? ''}`}>
                  {fmtStatus(lead.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <div className="text-[10px] text-white/40 mb-0.5">Sentiment</div>
                  <ScoreBar value={lead.sentiment} color="bg-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-white/40 mb-0.5">Intent</div>
                  <ScoreBar value={lead.buyingIntent} color="bg-brand-500" />
                </div>
                <div className="text-[10px] text-white/40 shrink-0">
                  {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '—'}
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Table — desktop / tablet */}
      <div className="hidden sm:block bg-ink-800/60 backdrop-blur rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colContact')}</th>
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colPhone')}</th>
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colStatus')}</th>
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colSentiment')}</th>
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colIntent')}</th>
              <th className="text-left px-5 py-3 font-medium text-white/60">{t('leads.colUpdated')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 bg-white/5 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-white/40">
                  {t('leads.noResults')}
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/leads/${encodeURIComponent(lead.customerPhone)}`}
                      className="flex items-center gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-semibold shrink-0">
                        {lead.customerName?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-medium text-white group-hover:text-brand-400 transition-colors">
                        {lead.customerName ?? t('leads.unknown')}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-white/60 font-mono text-xs">{lead.customerPhone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[lead.status] ?? ''}`}>
                      {fmtStatus(lead.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <ScoreBar value={lead.sentiment} color="bg-purple-400" />
                  </td>
                  <td className="px-5 py-3.5">
                    <ScoreBar value={lead.buyingIntent} color="bg-brand-500" />
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">
                    {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

      </div>

      {/* Pagination — shared by mobile card list + desktop table */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-xs text-white/40">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </PageBtn>
            <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ value, color }) {
  if (value == null) return <span className="text-white/30 text-xs">—</span>;
  const pct = Math.min(100, Math.max(0, value * 10));
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-white/60">{value?.toFixed(1)}</span>
    </div>
  );
}

function PageBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/60 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
