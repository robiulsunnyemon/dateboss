import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticateUser } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/errorHandler';
import { validateBody } from '../../middleware/validate';
import {
  accountStatusSchema,
  moderationActionSchema,
  updatePlanSchema,
  updateReportSchema,
} from '../../validators/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateUser);
router.use(requireRole(Role.ADMIN));

router.get('/verifications', asyncHandler(AdminController.getVerificationQueue));
router.post('/verifications/:id/review', asyncHandler(AdminController.reviewVerification));
router.get('/metrics', asyncHandler(AdminController.getPlatformMetrics));
router.get('/members', asyncHandler(AdminController.getMembers));
router.post(
  '/accounts/:id/status',
  validateBody(accountStatusSchema),
  asyncHandler(AdminController.updateAccountStatus)
);
router.get('/plans', asyncHandler(AdminController.getPlans));
router.put('/plans/:id', validateBody(updatePlanSchema), asyncHandler(AdminController.updatePlan));
router.get('/reports', asyncHandler(AdminController.getReports));
router.patch('/reports/:id', validateBody(updateReportSchema), asyncHandler(AdminController.updateReport));
router.get('/moderation/threads', asyncHandler(AdminController.getModerationThreads));
router.post(
  '/moderation/threads/:offerId/action',
  validateBody(moderationActionSchema),
  asyncHandler(AdminController.moderateThread)
);
router.get('/appeals', asyncHandler(AdminController.getAppeals));
router.patch('/appeals/:id', asyncHandler(AdminController.resolveAppeal));

export default router;
