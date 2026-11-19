import { Router } from 'express';
import { BillingController } from './billing.controller';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

router.get('/plans', asyncHandler(BillingController.getPlans));
router.get('/status', authenticateUser, asyncHandler(BillingController.getBillingStatus));
router.post('/checkout', authenticateUser, asyncHandler(BillingController.createCheckoutSession));
router.post('/confirm-session', authenticateUser, asyncHandler(BillingController.confirmCheckoutSession));
router.post('/webhook', asyncHandler(BillingController.handleWebhook));

export default router;
