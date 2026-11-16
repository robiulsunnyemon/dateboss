import { Router, Request, Response } from 'express';
import { venues } from '../mockData';

const router = Router();

// GET /api/venues
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, count: venues.length, data: venues });
});

// GET /api/venues/:id
router.get('/:id', (req: Request, res: Response) => {
  const venue = venues.find((v) => v.id === req.params.id);
  if (!venue) {
    return res.status(404).json({ success: false, error: 'Venue not found' });
  }
  res.json({ success: true, data: venue });
});

export default router;
