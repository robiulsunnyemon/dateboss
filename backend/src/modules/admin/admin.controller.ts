import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import {
  AccountStatus,
  AppealStatus,
  ModerationStatus,
  ReportStatus,
  VerificationStatus,
} from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';

export class AdminController {
  // GET /api/admin/verifications - Review Queue (supports ?status=PENDING|APPROVED|REJECTED)
  static async getVerificationQueue(req: Request, res: Response): Promise<void> {
    const statusParam = req.query.status as string | undefined;
    const whereClause: any = {};
    if (statusParam && ['PENDING', 'APPROVED', 'REJECTED'].includes(statusParam.toUpperCase())) {
      whereClause.status = statusParam.toUpperCase() as VerificationStatus;
    }

    const [verifications, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.verificationRequest.findMany({
        where: whereClause,
        include: {
          user: {
            include: {
              hostProfile: true,
              guestProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.verificationRequest.count({ where: { status: VerificationStatus.PENDING } }),
      prisma.verificationRequest.count({ where: { status: VerificationStatus.APPROVED } }),
      prisma.verificationRequest.count({ where: { status: VerificationStatus.REJECTED } }),
    ]);

    res.json({
      success: true,
      count: verifications.length,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      data: verifications,
    });
  }

  // POST /api/admin/verifications/:id/review - Approve or Reject
  static async reviewVerification(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;
    const { id } = req.params;
    const { action, rejectionReason } = req.body;

    const isApproved = action === 'APPROVE';

    const verification = await prisma.verificationRequest.update({
      where: { id },
      data: {
        status: isApproved ? VerificationStatus.APPROVED : VerificationStatus.REJECTED,
        reviewedById: adminId,
        reviewedAt: new Date(),
        rejectionReason: !isApproved ? rejectionReason : undefined,
      },
    });

    if (isApproved) {
      await prisma.user.update({
        where: { id: verification.userId },
        data: {
          isVerified: true,
          isIdVerified: true,
          isSelfieVerified: true,
        },
      });
    }

    res.json({
      success: true,
      message: `Verification ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: verification,
    });
  }

  // GET /api/admin/metrics - Analytics Overview
  static async getPlatformMetrics(_req: Request, res: Response): Promise<void> {
    const [
      totalUsers,
      totalHosts,
      totalGuests,
      activeOffers,
      completedOffers,
      pendingVerifications,
      openReports,
      flaggedThreads,
      recentMembers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'HOST' } }),
      prisma.user.count({ where: { role: 'GUEST' } }),
      prisma.dateOffer.count({ where: { status: 'PENDING' } }),
      prisma.dateOffer.count({ where: { status: 'ACCEPTED' } }),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: { in: [ReportStatus.NEW, ReportStatus.IN_REVIEW] } } }),
      prisma.dateOffer.count({ where: { moderationStatus: ModerationStatus.FLAGGED } }),
      prisma.user.findMany({
        where: { role: { in: ['HOST', 'GUEST'] } },
        include: {
          subscription: true,
          hostProfile: true,
          guestProfile: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const monthlyRevenueUsd = Math.round(totalHosts * 9.99 * 100) / 100;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalHosts,
        totalGuests,
        activeOffers,
        completedOffers,
        pendingVerifications,
        openReports,
        flaggedThreads,
        monthlyRevenueUsd,
        hostToGuestRatio: totalHosts && totalGuests ? (totalHosts / totalGuests).toFixed(2) : '1.0',
        recentMembers,
      },
    });
  }

  // GET /api/admin/members - Full Member Directory
  static async getMembers(_req: Request, res: Response): Promise<void> {
    const members = await prisma.user.findMany({
      where: { role: { in: ['HOST', 'GUEST'] } },
      include: {
        subscription: true,
        hostProfile: true,
        guestProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  }

  // POST /api/admin/accounts/:id/status - Suspend, Ban, or Restore Access
  static async updateAccountStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { action } = req.body;

    const statusMap: Record<string, { accountStatus: AccountStatus; isActive: boolean }> = {
      SUSPEND: { accountStatus: AccountStatus.SUSPENDED, isActive: false },
      BAN: { accountStatus: AccountStatus.BANNED, isActive: false },
      RESTORE: { accountStatus: AccountStatus.ACTIVE, isActive: true },
    };

    const next = statusMap[action];
    if (!next) {
      throw new AppError('Action must be SUSPEND, BAN, or RESTORE', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: next.accountStatus,
        isActive: next.isActive,
      },
    });

    res.json({
      success: true,
      message: `Account status updated (${action})`,
      data: updatedUser,
    });
  }

  // GET /api/admin/plans - List all subscription plans
  static async getPlans(_req: Request, res: Response): Promise<void> {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { priceCents: 'asc' },
    });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
    });
  }

  // PUT /api/admin/plans/:id - Update a subscription plan
  static async updatePlan(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, tierLabel, priceDisplay, priceCents, features, footerNote, isActive } = req.body;

    const updated = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(tierLabel !== undefined ? { tierLabel } : {}),
        ...(priceDisplay !== undefined ? { priceDisplay } : {}),
        ...(priceCents !== undefined ? { priceCents } : {}),
        ...(features !== undefined ? { features } : {}),
        ...(footerNote !== undefined ? { footerNote } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    res.json({
      success: true,
      message: 'Subscription plan updated',
      data: updated,
    });
  }

  // GET /api/admin/reports - List member reports
  static async getReports(req: Request, res: Response): Promise<void> {
    const statusParam = req.query.status as string | undefined;
    const whereClause: any = {};
    if (statusParam && ['NEW', 'IN_REVIEW', 'RESOLVED'].includes(statusParam.toUpperCase())) {
      whereClause.status = statusParam.toUpperCase() as ReportStatus;
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        reporter: { select: { id: true, nickname: true, email: true } },
        reported: {
          select: {
            id: true,
            nickname: true,
            email: true,
            hostProfile: { select: { photos: true } },
            guestProfile: { select: { photos: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  }

  // PATCH /api/admin/reports/:id - Update report status & admin note
  static async updateReport(req: Request, res: Response): Promise<void> {
    const adminId = req.user!.id;
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status: status as ReportStatus,
        ...(adminNote !== undefined ? { adminNote } : {}),
        reviewedById: adminId,
      },
    });

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: updated,
    });
  }

  // GET /api/admin/moderation/threads - List moderated/flagged conversation threads
  static async getModerationThreads(req: Request, res: Response): Promise<void> {
    const statusParam = req.query.status as string | undefined;
    const whereClause: any = {
      moderationStatus: { not: ModerationStatus.NORMAL },
    };

    if (statusParam && ['FLAGGED', 'WARNED', 'RESOLVED'].includes(statusParam.toUpperCase())) {
      whereClause.moderationStatus = statusParam.toUpperCase() as ModerationStatus;
    }

    const threads = await prisma.dateOffer.findMany({
      where: whereClause,
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
          include: {
            sender: { select: { id: true, nickname: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      count: threads.length,
      data: threads,
    });
  }

  // POST /api/admin/moderation/threads/:offerId/action - WARN, SUSPEND, or RESOLVE
  static async moderateThread(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const { action } = req.body;

    const offer = await prisma.dateOffer.findUnique({ where: { id: offerId } });
    if (!offer) {
      throw new AppError('Moderation thread not found', 404);
    }

    const nextModStatus =
      action === 'WARN' ? ModerationStatus.WARNED : ModerationStatus.RESOLVED;

    const updatedOffer = await prisma.dateOffer.update({
      where: { id: offerId },
      data: { moderationStatus: nextModStatus },
    });

    if (action === 'SUSPEND') {
      // Suspend the sender of the latest flagged message if present
      const flaggedMsg = await prisma.message.findFirst({
        where: { offerId, isFlagged: true },
        orderBy: { createdAt: 'desc' },
      });
      const targetUserId = flaggedMsg?.senderId || offer.hostId;
      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          accountStatus: AccountStatus.SUSPENDED,
          isActive: false,
        },
      });
    }

    res.json({
      success: true,
      message: `Moderation action (${action}) applied`,
      data: updatedOffer,
    });
  }

  // GET /api/admin/appeals & PATCH /api/admin/appeals/:id
  static async getAppeals(_req: Request, res: Response): Promise<void> {
    const appeals = await prisma.appeal.findMany({
      include: {
        user: { select: { id: true, nickname: true, email: true } },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: appeals.length,
      data: appeals,
    });
  }

  static async resolveAppeal(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      throw new AppError('Appeal status must be ACCEPTED or REJECTED', 400);
    }

    const updated = await prisma.appeal.update({
      where: { id },
      data: {
        status: status as AppealStatus,
        adminNote,
        resolvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: `Appeal ${status.toLowerCase()}`,
      data: updated,
    });
  }
}
