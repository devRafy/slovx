import { Router } from 'express';
import { verifyWebhook, receiveWebhook } from '../controllers/webhook.controller.js';

const router = Router();

// Meta calls GET to verify the webhook endpoint
router.get('/',  verifyWebhook);

// Meta calls POST to deliver inbound messages
router.post('/', receiveWebhook);

export default router;
