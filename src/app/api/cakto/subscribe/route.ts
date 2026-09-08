import { NextRequest, NextResponse } from 'next/server';
import { caktoCheckoutUrl } from '@/lib/cakto';

/**
 * BRL recurring subscription via Cakto's HOSTED checkout link.
 *
 * Mirrors the Stripe subscribe route's validation style but is BR-only:
 * non-BRL currencies stay on Stripe. Returns the pre-configured hosted
 * checkout URL with the agencyId appended as the `ref` tracking param.
 */
export async function POST(req: NextRequest) {
  try {
    const { plan, agencyId, currency } = (await req.json()) as {
      plan: 'MONTHLY' | 'ANNUAL';
      agencyId: string;
      currency?: string;
    };

    if (!plan || (plan !== 'MONTHLY' && plan !== 'ANNUAL')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!agencyId) {
      return NextResponse.json({ error: 'Missing agencyId' }, { status: 400 });
    }

    const cur = (currency || 'BRL').toUpperCase();
    if (cur !== 'BRL') {
      return NextResponse.json(
        { error: 'Cakto handles BRL only. Use /api/stripe/subscribe for other currencies.' },
        { status: 400 },
      );
    }

    let url: string;
    try {
      url = caktoCheckoutUrl(plan, agencyId);
    } catch (e) {
      console.error('Cakto not configured:', e);
      return NextResponse.json({ error: 'Cakto checkout not configured' }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Cakto subscription error:', error);
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
  }
}
