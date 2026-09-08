/**
 * Multi-currency PPP pricing table for ImobIA's RECURRING subscription model.
 *
 * ImobIA charges a recurring subscription (monthly or annual). Each currency is
 * billed through the appropriate gateway:
 *   - BRL  -> Mercado Pago (Brazil)  — existing flow, unchanged
 *   - all others -> Stripe (international)
 *
 * Non-BRL prices are PPP-adjusted (purchasing-power parity, NOT live FX) with
 * charm pricing already applied. The values below are the confirmed amounts.
 *
 * `monthly` = price charged each month on the MONTHLY plan.
 * `yearly`  = price charged each year on the ANNUAL plan.
 */

import type Stripe from 'stripe';

export type Provider = 'mercadopago' | 'stripe';

export interface CurrencyPricing {
  currency: string;
  locale: string;
  monthly: number;
  yearly: number;
  provider: Provider;
}

export const PRICING: Record<string, CurrencyPricing> = {
  // Real, confirmed prices (BRL) — Mercado Pago.
  BRL: { currency: 'BRL', locale: 'pt-BR', monthly: 499,  yearly: 4999,  provider: 'mercadopago' },

  // PPP-adjusted, charm pricing — Stripe.
  USD: { currency: 'USD', locale: 'en-US', monthly: 199,  yearly: 1999,  provider: 'stripe' },
  EUR: { currency: 'EUR', locale: 'de-DE', monthly: 149,  yearly: 1499,  provider: 'stripe' },
  GBP: { currency: 'GBP', locale: 'en-GB', monthly: 139,  yearly: 1399,  provider: 'stripe' },
  CAD: { currency: 'CAD', locale: 'en-CA', monthly: 249,  yearly: 2499,  provider: 'stripe' },
  AUD: { currency: 'AUD', locale: 'en-AU', monthly: 289,  yearly: 2899,  provider: 'stripe' },
  MXN: { currency: 'MXN', locale: 'es-MX', monthly: 1799, yearly: 17999, provider: 'stripe' },
};

export const DEFAULT_CURRENCY = 'USD';

/** Country (ISO 3166-1 alpha-2) -> currency. */
export const COUNTRY_CURRENCY: Record<string, string> = {
  BR: 'BRL',
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP', UK: 'GBP',
  AU: 'AUD',
  MX: 'MXN',
  PT: 'EUR', ES: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR',
  IE: 'EUR', NL: 'EUR', AT: 'EUR', BE: 'EUR', PL: 'EUR',
};

export const CURRENCIES = Object.keys(PRICING);

export function pricingForCurrency(currency?: string | null): CurrencyPricing {
  if (!currency) return PRICING[DEFAULT_CURRENCY];
  return PRICING[currency.toUpperCase()] ?? PRICING[DEFAULT_CURRENCY];
}

export function currencyForCountry(country?: string | null): string {
  if (!country) return DEFAULT_CURRENCY;
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? DEFAULT_CURRENCY;
}

/** Detects the user's currency from the browser locale/region. */
export function detectCurrency(): string {
  if (typeof navigator === 'undefined') return DEFAULT_CURRENCY;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of langs) {
    if (!tag) continue;
    try {
      const region = new Intl.Locale(tag).maximize().region;
      if (region && COUNTRY_CURRENCY[region]) return COUNTRY_CURRENCY[region];
    } catch { /* invalid tag, continue */ }
  }
  return DEFAULT_CURRENCY;
}

export function formatPrice(amount: number, p: CurrencyPricing): string {
  try {
    return new Intl.NumberFormat(p.locale, {
      style: 'currency',
      currency: p.currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${p.currency} ${amount}`;
  }
}

/** Locales supported by Stripe Checkout — maps the UI language to Stripe's set. */
export const STRIPE_LOCALES: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  en: 'en', 'pt-BR': 'pt-BR', pt: 'pt-BR', es: 'es', fr: 'fr', de: 'de',
  it: 'it', nl: 'nl', pl: 'pl', ja: 'ja', zh: 'zh',
};

export function stripeLocale(locale?: string): Stripe.Checkout.SessionCreateParams.Locale {
  if (!locale) return 'auto';
  return STRIPE_LOCALES[locale] ?? STRIPE_LOCALES[locale.split('-')[0]] ?? 'auto';
}
