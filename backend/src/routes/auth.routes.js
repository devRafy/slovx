import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { me } from '../controllers/auth.controller.js';

const router = Router();

// Register / login / refresh / logout / password-reset all live in Supabase now.
// The only endpoint we still own is /me — everything else the frontend calls
// via @supabase/supabase-js directly.
router.get('/me', authenticate, me);

export default router;
