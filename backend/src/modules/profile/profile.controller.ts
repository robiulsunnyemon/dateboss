import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { Role } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import { formatHeightInches, parseHeightToInches } from '../discover/discover.controller';

export class ProfileController {
  // GET /api/profile/me - Full current user profile, reviews, and appeals
  static async getMyProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const [user, reviewsReceived, appeals, completedDatesCount, activeEscrowCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          hostProfile: true,
          guestProfile: true,
          subscription: true,
          verificationRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.dateReview.findMany({
        where: { revieweeId: userId },
        include: {
          reviewer: {
            select: {
              id: true,
              nickname: true,
              role: true,
              hostProfile: { select: { photos: true } },
              guestProfile: { select: { photos: true } },
            },
          },
          appeal: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.appeal.findMany({
        where: { userId },
        include: {
          review: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  nickname: true,
                  role: true,
                  hostProfile: { select: { photos: true } },
                  guestProfile: { select: { photos: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dateOffer.count({
        where: {
          OR: [{ hostId: userId }, { guestId: userId }],
          status: 'COMPLETED',
        },
      }),
      prisma.dateOffer.count({
        where: {
          OR: [{ hostId: userId }, { guestId: userId }],
          status: { in: ['PENDING', 'ACCEPTED'] },
        },
      }),
    ]);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const rawProfile = user.role === Role.HOST ? user.hostProfile : user.guestProfile;

    res.json({
      success: true,
      data: {
        id: user.id,
        memberCode: user.memberCode,
        email: user.email,
        role: user.role,
        nickname: user.nickname,
        age: user.age ?? (user.role === Role.HOST ? 32 : 27),
        locationCity: user.locationCity,
        latitude: user.latitude,
        longitude: user.longitude,
        isVerified: user.isVerified,
        isIdVerified: user.isIdVerified || user.isVerified,
        isSelfieVerified: user.isSelfieVerified || user.isVerified,
        createdAt: user.createdAt,
        completedDatesCount,
        activeEscrowCount,
        profile: rawProfile
          ? {
              ...rawProfile,
              height: formatHeightInches(
                rawProfile.heightInches,
                user.role === Role.HOST ? '5\'11"' : '5\'06"'
              ),
            }
          : null,
        subscription: user.subscription,
        latestVerification: user.verificationRequests[0] || null,
        reviews: reviewsReceived,
        appeals,
      },
    });
  }

  // GET /api/profile/:id - Full public profile for Discover "View profile" modal
  static async getPublicProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const [user, reviewsReceived, completedDatesCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id },
        include: {
          hostProfile: true,
          guestProfile: true,
          subscription: true,
        },
      }),
      prisma.dateReview.findMany({
        where: { revieweeId: id },
        include: {
          offer: {
            select: {
              activityType: true,
              venueName: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              nickname: true,
              role: true,
              hostProfile: { select: { photos: true } },
              guestProfile: { select: { photos: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.dateOffer.count({
        where: {
          OR: [{ hostId: id }, { guestId: id }],
          status: 'COMPLETED',
        },
      }),
    ]);

    if (!user) {
      throw new AppError('Member profile not found', 404);
    }

    const isHost = user.role === Role.HOST;
    const rawProfile: any = isHost ? user.hostProfile : user.guestProfile;
    const openTo = isHost
      ? rawProfile?.interests?.length
        ? rawProfile.interests
        : ['Fine Dining', 'Jazz', 'Architecture']
      : rawProfile?.inviteMeToEvents?.length
      ? rawProfile.inviteMeToEvents
      : ['Dinner', 'Events'];
    const heightInches = rawProfile?.heightInches ?? (isHost ? 71 : 66);

    res.json({
      success: true,
      data: {
        id: user.id,
        role: user.role,
        name: user.nickname || (isHost ? 'Host' : 'Guest of Honor'),
        age: user.age ?? (isHost ? 32 : 27),
        location: user.locationCity || 'New York, NY',
        isVerified: user.isVerified,
        isIdVerified: user.isIdVerified || user.isVerified,
        isSelfieVerified: user.isSelfieVerified || user.isVerified,
        createdAt: user.createdAt,
        completedDatesCount,
        reliability: rawProfile?.reliabilityScore ?? 5.0,
        occupation: rawProfile?.occupation || (isHost ? 'Managing Partner' : 'Creative Producer'),
        education: rawProfile?.education || (isHost ? 'Graduate degree' : "Bachelor's degree"),
        smoking: rawProfile?.smoking || 'No',
        drinking: rawProfile?.drinking || 'Occasionally',
        children: rawProfile?.children || 'No',
        bodyType: rawProfile?.bodyType || (isHost ? 'Athletic' : 'Slender'),
        heightInches,
        height: formatHeightInches(heightInches, isHost ? '5\'11"' : '5\'06"'),
        lookingFor:
          Array.isArray(rawProfile?.lookingFor) && rawProfile.lookingFor.length > 0
            ? rawProfile.lookingFor
            : ['Dating', 'Long-term'],
        bio:
          rawProfile?.bio ||
          'Passionate about great cuisine, thoughtful conversation, and memorable date hospitality.',
        idealDate:
          rawProfile?.idealDate ||
          'An unhurried evening with great conversation and memorable hospitality.',
        openTo,
        customIdeas: rawProfile?.customDateIdeas || [],
        photos:
          Array.isArray(rawProfile?.photos) && rawProfile.photos.length > 0
            ? rawProfile.photos
            : [isHost ? '/assets/discover-card-2.jpg' : '/assets/discover-card-1.jpg'],
        netWorth: isHost ? rawProfile?.netWorth : undefined,
        annualIncome: isHost ? rawProfile?.annualIncome : undefined,
        reviews: reviewsReceived.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.feedback,
          eventTitle: r.offer?.activityType,
          venueName: r.offer?.venueName,
          createdAt: r.createdAt,
          reviewerName: r.reviewer?.nickname || 'Verified Member',
          reviewerAvatar:
            r.reviewer?.hostProfile?.photos?.[0] ||
            r.reviewer?.guestProfile?.photos?.[0] ||
            '/assets/discover-card-1.jpg',
        })),
      },
    });
  }

  // PATCH /api/profile/me - Update profile details
  static async updateMyProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const {
      nickname,
      age,
      locationCity,
      latitude,
      longitude,
      bio,
      idealDate,
      occupation,
      education,
      smoking,
      drinking,
      children,
      bodyType,
      height,
      heightInches,
      lookingFor,
      photos,
      interests,
      inviteMeToEvents,
      customDateIdeas,
    } = req.body;

    const resolvedHeightInches =
      heightInches !== undefined
        ? Number(heightInches)
        : height !== undefined
        ? parseHeightToInches(height)
        : undefined;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nickname !== undefined ? { nickname } : {}),
        ...(age !== undefined && !Number.isNaN(Number(age)) ? { age: Number(age) } : {}),
        ...(locationCity !== undefined ? { locationCity } : {}),
        ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
        ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
      },
    });

    const commonProfileUpdates = {
      ...(bio !== undefined ? { bio } : {}),
      ...(idealDate !== undefined ? { idealDate } : {}),
      ...(occupation !== undefined ? { occupation } : {}),
      ...(education !== undefined ? { education } : {}),
      ...(smoking !== undefined ? { smoking } : {}),
      ...(drinking !== undefined ? { drinking } : {}),
      ...(children !== undefined ? { children } : {}),
      ...(bodyType !== undefined ? { bodyType } : {}),
      ...(resolvedHeightInches !== undefined ? { heightInches: resolvedHeightInches } : {}),
      ...(Array.isArray(lookingFor) ? { lookingFor } : {}),
      ...(Array.isArray(photos) ? { photos } : {}),
    };

    if (user.role === Role.HOST) {
      await prisma.hostProfile.upsert({
        where: { userId },
        update: {
          ...commonProfileUpdates,
          ...(Array.isArray(interests) ? { interests } : {}),
        },
        create: {
          userId,
          ...commonProfileUpdates,
          ...(Array.isArray(interests) ? { interests } : {}),
        },
      });
    } else if (user.role === Role.GUEST) {
      await prisma.guestProfile.upsert({
        where: { userId },
        update: {
          ...commonProfileUpdates,
          ...(Array.isArray(inviteMeToEvents) ? { inviteMeToEvents } : {}),
          ...(customDateIdeas !== undefined ? { customDateIdeas } : {}),
        },
        create: {
          userId,
          ...commonProfileUpdates,
          ...(Array.isArray(inviteMeToEvents) ? { inviteMeToEvents } : {}),
          ...(customDateIdeas !== undefined ? { customDateIdeas } : {}),
        },
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  }

  // POST /api/profile/appeals - Submit an appeal on a received review
  static async submitAppeal(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { reviewId, reason } = req.body;

    if (!reviewId || !reason) {
      throw new AppError('reviewId and reason are required', 400);
    }

    const review = await prisma.dateReview.findUnique({ where: { id: reviewId } });
    if (!review || review.revieweeId !== userId) {
      throw new AppError('Review not found for your account', 404);
    }

    const appeal = await prisma.appeal.upsert({
      where: { reviewId },
      update: { reason, status: 'PENDING' },
      create: {
        reviewId,
        userId,
        reason,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appeal submitted for Trust & Safety review',
      data: appeal,
    });
  }
}
