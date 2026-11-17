import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticateUser } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateUser);
router.use(requireRole(Role.ADMIN));

router.get('/verifications', AdminController.getVerificationQueue);
router.post('/verifications/:id/review', AdminController.reviewVerification);
router.get('/metrics', AdminController.getPlatformMetrics);

export default router;
