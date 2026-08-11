import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getConfig, upsertConfig, getOnboardingStatus,
  businessConfigSchema,
} from '../controllers/business.controller.js';

const router = Router();

router.use(authenticate);

router.get('/',          getConfig);
router.put('/',          validate(businessConfigSchema), upsertConfig);
router.get('/onboarding-status', getOnboardingStatus);

export default router;
