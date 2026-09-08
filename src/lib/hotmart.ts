/**
 * Hotmart helper — BRL RECURRING billing via a HOSTED checkout link.
 *
 * Unlike Stripe/MP, Hotmart checkout is a pre-configured offer URL per plan
 * (from env). The agency is mapped by appending an `sck` tracking param that
 * Hotmart echoes back on the webhook; if it is missing we fall back to the
 * buyer email.
 *
 * Lazy env access: nothing is read at import time, so `next build` succeeds
 * with none of the Hotmart env vars set.
 */
import crypto from 'crypto';

export type SubscriptionPlanKey = 'MONTHLY' | 'ANNUAL';

export interface ParsedHotmartEvent {
  status: 'active' | 'cancelled' | 'ignored';
  email?: string;
  externalId?: string;
  agencyId?: string;
  plan: SubscriptionPlanKey;
}

/** Constant-time comparison of the hottok webhook token. Never throws. */
export function validateHottok(provided?: string | null, expected?: string | null): boolean {
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
 * Builds the hosted checkout URL for the given plan and appends the `sck`
 * tracking param carrying the agencyId. Throws a clear error if the offer URL
 * for the plan is not configured.
 */
export function hotmartCheckoutUrl(plan: SubscriptionPlanKey, agencyId: string): string {
  const envKey = plan === 'ANNUAL' ? 'HOTMART_OFFER_ANNUAL_URL' : 'HOTMART_OFFER_MONTHLY_URL';
  const base = process.env[envKey];
  if (!base) {
    throw new Error(`${envKey} not configured — Hotmart ${plan} checkout unavailable`);
  }
  try {
    const url = new URL(base);
    // `sck` is Hotmart's source/tracking param, echoed back on the webhook.
    if (agencyId) url.searchParams.set('sck', agencyId);
    return url.toString();
  } catch {
    // Fall back to a raw append if the env value is not a fully-qualified URL.
    const sep = base.includes('?') ? '&' : '?';
    return agencyId ? `${base}${sep}sck=${encodeURIComponent(agencyId)}` : base;
  }
}

/** Maps a Hotmart offer code to a plan via env, defaulting to MONTHLY. */
function planForOfferCode(code?: string | null): SubscriptionPlanKey {
  if (!code) return 'MONTHLY';
  const annual = process.env.HOTMART_OFFER_ANNUAL_CODE;
  const monthly = process.env.HOTMART_OFFER_MONTHLY_CODE;
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
 * Normalizes a Hotmart webhook payload into a gateway-agnostic shape.
 *
 * Hotmart sends `{ event, data: { buyer, purchase, subscription, ... } }`.
 * APPROVED/COMPLETE => active; REFUNDED/CHARGEBACK/CANCELED/CANCELLATION =>
 * cancelled. Extracts buyer email, transaction id, the echoed `sck` agency
 * reference, and the offer code => plan.
 */
export function parseHotmartEvent(payload: unknown): ParsedHotmartEvent {
  const root = asRecord(payload);
  const event = (str(root.event) || str(root.status) || '').toUpperCase();
  const data = asRecord(root.data);

  const buyer = asRecord(data.buyer);
  const purchase = asRecord(data.purchase);
  const subscription = asRecord(data.subscription);
  const offer = asRecord(purchase.offer);
  const tracking = { ...asRecord(purchase.tracking), ...asRecord(root.tracking) };

  let status: ParsedHotmartEvent['status'] = 'ignored';
  if (/PURCHASE_APPROVED|PURCHASE_COMPLETE|APPROVED|COMPLETE/.test(event)) {
    status = 'active';
  } else if (
    /PURCHASE_REFUNDED|REFUND|CHARGEBACK|CANCELED|CANCELLED|SUBSCRIPTION_CANCELLATION|CANCELLATION/.test(
      event,
    )
  ) {
    status = 'cancelled';
  }

  const email = str(buyer.email) || str(asRecord(data.subscriber).email);

  const externalId =
    str(purchase.transaction) ||
    str(subscription.subscriber_code) ||
    str(subscription.code) ||
    str(root.id);

  const agencyId =
    str(tracking.source_sck) ||
    str(tracking.sck) ||
    str((root as AnyRecord).sck) ||
    str(asRecord(root.query).sck);

  const offerCode = str(offer.code) || str(offer.key) || str(subscription.plan);
  const plan = planForOfferCode(offerCode);

  return { status, email, externalId, agencyId, plan };
}
