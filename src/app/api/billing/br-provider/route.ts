import { NextResponse } from 'next/server';

/**
 * Reports which gateway handles BRL ("sem misturar"): mercadopago (default),
 * hotmart, or cakto. The client page reads NEXT_PUBLIC_BR_BILLING_PROVIDER
 * directly, but this server endpoint exposes the same choice for any
 * server-side consumer without leaking gateway credentials.
 *
 * Lazy env access — defaults to mercadopago so behavior is unchanged when the
 * env var is unset.
 */
export async function GET() {
  const provider = (
    process.env.BR_BILLING_PROVIDER ||
    process.env.NEXT_PUBLIC_BR_BILLING_PROVIDER ||
    'mercadopago'
  ).toLowerCase();

  const allowed = ['mercadopago', 'hotmart', 'cakto'];
  return NextResponse.json({
    provider: allowed.includes(provider) ? provider : 'mercadopago',
  });
}
