import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { Role, Gender, TargetGender } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'thedateboss_jwt_secret_dev_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  // POST /api/auth/register
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role, gender, targetGender, nickname } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User already exists with this email' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userRole: Role = role === 'GUEST' ? Role.GUEST : role === 'ADMIN' ? Role.ADMIN : Role.HOST;

      // Create user and initialize profile based on role
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: userRole,
          gender: gender as Gender,
          targetGender: targetGender as TargetGender,
          nickname,
          onboardingStep: 1,
          ...(userRole === Role.HOST
            ? { hostProfile: { create: {} } }
            : userRole === Role.GUEST
            ? { guestProfile: { create: {} } }
            : {}),
        },
        include: {
          hostProfile: true,
          guestProfile: true,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            nickname: user.nickname,
            onboardingStep: user.onboardingStep,
            isVerified: user.isVerified,
          },
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          hostProfile: true,
          guestProfile: true,
        },
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            nickname: user.nickname,
            onboardingStep: user.onboardingStep,
            isVerified: user.isVerified,
            profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
          },
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // GET /api/auth/me
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          hostProfile: true,
          guestProfile: true,
          subscription: true,
        },
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          locationCity: user.locationCity,
          isVerified: user.isVerified,
          onboardingStep: user.onboardingStep,
          profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
          subscription: user.subscription,
        },
      });
    } catch (error: any) {
      console.error('Get current user error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  // POST /api/auth/social (Google & Apple auth integration)
  static async socialAuth(req: Request, res: Response): Promise<void> {
    try {
      const { provider, email, name, avatar, role, gender, targetGender } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: 'Email is required' });
        return;
      }

      const userRole: Role = role === 'GUEST' ? Role.GUEST : Role.HOST;

      let user = await prisma.user.findUnique({
        where: { email },
        include: { hostProfile: true, guestProfile: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            role: userRole,
            gender: gender as Gender,
            targetGender: targetGender as TargetGender,
            nickname: name || (userRole === Role.HOST ? 'Host' : 'Guest'),
            onboardingStep: 4,
            ...(userRole === Role.HOST
              ? { hostProfile: { create: { photos: avatar ? [avatar] : [] } } }
              : { guestProfile: { create: { photos: avatar ? [avatar] : [] } } }),
          },
          include: { hostProfile: true, guestProfile: true },
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      res.json({
        success: true,
        message: `${provider || 'Social'} login successful`,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            nickname: user.nickname,
            onboardingStep: user.onboardingStep,
            isVerified: user.isVerified,
            profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
          },
        },
      });
    } catch (error: any) {
      console.error('Social auth error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
}
