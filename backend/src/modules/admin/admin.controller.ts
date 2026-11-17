import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { VerificationStatus } from '@prisma/client';

export class AdminController {
  // GET /api/admin/verifications - Review Queue
  static async getVerificationQueue(req: Request, res: Response): Promise<void> {
    try {
      const verifications = await prisma.verificationRequest.findMany({
        where: { status: VerificationStatus.PENDING },
        include: {
          user: {
            include: {
              hostProfile: true,
              guestProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        count: verifications.length,
        data: verifications,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/admin/verifications/:id/review - Approve or Reject
  static async reviewVerification(req: Request, res: Response): Promise<void> {
    try {
      const adminId = req.user!.id;
      const { id } = req.params;
      const { action, rejectionReason } = req.body; // action: 'APPROVE' | 'REJECT'

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

      // If approved, mark User as verified
      if (isApproved) {
        await prisma.user.update({
          where: { id: verification.userId },
          data: { isVerified: true },
        });
      }

      res.json({
        success: true,
        message: `Verification ${isApproved ? 'approved' : 'rejected'} successfully`,
        data: verification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/admin/metrics - Analytics Overview
  static async getPlatformMetrics(_req: Request, res: Response): Promise<void> {
    try {
      const [totalUsers, totalHosts, totalGuests, activeOffers, completedOffers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'HOST' } }),
        prisma.user.count({ where: { role: 'GUEST' } }),
        prisma.dateOffer.count({ where: { status: 'PENDING' } }),
        prisma.dateOffer.count({ where: { status: 'ACCEPTED' } }),
      ]);

      const monthlyRevenueUsd = totalHosts * 9.99;

      res.json({
        success: true,
        data: {
          totalUsers,
          totalHosts,
          totalGuests,
          activeOffers,
          completedOffers,
          monthlyRevenueUsd,
          hostToGuestRatio: totalHosts && totalGuests ? (totalHosts / totalGuests).toFixed(2) : '1.0',
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
