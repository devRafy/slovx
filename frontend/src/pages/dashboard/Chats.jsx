import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, downloadExport } from '../../api/dashboard.api.js';
import { MessageSquare, User, Bot, RefreshCw, Search, ArrowLeft, Hand, Loader2, FileSpreadsheet } from 'lucide-react';

const STAGE_STYLES = {
  QUALIFICATION: { bg: 'bg-gray-100',   text: 'text-gray-600'  },
  NEGOTIATION:   { bg: 'bg-amber-100',  text: 'text-amber-700' },
  CLOSED:        { bg: 'bg-green-100',  text: 'text-green-700' },
};

export default function Chats() {
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [search, setSearch] = useState('');

  // Poll every 5s so new inbound messages appear
  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn:  () => dashboardApi.getConversations().then((r) => r.data.data),
    refetchInterval: 5000,
  });

  // Auto-select first conversation on desktop (>= sm breakpoint). On mobile,
  // let the user tap to choose — auto-select would hide the list they just landed on.
  useEffect(() => {
    if (!selectedPhone && conversations.length > 0 && window.innerWidth >= 640) {
      setSelectedPhone(conversations[0].customerPhone);
    }
  }, [conversations, selectedPhone]);

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.customerPhone.toLowerCase().includes(q) ||
      (c.customerName?.toLowerCase() ?? '').includes(q) ||
      (c.lastMessage?.toLowerCase() ?? '').includes(q)
    );
  });

  // On mobile: show list OR thread (never both). On sm+: show both side-by-side.
  const showListOnMobile = !selectedPhone;

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)] md:h-screen">
      {/* Conversation list — full width on mobile when no chat selected, sidebar otherwise */}
      <aside
        className={`
          ${showListOnMobile ? 'flex' : 'hidden'} sm:flex
          w-full sm:w-80 border-r border-gray-200 bg-white flex-col shrink-0
        `}
      >
        <header className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">Chats</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadExport(
                  '/export/conversations.csv',
                  `conversations-${new Date().toISOString().slice(0, 10)}.csv`,
                )}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Export all conversations as CSV"
                aria-label="Export chats"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={() => refetch()}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Refresh"
                aria-label="Refresh chats"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-sm text-gray-400 py-10">Loading…</div>
          ) : filtered.length === 0 ? (
            <EmptyList hasSearch={!!search} />
          ) : (
            filtered.map((c) => (
              <ConversationRow
                key={c.id}
                conv={c}
                active={c.customerPhone === selectedPhone}
                onClick={() => setSelectedPhone(c.customerPhone)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Thread — hidden on mobile when no chat selected */}
      <section
        className={`
          ${selectedPhone ? 'flex' : 'hidden'} sm:flex
          flex-1 flex-col bg-gray-50 min-w-0
        `}
      >
        {selectedPhone ? (
          <ChatThread phone={selectedPhone} onBack={() => setSelectedPhone(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center px-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Select a chat to view messages</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ConversationRow({ conv, active, onClick }) {
  const stage = STAGE_STYLES[conv.stage] ?? STAGE_STYLES.QUALIFICATION;
  const displayName = conv.customerName || conv.customerPhone;
  const preview = conv.lastMessage ?? 'No messages yet';
  const isFromAI = conv.lastRole === 'assistant';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors ${
        active ? 'bg-brand-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
          {displayName[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{displayName}</span>
            <span className="text-xs text-gray-400 shrink-0">{formatTime(conv.lastAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isFromAI && <span className="text-xs text-brand-600 font-medium shrink-0">AI:</span>}
            <p className="text-xs text-gray-500 truncate">{preview}</p>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${stage.bg} ${stage.text}`}>
              {conv.stage}
            </span>
            <span className="text-[10px] text-gray-400">{conv.messageCount} msg{conv.messageCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatThread({ phone, onBack }) {
  const scrollRef = useRef(null);
  const qc = useQueryClient();
  const [toggling, setToggling] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['conversation', phone],
    queryFn:  () => dashboardApi.getConversationBy(phone).then((r) => r.data.data),
    refetchInterval: 3000,
  });

  const messages = data?.messages ?? [];
  const humanTakeover = !!data?.humanTakeover;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleToggleTakeover = async () => {
    setToggling(true);
    try {
      await dashboardApi.toggleTakeover(phone, !humanTakeover);
      qc.invalidateQueries({ queryKey: ['conversation', phone] });
    } catch {
      // Silent — polling will re-fetch state
    } finally {
      setToggling(false);
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading…</div>;
  }

  return (
    <>
      <header className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back button — mobile only */}
          <button
            onClick={onBack}
            className="sm:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700"
            aria-label="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold shrink-0">
            {(data?.lead?.customerName || phone)[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {data?.lead?.customerName || phone}
            </div>
            <div className="text-xs text-gray-500 truncate">{phone}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {data?.stage && (
            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded font-medium ${
              STAGE_STYLES[data.stage]?.bg ?? 'bg-gray-100'
            } ${STAGE_STYLES[data.stage]?.text ?? 'text-gray-600'}`}>
              {data.stage}
            </span>
          )}
          <button
            onClick={handleToggleTakeover}
            disabled={toggling}
            title={humanTakeover ? 'AI is paused — click to hand back to AI' : 'Take over this chat manually'}
            className={`flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
              humanTakeover
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            } disabled:opacity-60`}
          >
            {toggling
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Hand className="w-3.5 h-3.5" />}
            {humanTakeover ? 'You have this' : 'Take over'}
          </button>
        </div>
      </header>
      {humanTakeover && (
        <div className="px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800">
          AI is paused for this chat. Reply to the customer directly on your WhatsApp — Xavier won't auto-respond.
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-10">
            No messages in this conversation yet.
          </div>
        ) : (
          messages.map((m, i) => <MessageBubble key={i} msg={m} />)
        )}
      </div>
    </>
  );
}

function MessageBubble({ msg }) {
  const isCustomer = msg.role === 'user';
  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-md flex ${isCustomer ? 'flex-row' : 'flex-row-reverse'} gap-2 items-end`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          isCustomer ? 'bg-gray-200 text-gray-600' : 'bg-brand-600 text-white'
        }`}>
          {isCustomer ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
        </div>
        <div>
          <div className={`px-3 py-2 rounded-2xl text-sm ${
            isCustomer
              ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
              : 'bg-brand-600 text-white rounded-tr-sm'
          }`}>
            {msg.content}
          </div>
          <div className={`text-[10px] text-gray-400 mt-1 ${isCustomer ? 'text-left ml-1' : 'text-right mr-1'}`}>
            {formatTime(msg.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyList({ hasSearch }) {
  return (
    <div className="text-center py-12 px-6">
      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-500">
        {hasSearch ? 'No chats match your search' : 'No conversations yet'}
      </p>
      {!hasSearch && (
        <p className="text-xs text-gray-400 mt-1">
          Chats will appear here once customers message your WhatsApp number.
        </p>
      )}
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
