import { asyncHandler } from '../utils/asyncHandler.js';
import { exportLeadsCsv, exportConversationsCsv, exportLeadsPdf } from '../services/export.service.js';

// GET /api/export/leads.csv
export const leadsCsv = asyncHandler(async (req, res) => {
  const csv = await exportLeadsCsv(req.subscriber.id);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${today()}.csv"`);
  res.send(csv);
});

// GET /api/export/conversations.csv
export const conversationsCsv = asyncHandler(async (req, res) => {
  const csv = await exportConversationsCsv(req.subscriber.id);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="conversations-${today()}.csv"`);
  res.send(csv);
});

// GET /api/export/leads.pdf
export const leadsPdf = asyncHandler(async (req, res) => {
  const buffer = await exportLeadsPdf(req.subscriber.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${today()}.pdf"`);
  res.send(buffer);
});

const today = () => new Date().toISOString().slice(0, 10);
