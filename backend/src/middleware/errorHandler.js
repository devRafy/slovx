import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  if (env.NODE_ENV === 'development') console.error(err.stack);

  // Prisma connection errors
  if (err.code === 'P1001' || err.code === 'P1017' || err.code === 'P1002') {
    return res.status(503).json({ success: false, message: 'Database unavailable. Please try again shortly.' });
  }
  // Prisma query errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: `A record with this ${err.meta?.target?.join(', ')} already exists.`,
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
