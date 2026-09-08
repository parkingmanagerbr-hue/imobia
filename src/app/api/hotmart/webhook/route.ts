import { NextRequest, NextResponse } from 'next/server';
import { validateHottok, parseHotmartEvent } from '@/lib/hotmart';
import { pricingForCurrency } from '@/lib/pricing';
import { prisma } from '@/lib/prisma';

/**
 * Hotmart webhook for BRL subscriptions. Mirrors the Stripe/MP webhooks'
 * Prisma updates exactly (upsert subscription ACTIVE + set user plan/status/
 * expiry by agencyId; CANCELLED on refund/chargeback/cancellation).
 *
 * Token verification: the `hottok` (header `x-hotmart-hottok` or body field)
 * is compared in constant time against `HOTMART_HOTTOK`.
 *
 * Storage convention (no Hotmart-specific Prisma columns): the Hotmart
 * transaction id is stored in `mercadoPagoId`, and the row `id` is set to the
 * transaction id so upserts stay idempotent — same pattern as the Stripe hook.
 */
export async function POST(req: NextRequest) {
  // Raw body so we can token-verify and JSON.parse ourselves.
  const rawBody = await req.text();

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const headerTok = req.headers.get('x-hotmart-hottok');
  const bodyTok =
    payload && typeof payload === 'object'
      ? (payload as { hottok?: string }).hottok
      : undefined;
  const provided = headerTok || bodyTok || null;

  if (!validateHottok(provided, process.env.HOTMART_HOTTOK || null)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const parsed = parseHotmartEvent(payload);

    if (parsed.status === 'active') {
      // Recover agencyId: echoed sck ref, else look up by buyer email.
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
      // Recover agencyId the same way before cancelling.
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
    console.error('Hotmart webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
