import { db } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const sid = req.subscriber.id;

  const [total, qualified, closed, lost, incidents, conversations] = await Promise.all([
    db.lead.count({ where: { subscriberId: sid } }),
    db.lead.count({ where: { subscriberId: sid, status: 'QUALIFIED' } }),
    db.lead.count({ where: { subscriberId: sid, status: 'CLOSED' } }),
    db.lead.count({ where: { subscriberId: sid, status: 'LOST' } }),
    db.guardrailLog.count({ where: { subscriberId: sid } }),
    db.conversation.count({ where: { subscriberId: sid } }),
  ]);

  // Avg sentiment & buying intent from leads
  const avgResult = await db.lead.aggregate({
    where: { subscriberId: sid, sentiment: { not: null } },
    _avg:  { sentiment: true, buyingIntent: true },
  });

  sendSuccess(res, {
    totalLeads:      total,
    qualified,
    closedWon:       closed,
    lost,
    inProgress:      total - qualified - closed - lost,
    conversations,
    guardrailIncidents: incidents,
    avgSentiment:    avgResult._avg.sentiment   ? +avgResult._avg.sentiment.toFixed(2)   : 0,
    avgBuyingIntent: avgResult._avg.buyingIntent ? +avgResult._avg.buyingIntent.toFixed(2) : 0,
  });
});

export const getLeads = asyncHandler(async (req, res) => {
  const sid    = req.subscriber.id;
  const status = req.query.status;
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
