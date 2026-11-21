import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { getIO } from '../../config/socket';
import { OfferStatus, ModerationStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { createLiveKitToken, getLiveKitServerUrl } from '../../config/livekit';

export class MessagesController {
  // GET /api/messages/conversations - Active unlocked conversations for the user
  static async getConversations(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const offers = await prisma.dateOffer.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
        status: { in: [OfferStatus.ACCEPTED, OfferStatus.COMPLETED] },
      },
      include: {
        host: {
          select: {
            id: true,
            nickname: true,
            isVerified: true,
            hostProfile: { select: { photos: true } },
          },
        },
        guest: {
          select: {
            id: true,
            nickname: true,
            isVerified: true,
            guestProfile: { select: { photos: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const unreadCounts = await prisma.message.groupBy({
      by: ['offerId'],
      where: {
        receiverId: userId,
        isRead: false,
        offerId: { not: null },
      },
      _count: { id: true },
    });

    const unreadMap = new Map(unreadCounts.map((u) => [u.offerId, u._count.id]));

    const conversations = offers.map((offer) => {
      const isHost = offer.hostId === userId;
      const partner = isHost ? offer.guest : offer.host;
      const partnerAvatar = isHost
        ? offer.guest.guestProfile?.photos?.[0]
        : offer.host.hostProfile?.photos?.[0];
      const lastMessage = offer.messages[0] || null;

      return {
        offerId: offer.id,
        threadCode: offer.threadCode,
        venueName: offer.venueName,
        activityType: offer.activityType,
        proposedDateTime: offer.proposedDateTime,
        partner: {
          id: partner.id,
          name: partner.nickname || 'Member',
          isVerified: partner.isVerified,
          avatar: partnerAvatar || '/assets/avatar-1.png',
        },
        lastMessage,
        unreadCount: unreadMap.get(offer.id) || 0,
      };
    });

    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  }

  // GET /api/messages/:offerId - Chat history for an accepted offer
  static async getMessages(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { offerId } = req.params;

    const offer = await prisma.dateOffer.findUnique({ where: { id: offerId } });
    if (!offer) {
      throw new AppError('Conversation not found', 404);
    }
    if (offer.hostId !== userId && offer.guestId !== userId) {
      throw new AppError('You do not have access to this conversation', 403);
    }
    if (offer.status !== OfferStatus.ACCEPTED && offer.status !== OfferStatus.COMPLETED) {
      throw new AppError('Chat unlocks only after the offer is accepted', 403);
    }

    // Mark incoming messages as read
    await prisma.message.updateMany({
      where: {
        offerId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    const messages = await prisma.message.findMany({
      where: { offerId },
      include: {
        sender: { select: { id: true, nickname: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  }

  // POST /api/messages/:offerId - Send message + emit via Socket.io
  static async sendMessage(req: Request, res: Response): Promise<void> {
    const senderId = req.user!.id;
    const { offerId } = req.params;
    const { content } = req.body;

    const offer = await prisma.dateOffer.findUnique({ where: { id: offerId } });
    if (!offer) {
      throw new AppError('Conversation not found', 404);
    }
    if (offer.hostId !== senderId && offer.guestId !== senderId) {
      throw new AppError('You are not a participant in this conversation', 403);
    }
    if (offer.status !== OfferStatus.ACCEPTED && offer.status !== OfferStatus.COMPLETED) {
      throw new AppError('Chat unlocks only after the offer is accepted', 403);
    }

    const receiverId = offer.hostId === senderId ? offer.guestId : offer.hostId;

    const message = await prisma.message.create({
      data: {
        offerId,
        senderId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, nickname: true } },
      },
    });

    const io = getIO();
    if (io) {
      io.to(`offer:${offerId}`).emit('new_message', message);
      io.to(`user:${receiverId}`).emit('new_message_notification', {
        offerId,
        message,
      });
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  }

  // POST /api/messages/:messageId/flag - Flag a message for Safety & Moderation review
  static async flagMessage(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { messageId } = req.params;
    const { reason } = req.body;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { offer: true },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new AppError('You cannot flag a message from another conversation', 403);
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        isFlagged: true,
        flagReason: reason,
      },
    });

    if (message.offerId) {
      await prisma.dateOffer.update({
        where: { id: message.offerId },
        data: {
          moderationStatus: ModerationStatus.FLAGGED,
          flagReason: reason,
          flagSubtext: 'Flagged by a member for thoughtful human review.',
        },
      });
    }

    res.json({
      success: true,
      message: 'Message flagged for Trust & Safety review',
      data: updated,
    });
  }

  // POST /api/messages/call-token - Generate LiveKit video/voice room access token
  static async getCallToken(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { offerId } = req.body;

    if (!offerId) {
      throw new AppError('offerId is required to start a call', 400);
    }

    const offer = await prisma.dateOffer.findUnique({
      where: { id: offerId },
      include: {
        host: { select: { id: true, nickname: true, email: true } },
        guest: { select: { id: true, nickname: true, email: true } },
      },
    });

    if (!offer) {
      throw new AppError('Date offer not found', 404);
    }

    if (offer.hostId !== userId && offer.guestId !== userId) {
      throw new AppError('You are not a participant of this date offer', 403);
    }

    if (offer.status !== OfferStatus.ACCEPTED && offer.status !== OfferStatus.COMPLETED) {
      throw new AppError('Private calls unlock after the date invitation is accepted', 400);
    }

    const currentMember = offer.hostId === userId ? offer.host : offer.guest;
    const participantName =
      currentMember.nickname || currentMember.email.split('@')[0] || 'Member';
    const roomName = `dateboss-room-${offerId}`;

    const token = await createLiveKitToken(roomName, userId, participantName);

    res.json({
      success: true,
      data: {
        token,
        roomName,
        serverUrl: getLiveKitServerUrl(),
        participantName,
      },
    });
  }
}
