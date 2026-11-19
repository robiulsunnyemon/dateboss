import { Router } from 'express';
import { OffersController } from './offers.controller';
import { authenticateUser } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/errorHandler';
import { validateBody } from '../../middleware/validate';
import {
  createOfferSchema,
  hostRespondCounterSchema,
  respondOfferSchema,
  reviewOfferSchema,
} from '../../validators/schemas';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

// Host creates an offer
router.post(
  '/',
  requireRole(Role.HOST),
  validateBody(createOfferSchema),
  asyncHandler(OffersController.createOffer)
);

// Role-adaptive offers list
router.get('/', asyncHandler(OffersController.getOffers));

// Guest asks for an offer (Wishlist broadcast to hosts)
router.post('/ask', requireRole(Role.GUEST), asyncHandler(OffersController.askForOffer));

// Guest responds to an offer (ACCEPT, COUNTER, PASS)
router.post(
  '/:id/respond',
  requireRole(Role.GUEST),
  validateBody(respondOfferSchema),
  asyncHandler(OffersController.respondToOffer)
);

// Host responds to a Guest's counter-offer
router.post(
  '/:id/host-respond',
  requireRole(Role.HOST),
  validateBody(hostRespondCounterSchema),
  asyncHandler(OffersController.hostRespondToCounter)
);

// Withdraw offer or counter
router.post('/:id/withdraw', asyncHandler(OffersController.withdrawOffer));

// Confirm attendance check-in
router.post('/:id/checkin', asyncHandler(OffersController.confirmAttendance));

// Submit date review and star rating
router.post(
  '/:id/review',
  validateBody(reviewOfferSchema),
  asyncHandler(OffersController.submitReview)
);

export default router;
