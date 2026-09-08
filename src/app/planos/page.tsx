'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle,
  Zap,
  Building2,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { LangSwitcher } from '@/app/_components/LangSwitcher';
import {
  CURRENCIES,
  pricingForCurrency,
  formatPrice,
  detectCurrency,
} from '@/lib/pricing';
import type { MsgKey } from '@/lib/i18n';

const FEATURE_KEYS: MsgKey[] = [
  'plans.feat.unlimitedProperties',
  'plans.feat.aiAgent',
  'plans.feat.leadDashboard',
  'plans.feat.reports',
  'plans.feat.unlimitedPhotos',
  'plans.feat.prioritySupport',
  'plans.feat.whatsiaIntegration',
  'plans.feat.instantLeads',
  'plans.feat.multiUser',
  'plans.feat.aiCustomization',
];

const FAQ_KEYS: { q: MsgKey; a: MsgKey }[] = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
];

export default function PlanosPage() {
  const { t, lang } = useI18n();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<string>(() => detectCurrency());

  const pricing = useMemo(() => pricingForCurrency(currency), [currency]);
  const monthlyPrice = pricing.monthly;
  const annualPrice = pricing.yearly;
  const annualMonthly = Math.round(annualPrice / 12);
  const savings = monthlyPrice * 12 - annualPrice;
  const savingsPct = Math.round((savings / (monthlyPrice * 12)) * 100);

  const fmt = (v: number) => formatPrice(v, pricing);

  const handleSubscribe = async (plan: 'MONTHLY' | 'ANNUAL') => {
    setLoading(true);
    setError('');
    try {
      if (pricing.provider === 'mercadopago') {
        // BRL flow. Gateway is env-selectable ("sem misturar"): Mercado Pago
        // (default), Hotmart, or Cakto — credentials stay server-side, only the
        // choice is exposed to the client. MP keeps the legacy init_point shape;
        // Hotmart/Cakto are hosted links returning { url }.
        const brProvider = (
          process.env.NEXT_PUBLIC_BR_BILLING_PROVIDER || 'mercadopago'
        ).toLowerCase();

        if (brProvider === 'hotmart' || brProvider === 'cakto') {
          const res = await fetch(`/api/${brProvider}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, agencyId: 'demo', currency: pricing.currency }),
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            setError(t('plans.checkoutError'));
          }
        } else {
          // Existing Mercado Pago flow — unchanged.
          const res = await fetch('/api/mercadopago/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, agencyId: 'demo' }),
          });
          const data = await res.json();
          if (data.init_point) {
            window.location.href = data.init_point;
          } else {
            setError(t('plans.checkoutError'));
          }
        }
      } else {
        // International flow — Stripe recurring subscription.
        const res = await fetch('/api/stripe/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, agencyId: 'demo', currency: pricing.currency, locale: lang }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(t('plans.checkoutError'));
        }
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      setError(t('plans.checkoutError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Language + currency controls */}
            <div className="flex justify-center gap-3 mb-6">
              <LangSwitcher />
              <select
                aria-label={t('common.currency')}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg text-sm px-2.5 py-1.5 text-gray-700 hover:border-[#0057FF] focus:outline-none focus:ring-2 focus:ring-[#0057FF]/30"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#0057FF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Building2 size={14} />
              {t('plans.badge')}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('plans.title.pre')}{' '}
              <span className="text-[#0057FF]">{t('plans.title.highlight')}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
              {t('plans.subtitle')}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 bg-gray-100 rounded-2xl p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  !annual
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('plans.toggle.monthly')}
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  annual
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('plans.toggle.annual')}
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  -{savingsPct}%
                </span>
              </button>
            </div>

            {annual && (
              <p className="text-sm text-green-600 font-medium mt-3">
                {t('plans.savings', { amount: fmt(savings) })}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600 font-medium mt-3">{error}</p>
            )}
          </div>
        </section>

        {/* Pricing cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-2 gap-8 -mt-4">
            {/* Monthly */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {t('plans.monthly.name')}
                </h2>
                <p className="text-gray-500 text-sm">{t('plans.monthly.desc')}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {fmt(monthlyPrice)}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">
                    {t('plans.monthly.perMonth')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {t('plans.monthly.billed')}
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => handleSubscribe('MONTHLY')}
                loading={loading}
              >
                {t('plans.monthly.cta')}
              </Button>

              <div className="mt-8 space-y-3">
                {FEATURE_KEYS.map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#0057FF] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annual */}
            <div className="relative bg-gradient-to-br from-[#0057FF] to-[#0041cc] rounded-2xl shadow-xl p-8 overflow-hidden">
              {/* Best choice badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={11} />
                {t('plans.annual.badge')}
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {t('plans.annual.name')}
                  </h2>
                  <p className="text-blue-200 text-sm">{t('plans.annual.desc')}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">
                      {fmt(annualPrice)}
                    </span>
                    <span className="text-blue-200 text-sm mb-1">
                      {t('plans.annual.perYear')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-200 text-xs line-through">
                      {fmt(monthlyPrice * 12)}
                      {t('plans.annual.perYear')}
                    </span>
                    <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {t('plans.annual.perMonthEq', { amount: fmt(annualMonthly) })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe('ANNUAL')}
                  disabled={loading}
                  className="w-full bg-white text-[#0057FF] font-bold text-base py-3.5 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-60"
                >
                  {loading ? t('plans.wait') : t('plans.annual.cta')}
                </button>

                <div className="mt-8 space-y-3">
                  {FEATURE_KEYS.map((key) => (
                    <div key={key} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-blue-200 flex-shrink-0" />
                      <span className="text-sm text-blue-100">{t(key)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              {t('plans.trust.freeTrial')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              {t('plans.trust.cancelAnytime')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              {t('plans.trust.securePayment')}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              {t('plans.trust.support')}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('faq.heading')}
              </h2>
              <p className="text-gray-600">{t('faq.subheading')}</p>
            </div>

            <div className="space-y-3">
              {FAQ_KEYS.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">
                      {t(item.q)}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {t(item.a)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">{t('faq.stillQuestions')}</p>
              <a
                href="https://wa.me/5519982103949?text=Ola!%20Tenho%20interesse%20no%20ImobIA."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <Zap size={16} />
                  {t('faq.talkToSpecialist')}
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
