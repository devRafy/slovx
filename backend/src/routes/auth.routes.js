import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  register, login, googleLogin, forgotPassword, resetPassword,
  refresh, logout, me,
  registerSchema, loginSchema, googleLoginSchema,
  forgotPasswordSchema, resetPasswordSchema,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register',         authLimiter, validate(registerSchema),        register);
router.post('/login',            authLimiter, validate(loginSchema),           login);
router.post('/google',           authLimiter, validate(googleLoginSchema),     googleLogin);
router.post('/forgot-password',  authLimiter, validate(forgotPasswordSchema),  forgotPassword);
router.post('/reset-password',   authLimiter, validate(resetPasswordSchema),   resetPassword);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/me',        authenticate, me);

export default router;
