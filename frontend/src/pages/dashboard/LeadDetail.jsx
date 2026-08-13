import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard.api.js';
import { ArrowLeft, Phone, Mail, Star, Zap, MessageSquare } from 'lucide-react';

const STATUS_STYLES = {
  NEW:         { bg: 'bg-gray-100',   text: 'text-gray-700'  },
  QUALIFIED:   { bg: 'bg-amber-100',  text: 'text-amber-700' },
  CLOSED_WON:  { bg: 'bg-green-100',  text: 'text-green-700' },
  CLOSED_LOST: { bg: 'bg-red-100',    text: 'text-red-700'   },
};

export default function LeadDetail() {
  const { phone } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lead-detail', phone],
    queryFn: () => dashboardApi.getLeadDetail(phone).then((r) => r.data.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState phone={phone} />;

  const { lead, conversation } = data;
  const messages = conversation?.messages ?? [];
  const style = STATUS_STYLES[lead.status] ?? STATUS_STYLES.NEW;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full">
      <Link
        to="/dashboard/leads"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
            {lead.customerName?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{lead.customerName ?? 'Unknown'}</h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lead.customerPhone}</span>
              </span>
              {lead.email && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shrink-0 ${style.bg} ${style.text}`}>
          {fmtStatus(lead.status)}
        </span>
      </div>

      {/* Score cards — stack 1-col on mobile, 3-col from sm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <ScoreCard
          label="Sentiment"
          value={lead.sentiment}
          icon={Star}
          color="purple"
        />
        <ScoreCard
          label="Buying intent"
          value={lead.buyingIntent}
          icon={Zap}
          color="brand"
        />
        <ScoreCard
          label="Messages"
          value={messages.length}
          icon={MessageSquare}
          color="blue"
          raw
        />
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Conversation history</h2>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet</div>
        ) : (
          <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 text-xs text-gray-400 flex flex-col sm:flex-row gap-1 sm:gap-4">
        {lead.createdAt && <span>First contact: {new Date(lead.createdAt).toLocaleString()}</span>}
        {lead.updatedAt && <span>Last updated: {new Date(lead.updatedAt).toLocaleString()}</span>}
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'assistant';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isAI
            ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
            : 'bg-brand-600 text-white rounded-tr-sm'
        }`}
      >
        {msg.content}
        {msg.timestamp && (
          <div className={`text-xs mt-1 ${isAI ? 'text-gray-400' : 'text-brand-200'}`}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ label, value, icon: Icon, color, raw }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-600',
    brand:  'bg-brand-50 text-brand-600',
    blue:   'bg-blue-50 text-blue-600',
  };
  const display = raw ? (value ?? 0) : value != null ? `${value.toFixed(1)} / 10` : '—';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900">{display}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex-1 p-8">
      <div className="animate-pulse space-y-4 max-w-4xl">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-100 rounded w-40" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function ErrorState({ phone }) {
  return (
    <div className="flex-1 p-8 text-center">
      <Link to="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>
      <p className="text-gray-400">Lead not found for {decodeURIComponent(phone)}</p>
    </div>
  );
}

function fmtStatus(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
