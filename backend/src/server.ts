import http from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Core Multi-Role RBAC Modules
import authRouter from './modules/auth/auth.routes';
import onboardingRouter from './modules/onboarding/onboarding.routes';
import discoverRouter from './modules/discover/discover.routes';
import dateOffersRouter from './modules/offers/offers.routes';
import adminRouter from './modules/admin/admin.routes';
import profileRouter from './modules/profile/profile.routes';
import messagesRouter from './modules/messages/messages.routes';
import reportsRouter from './modules/reports/reports.routes';
import uploadRouter from './modules/upload/upload.routes';
import billingRouter from './modules/billing/billing.routes';

// Utility / Content routes
import venuesRouter from './routes/venues';
import contentRouter from './routes/content';
import dashboardRouter from './routes/dashboard';

// Infrastructure
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initSocketServer } from './config/socket';
import { startOfferExpiryJob } from './modules/offers/offers.cron';
import { isCloudinaryConfigured } from './config/cloudinary';
import { isStripeConfigured } from './config/stripe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const envOrigins = (process.env.FRONTEND_URL || process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envOrigins,
  process.env.DASHBOARD_URL || '',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
].filter(Boolean);

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Preserve raw body for Stripe webhook verification if needed
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '2mb' }));

// Core Multi-Role API Routes
app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/profile', profileRouter);
app.use('/api/discover', discoverRouter);
app.use('/api/offers', dateOffersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/billing', billingRouter);
app.use('/api/admin', adminRouter);

// Utility Routes
app.use('/api/venues', venuesRouter);
app.use('/api/content', contentRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TheDateBoss Multi-Role Backend API',
    database: 'PostgreSQL (Prisma ORM)',
    realtime: 'Socket.io enabled',
    integrations: {
      cloudinary: isCloudinaryConfigured(),
      stripe: isStripeConfigured(),
    },
    roles: ['ADMIN', 'HOST', 'GUEST'],
    timestamp: new Date().toISOString(),
  });
});

// 404 & Global Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = http.createServer(app);
initSocketServer(httpServer, allowedOrigins);

if (process.env.NODE_ENV !== 'test') {
  startOfferExpiryJob();
  httpServer.listen(PORT, () => {
    console.log(`[TheDateBoss Backend] HTTP + Socket.io server running at http://localhost:${PORT}`);
  });
}

export { app, httpServer };
export default app;
