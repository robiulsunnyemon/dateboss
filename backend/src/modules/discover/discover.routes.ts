import { Router } from 'express';
import { DiscoverController } from './discover.controller';
import jwt from 'jsonwebtoken';
import { AuthUserPayload } from '../../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'thedateboss_jwt_secret_dev_key_2026';

// Optional auth middleware: if token present, parse role; otherwise default to HOST viewing guests
const optionalAuth = (req: any, _res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
      req.user = decoded;
    } catch (e) {
      // ignore invalid token, proceed as guest
    }
  }
  next();
};

router.get('/', optionalAuth, DiscoverController.getDiscoverFeed);

export default router;
