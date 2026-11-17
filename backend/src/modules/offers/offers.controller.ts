import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { Role, OfferStatus } from '@prisma/client';

export class OffersController {
  // POST /api/offers - Host creates a date offer for a Guest of Honor
  static async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const hostId = req.user!.id;
      const { guestId, activityType, venueName, venueAddress, proposedDateTime, personalMessage } = req.body;

      if (!guestId || !activityType || !venueName) {
        res.status(400).json({ success: false, message: 'guestId, activityType, and venueName are required' });
        return;
      }

      // Check if target user is indeed a GUEST
      const guest = await prisma.user.findUnique({ where: { id: guestId } });
      if (!guest || guest.role !== Role.GUEST) {
        res.status(400).json({ success: false, message: 'Target user must be a verified Guest of Honor' });
        return;
      }

      // Default expiration: 48 hours from creation
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const offer = await prisma.dateOffer.create({
        data: {
          hostId,
          guestId,
          activityType,
          venueName,
          venueAddress,
          proposedDateTime: proposedDateTime ? new Date(proposedDateTime) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          personalMessage,
          expiresAt,
          status: OfferStatus.PENDING,
        },
        include: {
          guest: {
            select: { nickname: true, email: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Offer sent successfully to Guest of Honor',
        data: offer,
      });
    } catch (error: any) {
      console.error('Create offer error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/offers - Role adaptive (Host gets sent offers, Guest gets received offers)
  static async getOffers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      if (userRole === Role.HOST) {
        const sentOffers = await prisma.dateOffer.findMany({
          where: { hostId: userId },
          include: {
            guest: {
              include: { guestProfile: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        res.json({
          success: true,
          role: 'HOST',
          count: sentOffers.length,
          data: sentOffers,
        });
        return;
      }

      if (userRole === Role.GUEST) {
        const receivedOffers = await prisma.dateOffer.findMany({
          where: { guestId: userId },
          include: {
            host: {
              include: { hostProfile: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        res.json({
          success: true,
          role: 'GUEST',
          count: receivedOffers.length,
          data: receivedOffers,
        });
        return;
      }

      // Admin view: all platform offers
      const allOffers = await prisma.dateOffer.findMany({
        take: 100,
        include: {
          host: { select: { nickname: true, email: true } },
          guest: { select: { nickname: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, role: 'ADMIN', count: allOffers.length, data: allOffers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/offers/:id/respond - Guest responds (ACCEPT, COUNTER, PASS)
  static async respondToOffer(req: Request, res: Response): Promise<void> {
    try {
      const guestId = req.user!.id;
      const { id } = req.params;
      const { action, counterVenue, counterTime, counterNote } = req.body;

      const offer = await prisma.dateOffer.findUnique({ where: { id } });
      if (!offer) {
        res.status(404).json({ success: false, message: 'Offer not found' });
        return;
      }

      if (offer.guestId !== guestId) {
        res.status(403).json({ success: false, message: 'You are not the recipient of this offer' });
        return;
      }

      let updatedStatus: OfferStatus;
      if (action === 'ACCEPT') {
        updatedStatus = OfferStatus.ACCEPTED;
      } else if (action === 'COUNTER') {
        updatedStatus = OfferStatus.COUNTERED;
      } else if (action === 'PASS') {
        updatedStatus = OfferStatus.PASSED;
      } else {
        res.status(400).json({ success: false, message: 'Action must be ACCEPT, COUNTER, or PASS' });
        return;
      }

      const updatedOffer = await prisma.dateOffer.update({
        where: { id },
        data: {
          status: updatedStatus,
          ...(action === 'COUNTER'
            ? {
                counterVenue,
                counterTime: counterTime ? new Date(counterTime) : undefined,
                counterNote,
              }
            : {}),
        },
      });

      res.json({
        success: true,
        message: `Offer ${updatedStatus.toLowerCase()} successfully`,
        data: updatedOffer,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
