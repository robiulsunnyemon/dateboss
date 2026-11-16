import { Router, Request, Response } from 'express';
import { dashboardMetrics } from '../mockData';

const router = Router();

// GET /api/dashboard/metrics
router.get('/metrics', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      ...dashboardMetrics,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /api/dashboard/chart-data
router.get('/chart-data', (_req: Request, res: Response) => {
  const weeklyTrends = [
    { day: 'Mon', sent: 180, accepted: 135, noShows: 2 },
    { day: 'Tue', sent: 210, accepted: 160, noShows: 1 },
    { day: 'Wed', sent: 290, accepted: 220, noShows: 3 },
    { day: 'Thu', sent: 380, accepted: 290, noShows: 2 },
    { day: 'Fri', sent: 540, accepted: 420, noShows: 4 },
    { day: 'Sat', sent: 620, accepted: 495, noShows: 3 },
    { day: 'Sun', sent: 410, accepted: 310, noShows: 1 }
  ];

  const categoryBreakdown = [
    { name: 'Dinner For Two', percentage: 48, count: 6854 },
    { name: 'Cocktails & Jazz', percentage: 26, count: 3712 },
    { name: 'Art & Exhibitions', percentage: 14, count: 1999 },
    { name: 'Coffee & Walks', percentage: 12, count: 1715 }
  ];

  res.json({
    success: true,
    data: {
      weeklyTrends,
      categoryBreakdown
    }
  });
});

export default router;
