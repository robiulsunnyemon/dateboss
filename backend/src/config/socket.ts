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
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
