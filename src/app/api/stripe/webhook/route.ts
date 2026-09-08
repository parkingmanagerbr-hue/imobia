import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { verifyStripeEvent } from '@/lib/stripe';
import { pricingForCurrency } from '@/lib/pricing';
import { prisma } from '@/lib/prisma';

/**
 * Stripe webhook for international subscriptions. Mirrors the Mercado Pago
 * webhook's Prisma updates (upsert subscription ACTIVE + set user plan/status/
 * expiry by agencyId from metadata; CANCELLED on subscription deletion).
 *
 * NOTE: the Prisma Subscription model has no Stripe-specific columns, so the
 * Stripe subscription id is stored in `mercadoPagoId`/`mercadoPagoSubId`
 * (the only available external-reference fields). The row `id` is set to the
 * Stripe subscription id so upserts are idempotent — same pattern the MP
 * webhook uses with the PreApproval id.
 */
export async function POST(req: NextRequest) {
  // Raw body is required for signature verification.
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  const event = verifyStripeEvent(rawBody, sig);
  if (!event) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const agencyId = session.metadata?.agencyId;
      const plan = (session.metadata?.plan as 'MONTHLY' | 'ANNUAL') || 'MONTHLY';
      const currency = session.metadata?.currency || (session.currency || '').toUpperCase();
      const stripeSubId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

      if (agencyId && stripeSubId) {
        const startDate = new Date();
        const endDate = new Date();
        if (plan === 'ANNUAL') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        const pricing = pricingForCurrency(currency);
        const amount = plan === 'ANNUAL' ? pricing.yearly : pricing.monthly;

        await prisma.subscription.upsert({
          where: { id: stripeSubId },
          create: {
            id: stripeSubId,
            agencyId,
            plan,
            status: 'ACTIVE',
            mercadoPagoId: stripeSubId,
            mercadoPagoSubId: session.id ?? undefined,
            amount,
            startDate,
            endDate,
          },
          update: {
            status: 'ACTIVE',
            endDate,
          },
        });

        await prisma.user.updateMany({
          where: { agencyId },
          data: {
            plan: plan === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY',
            planStatus: 'ACTIVE',
            planExpiresAt: endDate,
          },
        });
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const agencyId = subscription.metadata?.agencyId;
      const stripeSubId = subscription.id;

      if (agencyId) {
        await prisma.subscription.updateMany({
          where: { agencyId, mercadoPagoId: stripeSubId },
          data: { status: 'CANCELLED' },
        });

        await prisma.user.updateMany({
          where: { agencyId },
          data: { planStatus: 'CANCELLED' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
