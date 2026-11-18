import { Router } from 'express';
import { OffersController } from './offers.controller';
import { authenticateUser } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

// Host creates an offer
router.post('/', requireRole(Role.HOST), OffersController.createOffer);

// Role-adaptive offers list (Host gets Sent, Guest gets Received)
router.get('/', OffersController.getOffers);

// Guest asks for an offer (Wishlist broadcast to hosts)
router.post('/ask', requireRole(Role.GUEST), OffersController.askForOffer);

// Guest responds to an offer (ACCEPT, COUNTER, PASS)
router.post('/:id/respond', requireRole(Role.GUEST), OffersController.respondToOffer);

// Withdraw offer or counter
router.post('/:id/withdraw', OffersController.withdrawOffer);

// Confirm attendance and release escrow
router.post('/:id/checkin', OffersController.confirmAttendance);

// Submit date review and star rating
router.post('/:id/review', OffersController.submitReview);

export default router;
