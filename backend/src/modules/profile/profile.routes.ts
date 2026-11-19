import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

router.use(authenticateUser);

router.get('/me', asyncHandler(ProfileController.getMyProfile));
router.patch('/me', asyncHandler(ProfileController.updateMyProfile));
router.post('/appeals', asyncHandler(ProfileController.submitAppeal));
router.get('/:id', asyncHandler(ProfileController.getPublicProfile));

export default router;
