import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getStats, getLeads, getLeadDetail } from '../controllers/dashboard.controller.js';

const router = Router();

router.use(authenticate);

router.get('/stats',        getStats);
router.get('/leads',        getLeads);
router.get('/leads/:phone', getLeadDetail);

export default router;
