/**
 * Cakto helper — BRL RECURRING billing via a HOSTED checkout link.
 *
 * Cakto checkout is a pre-configured offer URL per plan
 * (`pay.cakto.com.br/{slug}`). The agency is mapped by appending a `ref`
 * tracking param echoed back on the webhook; fallback is the buyer email.
 * Webhooks carry a shared secret token (body `secret` or header).
 *
 * Lazy env access: nothing is read at import time, so `next build` succeeds
 * with none of the Cakto env vars set.
 */
import crypto from 'crypto';

export type SubscriptionPlanKey = 'MONTHLY' | 'ANNUAL';

export interface ParsedCaktoEvent {
  status: 'active' | 'cancelled' | 'ignored';
  email?: string;
  externalId?: string;
  agencyId?: string;
  plan: SubscriptionPlanKey;
}

/** Constant-time comparison of the Cakto shared webhook token. Never throws. */
export function validateCaktoToken(provided?: string | null, expected?: string | null): boolean {
  if (!provided || !expected) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Builds the hosted checkout URL for the given plan and appends the `ref`
 * tracking param carrying the agencyId. Throws a clear error if the offer URL
 * for the plan is not configured.
 */
export function caktoCheckoutUrl(plan: SubscriptionPlanKey, agencyId: string): string {
  const envKey = plan === 'ANNUAL' ? 'CAKTO_OFFER_ANNUAL_URL' : 'CAKTO_OFFER_MONTHLY_URL';
  const base = process.env[envKey];
  if (!base) {
    throw new Error(`${envKey} not configured — Cakto ${plan} checkout unavailable`);
  }
  try {
    const url = new URL(base);
    if (agencyId) url.searchParams.set('ref', agencyId);
    return url.toString();
  } catch {
    const sep = base.includes('?') ? '&' : '?';
    return agencyId ? `${base}${sep}ref=${encodeURIComponent(agencyId)}` : base;
  }
}

/** Maps a Cakto offer code/slug to a plan via env, defaulting to MONTHLY. */
function planForOfferCode(code?: string | null): SubscriptionPlanKey {
  if (!code) return 'MONTHLY';
  const annual = process.env.CAKTO_OFFER_ANNUAL_CODE;
  const monthly = process.env.CAKTO_OFFER_MONTHLY_CODE;
  if (annual && code === annual) return 'ANNUAL';
  if (monthly && code === monthly) return 'MONTHLY';
  return 'MONTHLY';
}

type AnyRecord = Record<string, unknown>;

function asRecord(v: unknown): AnyRecord {
  return v && typeof v === 'object' ? (v as AnyRecord) : {};
}

function str(v: unknown): string | undefined {
  if (typeof v === 'string' && v) return v;
  if (typeof v === 'number') return String(v);
  return undefined;
}

/**
 * Normalizes a Cakto webhook payload into a gateway-agnostic shape.
 *
 * Cakto sends `{ event, secret, data: { customer, product/offer, ... } }`.
 * purchase_approved/subscription_renewed => active;
 * refund/chargeback/subscription_canceled => cancelled. Extracts customer
 * email, transaction id, the echoed `ref` agency reference and offer => plan.
 */
export function parseCaktoEvent(payload: unknown): ParsedCaktoEvent {
  const root = asRecord(payload);
  const event = (str(root.event) || str(root.type) || str(root.status) || '').toLowerCase();
  const data = asRecord(root.data);

  const customer = asRecord(data.customer);
  const offer = asRecord(data.offer);
  const product = asRecord(data.product);
  const subscription = asRecord(data.subscription);

  let status: ParsedCaktoEvent['status'] = 'ignored';
  if (/purchase_approved|subscription_renewed|approved|paid|renewed/.test(event)) {
    status = 'active';
  } else if (/refund|chargeback|subscription_canceled|subscription_cancelled|canceled|cancelled/.test(event)) {
    status = 'cancelled';
  }

  const email = str(customer.email) || str(asRecord(data.buyer).email);

  const externalId =
    str(data.id) ||
    str(data.transaction_id) ||
    str(subscription.id) ||
    str(root.id);

  const agencyId =
    str(data.ref) ||
    str((root as AnyRecord).ref) ||
    str(asRecord(data.tracking).ref) ||
    str(asRecord(root.query).ref);

  const offerCode = str(offer.id) || str(offer.slug) || str(product.id) || str(subscription.plan);
  const plan = planForOfferCode(offerCode);

  return { status, email, externalId, agencyId, plan };
}
