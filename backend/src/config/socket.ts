import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthUserPayload, getJwtSecret } from '../middleware/auth';
import { prisma } from './db';

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HttpServer, allowedOrigins: string[]): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    try {
      const token =
        (socket.handshake.auth?.token as string) ||
        (socket.handshake.headers.authorization?.replace('Bearer ', '') as string);
      if (!token) {
        return next(new Error('Authentication required'));
      }
      const decoded = jwt.verify(token, getJwtSecret()) as AuthUserPayload;
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user: AuthUserPayload = (socket as any).user;
    socket.join(`user:${user.id}`);

    socket.on('join_offer', async (offerId: string) => {
      if (!offerId) return;
      const offer = await prisma.dateOffer.findUnique({
        where: { id: offerId },
        select: { hostId: true, guestId: true, status: true },
      });
      if (
        offer &&
        (offer.hostId === user.id || offer.guestId === user.id) &&
        (offer.status === 'ACCEPTED' || offer.status === 'COMPLETED')
      ) {
        socket.join(`offer:${offerId}`);
      }
    });

    socket.on('leave_offer', (offerId: string) => {
      if (offerId) {
        socket.leave(`offer:${offerId}`);
      }
    });

    socket.on('typing', (payload: { offerId: string; isTyping: boolean }) => {
      if (payload?.offerId) {
        socket.to(`offer:${payload.offerId}`).emit('user_typing', {
          userId: user.id,
          offerId: payload.offerId,
          isTyping: Boolean(payload.isTyping),
        });
      }
    });

    // Real-Time WebRTC Call Signaling
    socket.on('call_user', async (payload: { offerId: string; isVideo?: boolean; sdp?: any }) => {
      if (!payload?.offerId) return;
      try {
        const offer = await prisma.dateOffer.findUnique({
          where: { id: payload.offerId },
          include: {
            host: { select: { id: true, nickname: true, hostProfile: { select: { photos: true } } } },
            guest: { select: { id: true, nickname: true, guestProfile: { select: { photos: true } } } },
          },
        });
        if (!offer || (offer.status !== 'ACCEPTED' && offer.status !== 'COMPLETED')) return;

        const targetUserId = offer.hostId === user.id ? offer.guestId : offer.hostId;
        const caller = offer.hostId === user.id ? offer.host : offer.guest;
        const callerAvatar =
          offer.hostId === user.id
            ? offer.host.hostProfile?.photos?.[0]
            : offer.guest.guestProfile?.photos?.[0];

        io?.to(`user:${targetUserId}`).emit('incoming_call', {
          offerId: payload.offerId,
          callerId: user.id,
          callerName: caller.nickname || 'Member',
          callerAvatar: callerAvatar || '/assets/discover-card-1.jpg',
          isVideo: payload.isVideo ?? true,
          sdp: payload.sdp,
        });
      } catch (err) {
        console.error('Call signaling error:', err);
      }
    });

    socket.on('call_accepted', (payload: { offerId: string; callerId: string; sdp?: any }) => {
      if (payload?.callerId) {
        io?.to(`user:${payload.callerId}`).emit('call_connected', {
          offerId: payload.offerId,
          receiverId: user.id,
          sdp: payload.sdp,
        });
      }
    });

    socket.on('webrtc_signal', (payload: { offerId: string; targetUserId?: string; signal: any }) => {
      if (payload?.targetUserId) {
        io?.to(`user:${payload.targetUserId}`).emit('webrtc_signal', {
          senderId: user.id,
          offerId: payload.offerId,
          signal: payload.signal,
        });
      } else if (payload?.offerId) {
        socket.to(`offer:${payload.offerId}`).emit('webrtc_signal', {
          senderId: user.id,
          offerId: payload.offerId,
          signal: payload.signal,
        });
      }
    });

    socket.on('call_ended', (payload: { offerId: string; targetUserId?: string }) => {
      if (payload?.targetUserId) {
        io?.to(`user:${payload.targetUserId}`).emit('call_terminated', {
          offerId: payload.offerId,
          reason: 'Call ended',
        });
      } else if (payload?.offerId) {
        socket.to(`offer:${payload.offerId}`).emit('call_terminated', {
          offerId: payload.offerId,
          reason: 'Call ended',
        });
      }
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
