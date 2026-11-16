import { Router, Request, Response } from 'express';
import { initialOffers } from '../mockData';
import { DateOffer, OfferStatus } from '../types';

const router = Router();
let offers: DateOffer[] = [...initialOffers];

// GET /api/offers - Get all offers (with optional query filter: status)
router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  if (status && typeof status === 'string') {
    const filtered = offers.filter((o) => o.status === status);
    return res.json({ success: true, count: filtered.length, data: filtered });
  }
  res.json({ success: true, count: offers.length, data: offers });
});

// GET /api/offers/:id
router.get('/:id', (req: Request, res: Response) => {
  const offer = offers.find((o) => o.id === req.params.id);
  if (!offer) {
    return res.status(404).json({ success: false, error: 'Offer not found' });
  }
  res.json({ success: true, data: offer });
});

// POST /api/offers - Create new date offer
router.post('/', (req: Request, res: Response) => {
  const {
    senderName,
    recipientName,
    title,
    activityType,
    venueName,
    venueAddress,
    dateTime,
    budgetSplit,
    estimatedCost,
    customNote
  } = req.body;

  if (!senderName || !recipientName || !venueName || !dateTime) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: senderName, recipientName, venueName, dateTime'
    });
  }

  const newOffer: DateOffer = {
    id: `offer-${Date.now()}`,
    senderName,
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    recipientName,
    recipientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: title || 'Dinner For Two',
    activityType: activityType || 'Dinner',
    venueName,
    venueAddress: venueAddress || 'Verified Public Venue',
    dateTime,
    budgetSplit: budgetSplit || 'sender_pays',
    estimatedCost: estimatedCost || '$100 - $150',
    customNote: customNote || '',
    status: 'pending',
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    isConfirmedDayBefore: false,
    createdAt: new Date().toISOString()
  };

  offers.unshift(newOffer);
  res.status(201).json({ success: true, message: 'Date offer sent successfully', data: newOffer });
});

// PATCH /api/offers/:id/status - Accept, counter, or pass
router.patch('/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, counterProposal } = req.body as { status: OfferStatus; counterProposal?: any };

  const offerIndex = offers.findIndex((o) => o.id === id);
  if (offerIndex === -1) {
    return res.status(404).json({ success: false, error: 'Offer not found' });
  }

  offers[offerIndex].status = status;
  if (counterProposal) {
    offers[offerIndex].counterProposal = counterProposal;
  }

  res.json({
    success: true,
    message: `Offer status updated to ${status}`,
    data: offers[offerIndex]
  });
});

export default router;
