/**
 * BR billing gateway selection.
 *
 * ImobIA bills BRL through a single Brazilian gateway. Historically that is
 * Mercado Pago, but a deployment can swap it to Hotmart or Cakto via the
 * `BR_BILLING_PROVIDER` env var WITHOUT mixing gateways ("sem misturar").
 *
 * Non-BRL currencies always go through Stripe — unchanged.
 */

export type BrBillingProvider = 'mercadopago' | 'hotmart' | 'cakto';

const VALID: BrBillingProvider[] = ['mercadopago', 'hotmart', 'cakto'];

/**
 * Returns the configured BR gateway. Defaults to 'mercadopago' when the env
 * var is unset or invalid, preserving the existing BRL => Mercado Pago flow.
 * Read lazily so the app boots without the env configured.
 */
export function brBillingProvider(): BrBillingProvider {
  const raw = (process.env.BR_BILLING_PROVIDER || '').toLowerCase().trim();
  return (VALID as string[]).includes(raw) ? (raw as BrBillingProvider) : 'mercadopago';
}
