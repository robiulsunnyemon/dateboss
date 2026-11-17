import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Multi-Role RBAC Modules
import authRouter from './modules/auth/auth.routes';
import onboardingRouter from './modules/onboarding/onboarding.routes';
import discoverRouter from './modules/discover/discover.routes';
import dateOffersRouter from './modules/offers/offers.routes';
import adminRouter from './modules/admin/admin.routes';

// Existing legacy / utility routes
import venuesRouter from './routes/venues';
import contentRouter from './routes/content';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Core Multi-Role API Routes
app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/discover', discoverRouter);
app.use('/api/offers', dateOffersRouter);
app.use('/api/admin', adminRouter);

// Utility / Legacy Routes
app.use('/api/venues', venuesRouter);
app.use('/api/content', contentRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TheDateBoss Multi-Role Backend API',
    database: 'PostgreSQL (Prisma ORM)',
    roles: ['ADMIN', 'HOST', 'GUEST'],
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[TheDateBoss Backend] Server running at http://localhost:${PORT}`);
});

export default app;
