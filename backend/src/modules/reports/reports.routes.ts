import { Router, Request, Response } from 'express';
import { prisma } from '../../config/db';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler, AppError } from '../../middleware/errorHandler';
import { validateBody } from '../../middleware/validate';
import { createReportSchema } from '../../validators/schemas';
import { ReportPriority, ReportStatus } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

// POST /api/reports - Member submits a safety/conduct report
router.post(
  '/',
  validateBody(createReportSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const reporterId = req.user!.id;
    const { reportedId, title, priority, description } = req.body;

    if (reporterId === reportedId) {
      throw new AppError('You cannot report your own account', 400);
    }

    const target = await prisma.user.findUnique({ where: { id: reportedId } });
    if (!target) {
      throw new AppError('Reported user not found', 404);
    }

    const code = `RPT-${Math.floor(2100 + Math.random() * 7899)}`;

    const report = await prisma.report.create({
      data: {
        code,
        title,
        priority: (priority as ReportPriority) || ReportPriority.MEDIUM,
        description,
        status: ReportStatus.NEW,
        reporterId,
        reportedId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted to Trust & Safety',
      data: report,
    });
  })
);

export default router;
