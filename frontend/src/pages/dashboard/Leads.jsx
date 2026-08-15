import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard.api.js';
import { Search, ChevronLeft, ChevronRight, TrendingUp, User } from 'lucide-react';

// Uses the actual Prisma LeadStatus enum values.
// Display labels via fmtStatus() below (LEAD → "New", CLOSED → "Closed - Won", etc.)
const STATUSES = ['ALL', 'LEAD', 'QUALIFIED', 'CLOSED', 'LOST'];

const STATUS_STYLES = {
  LEAD:      'bg-gray-100 text-gray-600',
  QUALIFIED: 'bg-amber-100 text-amber-700',
  CLOSED:    'bg-green-100 text-green-700',
  LOST:      'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  LEAD:      'New',
  QUALIFIED: 'Qualified',
  CLOSED:    'Closed - Won',
  LOST:      'Closed - Lost',
};

export default function Leads() {
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 15;

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

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Leads</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{total} total leads across all stages</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'All' : fmtStatus(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Card list — mobile only */}
      <div className="sm:hidden space-y-2 mb-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        {!isLoading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-10 text-center text-sm text-gray-400">
            No leads found
          </div>
        )}
        {!isLoading &&
          filtered.map((lead) => (
            <Link
              key={lead.id}
              to={`/dashboard/leads/${encodeURIComponent(lead.customerPhone)}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
                    {lead.customerName?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{lead.customerName ?? 'Unknown'}</div>
                    <div className="text-xs text-gray-500 font-mono truncate">{lead.customerPhone}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${STATUS_STYLES[lead.status] ?? ''}`}>
                  {fmtStatus(lead.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400 mb-0.5">Sentiment</div>
                  <ScoreBar value={lead.sentiment} color="bg-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400 mb-0.5">Intent</div>
                  <ScoreBar value={lead.buyingIntent} color="bg-brand-500" />
                </div>
                <div className="text-[10px] text-gray-400 shrink-0">
                  {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : '—'}
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Table — desktop / tablet */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Contact</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Sentiment</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Intent</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  No leads found
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/dashboard/leads/${encodeURIComponent(lead.customerPhone)}`}
                      className="flex items-center gap-2.5 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {lead.customerName?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                        {lead.customerName ?? 'Unknown'}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{lead.customerPhone}</td>
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
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
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
          <span className="text-xs text-gray-400">
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
  if (value == null) return <span className="text-gray-300 text-xs">—</span>;
  const pct = Math.min(100, Math.max(0, value * 10));
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500">{value?.toFixed(1)}</span>
    </div>
  );
}

function PageBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function fmtStatus(s) {
  return STATUS_LABELS[s] ?? s;
}
