import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/social', AuthController.socialAuth);
router.get('/me', authenticateUser, AuthController.getCurrentUser);

export default router;
