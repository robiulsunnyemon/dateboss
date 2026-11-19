import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { Role, OfferStatus, SubscriptionStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';

function generateThreadCode(): string {
  const num = Math.floor(100 + Math.random() * 900);
  return `CON-${num}`;
}

export async function expireStaleOffers(): Promise<number> {
  const result = await prisma.dateOffer.updateMany({
    where: {
      status: OfferStatus.PENDING,
      expiresAt: { lt: new Date() },
    },
    data: {
      status: OfferStatus.EXPIRED,
    },
  });
  return result.count;
}

async function recalculateReliability(userId: string, role: Role): Promise<void> {
  const agg = await prisma.dateReview.aggregate({
    where: { revieweeId: userId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  if (agg._count.rating === 0 || agg._avg.rating == null) return;
  const rounded = Math.round(agg._avg.rating * 100) / 100;

  if (role === Role.HOST) {
    await prisma.hostProfile.updateMany({
      where: { userId },
      data: { reliabilityScore: rounded },
    });
  } else if (role === Role.GUEST) {
    await prisma.guestProfile.updateMany({
      where: { userId },
      data: { reliabilityScore: rounded },
    });
  }
}

export class OffersController {
  // POST /api/offers - Host creates a date offer for a Guest of Honor
  static async createOffer(req: Request, res: Response): Promise<void> {
    const hostId = req.user!.id;

    const hostSub = await prisma.subscription.findUnique({ where: { userId: hostId } });
    if (hostSub?.status !== SubscriptionStatus.ACTIVE) {
      throw new AppError('An active Host subscription is required to send date offers.', 403);
    }

    const {
      guestId,
      activityType,
      venueName,
      venueAddress,
      proposedDateTime,
      personalMessage,
      hospitalityGuarantee,
    } = req.body;

    const guest = await prisma.user.findUnique({ where: { id: guestId } });
    if (!guest || guest.role !== Role.GUEST) {
      throw new AppError('Target user must be a verified Guest of Honor', 400);
    }

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const offer = await prisma.dateOffer.create({
      data: {
        threadCode: generateThreadCode(),
        hostId,
        guestId,
        activityType,
        venueName,
        venueAddress,
        proposedDateTime: proposedDateTime
          ? new Date(proposedDateTime)
          : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        personalMessage,
        hospitalityGuarantee: hospitalityGuarantee || 'Host covers all dining & hospitality',
        expiresAt,
        status: OfferStatus.PENDING,
      },
      include: {
        guest: {
          select: { id: true, nickname: true, email: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Offer sent successfully to Guest of Honor',
      data: offer,
    });
  }

  // GET /api/offers - Role adaptive (auto-expires stale pending offers first)
  static async getOffers(req: Request, res: Response): Promise<void> {
    await expireStaleOffers();

    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === Role.HOST) {
      const sentOffers = await prisma.dateOffer.findMany({
        where: { hostId: userId },
        include: {
          guest: { include: { guestProfile: true } },
          review: true,
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
          host: { include: { hostProfile: true } },
          review: true,
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

    const allOffers = await prisma.dateOffer.findMany({
      take: 100,
      include: {
        host: { select: { id: true, nickname: true, email: true } },
        guest: { select: { id: true, nickname: true, email: true } },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, role: 'ADMIN', count: allOffers.length, data: allOffers });
  }

  // POST /api/offers/:id/respond - Guest responds (ACCEPT, COUNTER, PASS)
  static async respondToOffer(req: Request, res: Response): Promise<void> {
    const guestId = req.user!.id;
    const { id } = req.params;
    const { action, counterVenue, counterTime, counterNote } = req.body;

    const offer = await prisma.dateOffer.findUnique({ where: { id } });
    if (!offer) {
      throw new AppError('Offer not found', 404);
    }
    if (offer.guestId !== guestId) {
      throw new AppError('You are not the recipient of this offer', 403);
    }
    if (offer.expiresAt < new Date() && offer.status === OfferStatus.PENDING) {
      await prisma.dateOffer.update({
        where: { id },
        data: { status: OfferStatus.EXPIRED },
      });
      throw new AppError('This offer has expired after 48 hours', 400);
    }

    const updatedStatus =
      action === 'ACCEPT'
        ? OfferStatus.ACCEPTED
        : action === 'COUNTER'
        ? OfferStatus.COUNTERED
        : OfferStatus.PASSED;

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
  }

  // POST /api/offers/:id/host-respond - Host accepts or declines a Guest's counter-offer
  static async hostRespondToCounter(req: Request, res: Response): Promise<void> {
    const hostId = req.user!.id;
    const { id } = req.params;
    const { action } = req.body;

    const offer = await prisma.dateOffer.findUnique({ where: { id } });
    if (!offer) {
      throw new AppError('Offer not found', 404);
    }
    if (offer.hostId !== hostId) {
      throw new AppError('Only the Host who created this offer can respond', 403);
    }
    if (offer.status !== OfferStatus.COUNTERED) {
      throw new AppError('This offer is not in COUNTERED state', 400);
    }

    const updatedOffer = await prisma.dateOffer.update({
      where: { id },
      data:
        action === 'ACCEPT'
          ? {
              status: OfferStatus.ACCEPTED,
              venueName: offer.counterVenue || offer.venueName,
              proposedDateTime: offer.counterTime || offer.proposedDateTime,
            }
          : {
              status: OfferStatus.CANCELLED,
            },
    });

    res.json({
      success: true,
      message:
        action === 'ACCEPT'
          ? 'Counter-offer accepted! Private chat is now unlocked.'
          : 'Counter-offer declined.',
      data: updatedOffer,
    });
  }

  // POST /api/offers/ask - Guest broadcasts or sends date wishlist to Hosts
  static async askForOffer(req: Request, res: Response): Promise<void> {
    const guestId = req.user!.id;
    const { plan, time, location, note, giftAmount, targetHostId } = req.body;

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    let hostId = targetHostId;
    if (!hostId) {
      const anyHost = await prisma.user.findFirst({
        where: { role: Role.HOST, isActive: true },
      });
      hostId = anyHost?.id || guestId;
    }

    const offer = await prisma.dateOffer.create({
      data: {
        threadCode: generateThreadCode(),
        hostId,
        guestId,
        activityType: plan || 'Dinner',
        venueName: location || 'Midtown Manhattan',
        venueAddress: location || 'New York',
        proposedDateTime: time ? new Date(time) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        personalMessage: note || "Tell Hosts what you'd love",
        hospitalityGuarantee: `$${giftAmount || 250} Escrow Gift Requested`,
        expiresAt,
        status: OfferStatus.PENDING,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Your date request has been created! Verified hosts can now send you gifted offers.',
      data: offer,
    });
  }

  // POST /api/offers/:id/withdraw - Guest or Host withdraws an offer or counter
  static async withdrawOffer(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const offer = await prisma.dateOffer.findUnique({ where: { id } });
    if (!offer) {
      throw new AppError('Offer not found', 404);
    }
    if (offer.hostId !== userId && offer.guestId !== userId) {
      throw new AppError('You are not authorized to withdraw this offer', 403);
    }

    const updatedOffer = await prisma.dateOffer.update({
      where: { id },
      data: { status: OfferStatus.CANCELLED },
    });

    res.json({
      success: true,
      message: 'Offer withdrawn successfully',
      data: updatedOffer,
    });
  }

  // POST /api/offers/:id/checkin - 24-hour check-in & attendance confirmation
  static async confirmAttendance(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    const offer = await prisma.dateOffer.findUnique({ where: { id } });
    if (!offer) {
      throw new AppError('Date not found', 404);
    }
    if (offer.hostId !== userId && offer.guestId !== userId) {
      throw new AppError('You are not part of this date', 403);
    }

    const isHost = offer.hostId === userId;
    const hostCheckedIn = isHost ? true : offer.hostCheckedIn;
    const guestCheckedIn = !isHost ? true : offer.guestCheckedIn;

    const updatedOffer = await prisma.dateOffer.update({
      where: { id },
      data: {
        hostCheckedIn,
        guestCheckedIn,
        status: hostCheckedIn && guestCheckedIn ? OfferStatus.COMPLETED : OfferStatus.ACCEPTED,
      },
    });

    res.json({
      success: true,
      message:
        updatedOffer.status === OfferStatus.COMPLETED
          ? 'Both members checked in! Date completed.'
          : 'Check-in confirmed! Waiting for the other member.',
      data: updatedOffer,
    });
  }

  // POST /api/offers/:id/review - Submit star rating & persist review + recalculate reliabilityScore
  static async submitReview(req: Request, res: Response): Promise<void> {
    const reviewerId = req.user!.id;
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const offer = await prisma.dateOffer.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, role: true } },
        guest: { select: { id: true, role: true } },
      },
    });

    if (!offer) {
      throw new AppError('Date offer not found', 404);
    }
    if (offer.hostId !== reviewerId && offer.guestId !== reviewerId) {
      throw new AppError('Only participants of this date can submit a review', 403);
    }

    const reviewee = offer.hostId === reviewerId ? offer.guest : offer.host;

    const review = await prisma.dateReview.upsert({
      where: { offerId: id },
      update: { rating, feedback },
      create: {
        offerId: id,
        reviewerId,
        revieweeId: reviewee.id,
        rating,
        feedback,
      },
    });

    await recalculateReliability(reviewee.id, reviewee.role);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your rating and review have been recorded and reliability score updated.',
      data: review,
    });
  }
}
