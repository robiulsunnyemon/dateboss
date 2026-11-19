import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { AccountStatus, Role, Gender, TargetGender } from '@prisma/client';
import { getJwtSecret } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateMemberCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TDB-${num}`;
}

export class AuthController {
  // POST /api/auth/register (Public registration: only HOST or GUEST allowed)
  static async register(req: Request, res: Response): Promise<void> {
    const { email, password, role, gender, targetGender, nickname } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new AppError('User already exists with this email', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Security: Prevent public registration as ADMIN
    const userRole: Role = role === 'GUEST' ? Role.GUEST : Role.HOST;

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        memberCode: generateMemberCode(),
        passwordHash,
        role: userRole,
        gender: gender as Gender,
        targetGender: targetGender as TargetGender,
        nickname,
        onboardingStep: 1,
        ...(userRole === Role.HOST
          ? { hostProfile: { create: {} } }
          : { guestProfile: { create: {} } }),
      },
      include: {
        hostProfile: true,
        guestProfile: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user.id,
          memberCode: user.memberCode,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          onboardingStep: user.onboardingStep,
          isVerified: user.isVerified,
        },
      },
    });
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        hostProfile: true,
        guestProfile: true,
        subscription: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive || user.accountStatus !== AccountStatus.ACTIVE) {
      throw new AppError(
        `Your account is ${user.accountStatus.toLowerCase()}. Please contact support.`,
        403
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          memberCode: user.memberCode,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          onboardingStep: user.onboardingStep,
          isVerified: user.isVerified,
          accountStatus: user.accountStatus,
          profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
          subscription: user.subscription,
        },
      },
    });
  }

  // GET /api/auth/me
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
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
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        memberCode: user.memberCode,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        nickname: user.nickname,
        locationCity: user.locationCity,
        isVerified: user.isVerified,
        onboardingStep: user.onboardingStep,
        profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
        subscription: user.subscription,
      },
    });
  }

  // POST /api/auth/social (Google & Apple auth integration)
  static async socialAuth(req: Request, res: Response): Promise<void> {
    const { provider, email, name, avatar, role, gender, targetGender } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const userRole: Role = role === 'GUEST' ? Role.GUEST : Role.HOST;

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { hostProfile: true, guestProfile: true },
    });

    if (user && (!user.isActive || user.accountStatus !== AccountStatus.ACTIVE)) {
      throw new AppError(
        `Your account is ${user.accountStatus.toLowerCase()}. Please contact support.`,
        403
      );
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          memberCode: generateMemberCode(),
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
      getJwtSecret(),
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: `${provider || 'Social'} login successful`,
      data: {
        token,
        user: {
          id: user.id,
          memberCode: user.memberCode,
          email: user.email,
          role: user.role,
          nickname: user.nickname,
          onboardingStep: user.onboardingStep,
          isVerified: user.isVerified,
          profile: user.role === Role.HOST ? user.hostProfile : user.guestProfile,
        },
      },
    });
  }
}
