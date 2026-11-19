import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['HOST', 'GUEST']).optional().default('HOST'),
  gender: z.enum(['MAN', 'WOMAN', 'OTHER']).optional(),
  targetGender: z.enum(['MEN', 'WOMEN', 'EVERYONE']).optional(),
  nickname: z.string().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const socialAuthSchema = z.object({
  provider: z.enum(['google', 'apple']).optional().default('google'),
  email: z.string().email('Valid email is required'),
  name: z.string().max(80).optional(),
  avatar: z.string().optional(),
  role: z.enum(['HOST', 'GUEST']).optional().default('HOST'),
  gender: z.enum(['MAN', 'WOMAN', 'OTHER']).optional(),
  targetGender: z.enum(['MEN', 'WOMEN', 'EVERYONE']).optional(),
});

export const createOfferSchema = z.object({
  guestId: z.string().uuid('Valid guestId is required'),
  activityType: z.string().min(1, 'activityType is required').max(100),
  venueName: z.string().min(1, 'venueName is required').max(160),
  venueAddress: z.string().max(240).optional(),
  proposedDateTime: z.string().optional(),
  personalMessage: z.string().max(1000).optional(),
  hospitalityGuarantee: z.string().max(240).optional(),
});

export const respondOfferSchema = z.object({
  action: z.enum(['ACCEPT', 'COUNTER', 'PASS']),
  counterVenue: z.string().max(160).optional(),
  counterTime: z.string().optional(),
  counterNote: z.string().max(600).optional(),
});

export const hostRespondCounterSchema = z.object({
  action: z.enum(['ACCEPT', 'DECLINE']),
});

export const reviewOfferSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(1000).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(2000),
});

export const flagMessageSchema = z.object({
  reason: z.string().min(3, 'Flag reason is required').max(300),
});

export const createReportSchema = z.object({
  reportedId: z.string().uuid('Valid reportedId is required'),
  title: z.string().min(3).max(160),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional().default('MEDIUM'),
  description: z.string().min(5).max(2000),
});

export const updateReportSchema = z.object({
  status: z.enum(['NEW', 'IN_REVIEW', 'RESOLVED']),
  adminNote: z.string().max(1000).optional(),
});

export const moderationActionSchema = z.object({
  action: z.enum(['WARN', 'SUSPEND', 'RESOLVE']),
  note: z.string().max(1000).optional(),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  tierLabel: z.string().min(1).max(40).optional(),
  priceDisplay: z.string().min(1).max(40).optional(),
  priceCents: z.number().int().min(0).optional(),
  features: z.array(z.object({ icon: z.string(), text: z.string() })).optional(),
  footerNote: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
});

export const accountStatusSchema = z.object({
  action: z.enum(['SUSPEND', 'BAN', 'RESTORE']),
});
