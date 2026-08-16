import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const sid = req.subscriber.id;

  // 4 lead status counts collapsed into a single groupBy query.
  // Round-trips cut from 7 to 4 (leads-groupBy, guardrails-count, conversations-count, leads-aggregate).
  const [leadGroups, incidents, conversations, avgResult] = await Promise.all([
    db.lead.groupBy({
      by: ['status'],
      where: { subscriberId: sid },
      _count: { _all: true },
    }),
    db.guardrailLog.count({ where: { subscriberId: sid } }),
    db.conversation.count({ where: { subscriberId: sid } }),
    db.lead.aggregate({
      where: { subscriberId: sid, sentiment: { not: null } },
      _avg:  { sentiment: true, buyingIntent: true },
    }),
  ]);

  const byStatus = Object.fromEntries(leadGroups.map((g) => [g.status, g._count._all]));
  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);

  sendSuccess(res, {
    totalLeads:         total,
    qualified:          byStatus.QUALIFIED ?? 0,
    closedWon:          byStatus.CLOSED    ?? 0,
    lost:               byStatus.LOST      ?? 0,
    inProgress:         byStatus.LEAD      ?? 0,
    conversations,
    guardrailIncidents: incidents,
    avgSentiment:       avgResult._avg.sentiment    ? +avgResult._avg.sentiment.toFixed(2)    : 0,
    avgBuyingIntent:    avgResult._avg.buyingIntent ? +avgResult._avg.buyingIntent.toFixed(2) : 0,
  });
});

// Normalize UI-friendly status filter values to the Prisma LeadStatus enum.
// The UI shows "New / Closed - Won / Closed - Lost" but the enum is LEAD/CLOSED/LOST.
// Accept both so old clients + new UI labels both work.
const LEAD_STATUS_ALIASES = {
  NEW:         'LEAD',
  LEAD:        'LEAD',
  QUALIFIED:   'QUALIFIED',
  CLOSED_WON:  'CLOSED',
  CLOSED:      'CLOSED',
  CLOSED_LOST: 'LOST',
  LOST:        'LOST',
};

export const getLeads = asyncHandler(async (req, res) => {
  const sid    = req.subscriber.id;
  const rawStatus = req.query.status;
  const status = rawStatus ? LEAD_STATUS_ALIASES[rawStatus.toUpperCase()] : undefined;
  const page   = Math.max(1, parseInt(req.query.page) || 1);
  const limit  = Math.min(50, parseInt(req.query.limit) || 20);
  const skip   = (page - 1) * limit;

  const where = { subscriberId: sid, ...(status ? { status } : {}) };

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, customerPhone: true, customerName: true, email: true,
        status: true, sentiment: true, buyingIntent: true,
        createdAt: true, updatedAt: true,
        conversation: { select: { stage: true, updatedAt: true } },
      },
    }),
    db.lead.count({ where }),
  ]);

  sendSuccess(res, { leads, total, page, limit });
});

export const getConversations = asyncHandler(async (req, res) => {
  const sid = req.subscriber.id;

  const conversations = await db.conversation.findMany({
    where:   { subscriberId: sid },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      customerPhone: true,
      messages: true,
      stage: true,
      updatedAt: true,
      lead: { select: { customerName: true, status: true } },
    },
  });

  const summaries = conversations.map((c) => {
    const msgs = Array.isArray(c.messages) ? c.messages : [];
    const last = msgs[msgs.length - 1];
    return {
      id:            c.id,
      customerPhone: c.customerPhone,
      customerName:  c.lead?.customerName ?? null,
      status:        c.lead?.status ?? 'LEAD',
      stage:         c.stage,
      lastMessage:   last?.content ?? null,
      lastRole:      last?.role ?? null,
      lastAt:        last?.timestamp ?? c.updatedAt,
      messageCount:  msgs.length,
    };
  });

  sendSuccess(res, summaries);
});

export const getConversationMessages = asyncHandler(async (req, res) => {
  const sid = req.subscriber.id;
  const { phone } = req.params;

  const conversation = await db.conversation.findFirst({
    where: { subscriberId: sid, customerPhone: phone },
    select: {
      id: true,
      customerPhone: true,
      messages: true,
      stage: true,
      humanTakeover: true,
      updatedAt: true,
      lead: { select: { customerName: true, status: true } },
    },
  });

  sendSuccess(res, conversation);
});

// PATCH /api/dashboard/conversations/:phone/takeover  { enabled: boolean }
// Toggles per-conversation human takeover. When enabled, AI stops replying to this customer.
export const toggleConversationTakeover = asyncHandler(async (req, res) => {
  const sid = req.subscriber.id;
  const { phone } = req.params;
  const enabled = req.body?.enabled;
  if (typeof enabled !== 'boolean') return sendError(res, 'body.enabled must be a boolean', 400);

  const updated = await db.conversation.updateMany({
    where: { subscriberId: sid, customerPhone: phone },
    data:  { humanTakeover: enabled },
  });
  if (updated.count === 0) return sendError(res, 'Conversation not found', 404);

  sendSuccess(res, { humanTakeover: enabled }, enabled ? 'You are now handling this chat' : 'AI has resumed on this chat');
});

export const getLeadDetail = asyncHandler(async (req, res) => {
  const sid   = req.subscriber.id;
  const { phone } = req.params;

  const [lead, conversation, incidents] = await Promise.all([
    db.lead.findFirst({
      where: { subscriberId: sid, customerPhone: phone },
    }),
    db.conversation.findFirst({
      where: { subscriberId: sid, customerPhone: phone },
      select: { messages: true, stage: true, updatedAt: true },
    }),
    db.guardrailLog.findMany({
      where:   { subscriberId: sid, customerPhone: phone },
      orderBy: { createdAt: 'desc' },
      take:    10,
    }),
  ]);

  sendSuccess(res, { lead, conversation, incidents });
});
