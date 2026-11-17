import { Router } from 'express';
import { OffersController } from './offers.controller';
import { authenticateUser } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.post('/', requireRole(Role.HOST), OffersController.createOffer);
router.get('/', OffersController.getOffers);
router.post('/:id/respond', requireRole(Role.GUEST), OffersController.respondToOffer);

export default router;
