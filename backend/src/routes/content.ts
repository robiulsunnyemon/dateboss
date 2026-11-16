import { Router, Request, Response } from 'express';
import { testimonials, faqs } from '../mockData';

const router = Router();

// GET /api/content/testimonials
router.get('/testimonials', (_req: Request, res: Response) => {
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// GET /api/content/faqs
router.get('/faqs', (_req: Request, res: Response) => {
  res.json({ success: true, count: faqs.length, data: faqs });
});

export default router;
