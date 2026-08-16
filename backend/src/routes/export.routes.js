import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { leadsCsv, conversationsCsv, leadsPdf } from '../controllers/export.controller.js';

const router = Router();
router.use(authenticate);

router.get('/leads.csv',          leadsCsv);
router.get('/leads.pdf',          leadsPdf);
router.get('/conversations.csv',  conversationsCsv);

export default router;
