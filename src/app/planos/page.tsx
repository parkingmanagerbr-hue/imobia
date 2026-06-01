'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { formatCurrency } from '@/lib/utils';

const FEATURES = [
  'Imóveis ilimitados',
  'Agente IA no WhatsApp 24/7',
  'Dashboard de leads',
  'Relatórios e métricas',
  'Fotos ilimitadas',
  'Suporte prioritário',
  'Integração WhatsIA (Evolution API)',
  'Notificação instantânea de leads',
  'Multi-usuários (até 5 agentes)',
  'Personalização de mensagens IA',
];

const FAQ = [
  {
    question: 'Como funciona o período de teste?',
    answer:
      'Você tem 7 dias grátis para testar todas as funcionalidades sem precisar de cartão de crédito. Após esse período, escolha o plano que melhor se encaixa na sua imobiliária.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer:
      'Sim! Você pode cancelar sua assinatura a qualquer momento diretamente pelo dashboard. No plano anual, não há reembolso proporcional, mas você mantém o acesso até o fim do período pago.',
  },
  {
    question: 'O WhatsIA já está incluído no plano?',
    answer:
      'Sim, a integração com o WhatsIA (Evolution API) está incluída nos dois planos. Você só precisa fornecer sua instância e chave de API do WhatsIA nas configurações.',
  },
  {
    question: 'Quantos imóveis posso cadastrar?',
    answer:
      'Imóveis ilimitados! Não há limite para o número de imóveis que você pode cadastrar na plataforma.',
  },
  {
    question: 'Como funciona o suporte?',
    answer:
      'Oferecemos suporte via WhatsApp e e-mail, de segunda a sexta, das 9h às 18h. Clientes do plano anual têm acesso prioritário com tempo de resposta de até 2 horas.',
  },
  {
    question: 'Posso ter mais de uma imobiliária no mesmo plano?',
    answer:
      'Cada assinatura é vinculada a uma imobiliária. Para múltiplas imobiliárias, entre em contato para planos empresariais com condições especiais.',
  },
];

export default function PlanosPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const monthlyPrice = 499;
  const annualPrice = 4999;
  const annualMonthly = Math.floor(annualPrice / 12);
  const savings = monthlyPrice * 12 - annualPrice;

  const handleSubscribe = async (plan: 'MONTHLY' | 'ANNUAL') => {
    setLoading(true);
    try {
      const res = await fetch('/api/mercadopago/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, agencyId: 'demo' }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error('Error subscribing:', error);
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
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#0057FF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Building2 size={14} />
              Para Imobiliárias
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Digitalize sua imobiliária{' '}
              <span className="text-[#0057FF]">com IA</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
              Escolha o plano ideal e comece a atender seus clientes 24 horas por dia
              via WhatsApp com inteligência artificial.
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
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  annual
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Anual
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  -{Math.round((savings / (monthlyPrice * 12)) * 100)}%
                </span>
              </button>
            </div>

            {annual && (
              <p className="text-sm text-green-600 font-medium mt-3">
                Economize {formatCurrency(savings)} por ano!
              </p>
            )}
          </div>
        </section>

        {/* Pricing cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-2 gap-8 -mt-4">
            {/* Monthly */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Plano Mensal</h2>
                <p className="text-gray-500 text-sm">
                  Flexibilidade total sem compromisso
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {formatCurrency(monthlyPrice)}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">/mês</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Cobrado mensalmente. Cancele quando quiser.
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => handleSubscribe('MONTHLY')}
                loading={loading}
              >
                Assinar mensal
              </Button>

              <div className="mt-8 space-y-3">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#0057FF] flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annual */}
            <div className="relative bg-gradient-to-br from-[#0057FF] to-[#0041cc] rounded-2xl shadow-xl p-8 overflow-hidden">
              {/* Best choice badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={11} />
                MELHOR ESCOLHA
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">Plano Anual</h2>
                  <p className="text-blue-200 text-sm">Máxima economia e prioridade</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">
                      {formatCurrency(annualPrice)}
                    </span>
                    <span className="text-blue-200 text-sm mb-1">/ano</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-200 text-xs line-through">
                      {formatCurrency(monthlyPrice * 12)}/ano
                    </span>
                    <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      = {formatCurrency(annualMonthly)}/mês
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe('ANNUAL')}
                  disabled={loading}
                  className="w-full bg-white text-[#0057FF] font-bold text-base py-3.5 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Aguarde...' : 'Assinar anual'}
                </button>

                <div className="mt-8 space-y-3">
                  {FEATURES.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-blue-200 flex-shrink-0" />
                      <span className="text-sm text-blue-100">{feature}</span>
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
              7 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Cancele quando quiser
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Pagamento seguro via Mercado Pago
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Suporte em português
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Perguntas frequentes
              </h2>
              <p className="text-gray-600">
                Tem mais dúvidas? Entre em contato pelo WhatsApp.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">
                      {item.question}
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
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Ainda tem dúvidas?</p>
              <a
                href="https://wa.me/5511999999999?text=Ola!%20Tenho%20interesse%20no%20ImobIA."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <Zap size={16} />
                  Falar com especialista
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
