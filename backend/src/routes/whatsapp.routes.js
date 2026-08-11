import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  connectWhatsApp, disconnectWhatsApp, getStatus,
} from '../controllers/whatsapp.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',           getStatus);
router.post('/connect',   connectWhatsApp);
router.delete('/connect', disconnectWhatsApp);

export default router;
