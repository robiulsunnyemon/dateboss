import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './auth.controller';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { validateBody } from '../../middleware/validate';
import { loginSchema, registerSchema, socialAuthSchema } from '../../validators/schemas';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

router.post('/register', authLimiter, validateBody(registerSchema), asyncHandler(AuthController.register));
router.post('/login', authLimiter, validateBody(loginSchema), asyncHandler(AuthController.login));
router.post('/social', authLimiter, validateBody(socialAuthSchema), asyncHandler(AuthController.socialAuth));
router.get('/me', authenticateUser, asyncHandler(AuthController.getCurrentUser));

export default router;
