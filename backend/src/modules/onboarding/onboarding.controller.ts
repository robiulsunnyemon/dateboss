import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { Role } from '@prisma/client';

export class OnboardingController {
  // Step 2 for Guest: Save "Invite Me To..." outings and custom date ideas
  static async saveGuestEvents(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { selectedEvents, customIdeas } = req.body;

      const profile = await prisma.guestProfile.upsert({
        where: { userId },
        update: {
          inviteMeToEvents: selectedEvents || [],
          customDateIdeas: customIdeas || [],
        },
        create: {
          userId,
          inviteMeToEvents: selectedEvents || [],
          customDateIdeas: customIdeas || [],
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 3 },
      });

      res.json({ success: true, message: 'Guest outings saved', data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 2 for Host: Save interests
  static async saveHostInterests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { interests } = req.body;

      const profile = await prisma.hostProfile.upsert({
        where: { userId },
        update: {
          interests: interests || [],
        },
        create: {
          userId,
          interests: interests || [],
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 3 },
      });

      res.json({ success: true, message: 'Host interests saved', data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 4: Save Nickname & Location
  static async saveDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { nickname, locationCity, latitude, longitude } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          nickname,
          locationCity,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          onboardingStep: 5,
        },
      });

      res.json({ success: true, message: 'Location details saved', data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 5: Save Lifestyle (children, smoke, drink)
  static async saveLifestyle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { children, smoking, drinking } = req.body;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user?.role === Role.HOST) {
        await prisma.hostProfile.update({
          where: { userId },
          data: { children, smoking, drinking },
        });
      } else {
        await prisma.guestProfile.update({
          where: { userId },
          data: { children, smoking, drinking },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 6 },
      });

      res.json({ success: true, message: 'Lifestyle preferences saved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 6: Save Career & Financials (Hosts have income/net worth; Guests have education/occupation)
  static async saveCareer(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { education, occupation, annualIncome, netWorth } = req.body;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user?.role === Role.HOST) {
        await prisma.hostProfile.update({
          where: { userId },
          data: { education, occupation, annualIncome, netWorth },
        });
      } else {
        await prisma.guestProfile.update({
          where: { userId },
          data: { education, occupation },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 7 },
      });

      res.json({ success: true, message: 'Career information saved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 7: Save Bio & Prompts
  static async savePrompts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { bio, idealDate } = req.body;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user?.role === Role.HOST) {
        await prisma.hostProfile.update({
          where: { userId },
          data: { bio, idealDate },
        });
      } else {
        await prisma.guestProfile.update({
          where: { userId },
          data: { bio, idealDate },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 8 },
      });

      res.json({ success: true, message: 'Bio & prompts saved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 8: Save Photos Gallery
  static async savePhotos(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { photos } = req.body;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user?.role === Role.HOST) {
        await prisma.hostProfile.update({
          where: { userId },
          data: { photos: photos || [] },
        });
      } else {
        await prisma.guestProfile.update({
          where: { userId },
          data: { photos: photos || [] },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 9 },
      });

      res.json({ success: true, message: 'Photos saved successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 10: Submit Selfie & Face Center Stage verification request
  static async submitVerification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { selfieUrl, faceSnapshotUrl } = req.body;

      const verification = await prisma.verificationRequest.create({
        data: {
          userId,
          selfieUrl: selfieUrl || '/assets/selfie-illustration.png',
          faceSnapshotUrl: faceSnapshotUrl || '/assets/face-center-stage.png',
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { onboardingStep: 11 },
      });

      res.json({
        success: true,
        message: 'Verification submitted for review',
        data: verification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Step 12: Finalize membership (Host = $9.99/mo; Guest = $0.00/mo)
  static async finalizeOnboarding(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      const isHost = user?.role === Role.HOST;
      const planName = isHost ? 'HOST_MONTHLY_PRO' : 'FREE_GUEST_OF_HONOR';
      const priceCents = isHost ? 999 : 0;

      // Upsert subscription
      const subscription = await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: planName,
          priceCents,
          status: 'ACTIVE',
        },
        create: {
          userId,
          plan: planName,
          priceCents,
          status: 'ACTIVE',
        },
      });

      // Mark onboarding complete and user verified for demo/testing
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingStep: 12,
          isVerified: true,
        },
      });

      res.json({
        success: true,
        message: isHost
          ? 'Welcome, Host! Membership activated.'
          : 'Welcome, Guest of Honor! Free lifetime access granted.',
        data: { subscription },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
