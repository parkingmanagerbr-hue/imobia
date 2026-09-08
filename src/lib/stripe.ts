/**
 * Stripe helper — international RECURRING billing (non-BRL currencies).
 *
 * Lazy init: if STRIPE_SECRET_KEY is not configured, the app still boots
 * normally (BRL markets via Mercado Pago) and only fails if someone actually
 * tries an international checkout or webhook verification.
 */
import Stripe from 'stripe';
import { pricingForCurrency, stripeLocale } from './pricing';

let _client: Stripe | null = null;

export function getStripe(): Stripe {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured — international billing unavailable');
  }
  _client = new Stripe(key);
  return _client;
}

export interface CreateSubscriptionCheckoutInput {
  plan: 'MONTHLY' | 'ANNUAL';
  currency: string;       // ISO currency code (e.g. 'USD'); must not be BRL
  locale?: string;        // UI language (e.g. 'pt-BR'); mapped to Stripe locale
  agencyId: string;
  customerEmail?: string;
}

/**
 * Creates a Stripe Checkout session in `subscription` mode using inline
 * recurring price_data (monthly or yearly). Returns the checkout URL.
 */
export async function createSubscriptionCheckout(
  input: CreateSubscriptionCheckoutInput,
): Promise<{ url: string; sessionId: string }> {
  const { plan, currency, locale, agencyId, customerEmail } = input;

  const pricing = pricingForCurrency(currency);
  const interval: Stripe.PriceCreateParams.Recurring.Interval =
    plan === 'ANNUAL' ? 'year' : 'month';
  const amount = plan === 'ANNUAL' ? pricing.yearly : pricing.monthly;
  const planName = plan === 'ANNUAL' ? 'Anual' : 'Mensal';

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: pricing.currency.toLowerCase(),
          recurring: { interval },
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `ImobIA - Plano ${planName}`,
          },
        },
      },
    ],
    locale: stripeLocale(locale),
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/planos?checkout=cancelled`,
    metadata: {
      agencyId,
      plan,
      currency: pricing.currency,
    },
    subscription_data: {
      metadata: {
        agencyId,
        plan,
        currency: pricing.currency,
      },
    },
  });

  if (!session.id || !session.url) throw new Error('Stripe did not return a session id/url');
  return { url: session.url, sessionId: session.id };
}

/** Verifies the Stripe webhook signature and returns the parsed event, or null if invalid. */
export function verifyStripeEvent(rawBody: string, sig: string | null): Stripe.Event | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !sig) return null;
  try {
    return getStripe().webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return null;
  }
}
