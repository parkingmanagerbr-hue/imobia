import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckout } from '@/lib/stripe';
import { pricingForCurrency } from '@/lib/pricing';

/**
 * International (non-BRL) recurring subscription checkout via Stripe.
 * BRL goes through /api/mercadopago/subscribe — this route rejects BRL so the
 * two gateways stay cleanly separated.
 */
export async function POST(req: NextRequest) {
  try {
    const { plan, agencyId, currency, locale } = (await req.json()) as {
      plan: 'MONTHLY' | 'ANNUAL';
      agencyId: string;
      currency?: string;
      locale?: string;
    };

    if (!plan || (plan !== 'MONTHLY' && plan !== 'ANNUAL')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!agencyId) {
      return NextResponse.json({ error: 'Missing agencyId' }, { status: 400 });
    }

    const cur = (currency || '').toUpperCase();
    if (!cur || cur === 'BRL') {
      return NextResponse.json(
        { error: 'BRL is handled by Mercado Pago. Use /api/mercadopago/subscribe.' },
        { status: 400 },
      );
    }

    // Guard against unknown currencies falling back to USD silently.
    const pricing = pricingForCurrency(cur);
    if (pricing.currency !== cur) {
      return NextResponse.json({ error: `Unsupported currency: ${cur}` }, { status: 400 });
    }

    const { url } = await createSubscriptionCheckout({
      plan,
      currency: cur,
      locale,
      agencyId,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
  }
}
