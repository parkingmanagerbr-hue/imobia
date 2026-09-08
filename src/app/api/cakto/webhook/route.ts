import { NextRequest, NextResponse } from 'next/server';
import { validateCaktoToken, parseCaktoEvent } from '@/lib/cakto';
import { pricingForCurrency } from '@/lib/pricing';
import { prisma } from '@/lib/prisma';

/**
 * Cakto webhook for BRL subscriptions. Mirrors the Stripe/MP webhooks'
 * Prisma updates exactly (upsert subscription ACTIVE + set user plan/status/
 * expiry by agencyId; CANCELLED on refund/chargeback/cancellation).
 *
 * Token verification: a shared secret (body `secret` or header
 * `x-cakto-signature`/`x-cakto-token`) is compared in constant time against
 * `CAKTO_WEBHOOK_SECRET`.
 *
 * Storage convention (no Cakto-specific Prisma columns): the Cakto
 * transaction id is stored in `mercadoPagoId`, and the row `id` is set to the
 * transaction id so upserts stay idempotent — same pattern as the Stripe hook.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const headerTok =
    req.headers.get('x-cakto-signature') || req.headers.get('x-cakto-token');
  const bodyTok =
    payload && typeof payload === 'object'
      ? (payload as { secret?: string }).secret
      : undefined;
  const provided = headerTok || bodyTok || null;

  if (!validateCaktoToken(provided, process.env.CAKTO_WEBHOOK_SECRET || null)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const parsed = parseCaktoEvent(payload);

    if (parsed.status === 'active') {
      let agencyId = parsed.agencyId;
      if (!agencyId && parsed.email) {
        const user = await prisma.user.findFirst({
          where: { email: parsed.email, agencyId: { not: null } },
          select: { agencyId: true },
        });
        agencyId = user?.agencyId ?? undefined;
      }

      const externalId = parsed.externalId;
      if (agencyId && externalId) {
        const plan = parsed.plan;
        const startDate = new Date();
        const endDate = new Date();
        if (plan === 'ANNUAL') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        const pricing = pricingForCurrency('BRL');
        const amount = plan === 'ANNUAL' ? pricing.yearly : pricing.monthly;

        await prisma.subscription.upsert({
          where: { id: externalId },
          create: {
            id: externalId,
            agencyId,
            plan,
            status: 'ACTIVE',
            mercadoPagoId: externalId,
            mercadoPagoSubId: parsed.email ?? undefined,
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
    } else if (parsed.status === 'cancelled') {
      let agencyId = parsed.agencyId;
      if (!agencyId && parsed.email) {
        const user = await prisma.user.findFirst({
          where: { email: parsed.email, agencyId: { not: null } },
          select: { agencyId: true },
        });
        agencyId = user?.agencyId ?? undefined;
      }

      if (agencyId) {
        if (parsed.externalId) {
          await prisma.subscription.updateMany({
            where: { agencyId, mercadoPagoId: parsed.externalId },
            data: { status: 'CANCELLED' },
          });
        } else {
          await prisma.subscription.updateMany({
            where: { agencyId },
            data: { status: 'CANCELLED' },
          });
        }

        await prisma.user.updateMany({
          where: { agencyId },
          data: { planStatus: 'CANCELLED' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Cakto webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
