import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { Role } from '@prisma/client';

export class DiscoverController {
  // GET /api/discover - Role Adaptive
  static async getDiscoverFeed(req: Request, res: Response): Promise<void> {
    try {
      const userRole = req.user?.role || Role.HOST;
      const { category, search, maxDistance, minReliability } = req.query;

      // 1. If user is HOST -> Display Guests of Honor (Female Guests)
      if (userRole === Role.HOST) {
        const guests = await prisma.user.findMany({
          where: {
            role: Role.GUEST,
            isActive: true,
          },
          include: {
            guestProfile: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 30,
        });

        const cards = guests.map((guest) => {
          const profile = guest.guestProfile;
          const openTo = profile?.inviteMeToEvents?.length
            ? profile.inviteMeToEvents
            : ['Dinner', 'Events'];
          
          return {
            id: guest.id,
            name: guest.nickname || 'Guest of Honor',
            age: 26, // or computed from birthdate
            image: profile?.photos?.[0] || '/assets/discover-card-1.jpg',
            reliability: profile?.reliabilityScore || 4.9,
            distanceKm: 3, // based on geo coordinates if provided
            bio: profile?.bio || 'Long dinners, warm light, no rush.',
            openTo,
            categories: openTo.map((e) => e.toLowerCase()),
            location: guest.locationCity || 'Downtown, 3 km away',
            occupation: profile?.occupation || 'Creative Producer',
            customIdeas: profile?.customDateIdeas || [],
            crownBadge: true,
            isVerified: guest.isVerified,
            canSendOffer: true,
          };
        });

        res.json({
          success: true,
          roleView: 'HOST_VIEWING_GUESTS',
          count: cards.length,
          data: cards,
        });
        return;
      }

      // 2. If user is GUEST -> Display Verified Hosts (Men / Hosts)
      if (userRole === Role.GUEST) {
        const hosts = await prisma.user.findMany({
          where: {
            role: Role.HOST,
            isActive: true,
          },
          include: {
            hostProfile: true,
            subscription: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 30,
        });

        const cards = hosts.map((host) => {
          const profile = host.hostProfile;
          const interests = profile?.interests?.length
            ? profile.interests
            : ['Fine Dining', 'Jazz', 'Architecture'];

          return {
            id: host.id,
            name: host.nickname || 'Host',
            age: 32,
            image: profile?.photos?.[0] || '/assets/discover-card-2.jpg',
            reliability: 5.0,
            distanceKm: 4,
            bio: profile?.bio || 'Passionate about great cuisine, thoughtful conversation, and memorable date hospitality.',
            openTo: interests,
            categories: interests.map((e) => e.toLowerCase()),
            location: host.locationCity || 'West End, 4 km away',
            occupation: profile?.occupation || 'Managing Partner',
            netWorth: profile?.netWorth,
            crownBadge: true,
            isProHost: host.subscription?.status === 'ACTIVE',
            isVerified: host.isVerified,
            canSendOffer: false,
            canReceiveOffer: true,
          };
        });

        res.json({
          success: true,
          roleView: 'GUEST_VIEWING_HOSTS',
          count: cards.length,
          data: cards,
        });
        return;
      }

      // 3. If user is ADMIN -> Platform Overview
      const allUsers = await prisma.user.findMany({
        take: 50,
        include: {
          hostProfile: true,
          guestProfile: true,
        },
      });

      res.json({
        success: true,
        roleView: 'ADMIN_PLATFORM_OVERVIEW',
        count: allUsers.length,
        data: allUsers,
      });
    } catch (error: any) {
      console.error('Discover feed error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
