import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { stripe } from '../../config/stripe';
import { AppError } from '../../middleware/errorHandler';
import { Role, SubscriptionStatus } from '@prisma/client';

export class BillingController {
  // GET /api/billing/plans - Public active subscription plans from DB
  static async getPlans(_req: Request, res: Response): Promise<void> {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });

    res.json({
      success: true,
      count: plans.length,
      data: plans,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    });
  }

  // GET /api/billing/status - Authenticated user's subscription state
  static async getBillingStatus(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    res.json({
      success: true,
      data: subscription,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    });
  }

  // POST /api/billing/checkout - Create Stripe Checkout Session for Host Pro ($9.99/Mo)
  static async createCheckoutSession(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    if (!stripe) {
      throw new AppError('Stripe is not configured on the server', 500);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === Role.GUEST) {
      throw new AppError('Guests of Honor never pay — complimentary membership is active.', 400);
    }

    const hostPlan = await prisma.subscriptionPlan.findFirst({
      where: { variant: 'host', isActive: true },
    });

    const unitAmount = hostPlan?.priceCents ?? 999;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: hostPlan?.name || 'thedateboss Host Pro',
              description: 'Send date offers to verified Guests of Honor',
            },
            unit_amount: unitAmount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planCode: hostPlan?.code || 'HOST_MONTHLY_PRO',
      },
      success_url: `${clientUrl}/#step12?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/#step12?billing=cancelled`,
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
      },
    });
  }

  // POST /api/billing/confirm-session - Verify Stripe Checkout session & activate Host subscription
  static async confirmCheckoutSession(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.body;

    if (!stripe) {
      throw new AppError('Stripe is not configured on the server', 500);
    }
    if (!sessionId) {
      throw new AppError('sessionId is required', 400);
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      throw new AppError('Stripe payment has not been completed yet', 400);
    }

    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: session.metadata?.planCode || 'HOST_MONTHLY_PRO',
        priceCents: session.amount_total ?? 999,
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        stripeSubscriptionId:
          typeof session.subscription === 'string' ? session.subscription : undefined,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId,
        plan: session.metadata?.planCode || 'HOST_MONTHLY_PRO',
        priceCents: session.amount_total ?? 999,
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        stripeSubscriptionId:
          typeof session.subscription === 'string' ? session.subscription : undefined,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: 12, isVerified: true },
    });

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: subscription,
    });
  }

  // POST /api/billing/webhook - Stripe Webhook handler
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    if (!stripe) {
      res.status(500).json({ success: false, message: 'Stripe not configured' });
      return;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: any = req.body;

    if (webhookSecret && req.headers['stripe-signature']) {
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          req.headers['stripe-signature'] as string,
          webhookSecret
        );
      } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        const userId = session?.metadata?.userId;
        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              status: SubscriptionStatus.ACTIVE,
              stripeCustomerId: session.customer || undefined,
              stripeSubscriptionId: session.subscription || undefined,
            },
            create: {
              userId,
              plan: session?.metadata?.planCode || 'HOST_MONTHLY_PRO',
              priceCents: 999,
              status: SubscriptionStatus.ACTIVE,
              stripeCustomerId: session.customer || undefined,
              stripeSubscriptionId: session.subscription || undefined,
            },
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const subId = event.data?.object?.subscription;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: SubscriptionStatus.PAST_DUE },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subId = event.data?.object?.id;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: SubscriptionStatus.CANCELLED },
          });
        }
        break;
      }
    }

    res.json({ received: true });
  }
}
