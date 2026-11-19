import { Router, Request, Response } from 'express';
import { prisma } from '../config/db';
import { venues as mockVenues } from '../mockData';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/venues - Uses PostgreSQL Venue table with curated fallback
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const dbVenues = await prisma.venue.findMany({
      where: { isCurated: true },
      orderBy: { name: 'asc' },
    });

    const data = dbVenues.length > 0 ? dbVenues : mockVenues;
    res.json({ success: true, count: data.length, data });
  })
);

// GET /api/venues/:id
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const dbVenue = await prisma.venue.findUnique({ where: { id: req.params.id } });
    const venue = dbVenue || mockVenues.find((v) => v.id === req.params.id);
    if (!venue) {
      res.status(404).json({ success: false, message: 'Venue not found' });
      return;
    }
    res.json({ success: true, data: venue });
  })
);

export default router;
