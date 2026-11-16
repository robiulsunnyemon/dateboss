import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import offersRouter from './routes/offers';
import venuesRouter from './routes/venues';
import contentRouter from './routes/content';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/offers', offersRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/content', contentRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check / welcome
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'The Date Inc API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[TheDateInc Backend] Server running at http://localhost:${PORT}`);
});
