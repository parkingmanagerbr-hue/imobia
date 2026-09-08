'use client';

import Link from 'next/link';
import {
  Search,
  Home,
  MessageCircle,
  Star,
  ChevronRight,
  Building2,
  Clock,
  Shield,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { useI18n } from '@/lib/i18n';
import { LangSwitcher } from '@/app/_components/LangSwitcher';

const FEATURED_PROPERTIES = [
  {
    id: '1',
    title: 'Apartamento moderno com varanda gourmet',
    address: 'Rua das Flores, 123',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    price: 850000,
    purpose: 'SALE' as const,
    type: 'APARTMENT',
    area: 82,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'],
    featured: true,
    agencyPhone: '11999999999',
  },
  {
    id: '2',
    title: 'Casa espaçosa com piscina em condomínio',
    address: 'Alameda dos Ipês, 456',
    neighborhood: 'Alphaville',
    city: 'Barueri',
    state: 'SP',
    price: 1200000,
    purpose: 'SALE' as const,
    type: 'HOUSE',
    area: 250,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpots: 2,
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'],
    featured: true,
    agencyPhone: '11999999999',
  },
  {
    id: '3',
    title: 'Studio charmoso no centro histórico',
    address: 'Rua XV de Novembro, 789',
    neighborhood: 'Centro',
    city: 'Curitiba',
    state: 'PR',
    price: 2500,
    purpose: 'RENT' as const,
    type: 'APARTMENT',
    area: 38,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpots: 0,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
    featured: false,
    agencyPhone: '41999999999',
  },
  {
    id: '4',
    title: 'Cobertura duplex com vista panorâmica',
    address: 'Av. Beira Mar Norte, 1200',
    neighborhood: 'Agronômica',
    city: 'Florianópolis',
    state: 'SC',
    price: 2800000,
    purpose: 'SALE' as const,
    type: 'APARTMENT',
    area: 320,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpots: 3,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
    featured: true,
    agencyPhone: '48999999999',
  },
  {
    id: '5',
    title: 'Casa térrea em bairro tranquilo',
    address: 'Rua das Acácias, 321',
    neighborhood: 'Jardim Paulista',
    city: 'São Paulo',
    state: 'SP',
    price: 4800,
    purpose: 'RENT' as const,
    type: 'HOUSE',
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpots: 2,
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'],
    featured: false,
    agencyPhone: '11999999999',
  },
  {
    id: '6',
    title: 'Sala comercial no Faria Lima',
    address: 'Av. Brigadeiro Faria Lima, 3900',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    price: 12000,
    purpose: 'RENT' as const,
    type: 'COMMERCIAL',
    area: 90,
    bedrooms: null,
    bathrooms: 2,
    parkingSpots: 2,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80'],
    featured: false,
    agencyPhone: '11999999999',
  },
];

export default function HomePage() {
  const { t } = useI18n();

  // Nada aqui pode ser numero que a gente nao mede. As metricas antigas
  // ("2.400+ imoveis", "180+ imobiliarias", "98% satisfacao") eram ficticias
  // num site publico — prospect de imobiliaria checa. Trocadas por
  // caracteristicas verificaveis do proprio produto.
  const STATS = [
    { value: '24/7', label: t('stats.support') },
    { value: 'IA', label: t('stats.ai') },
    { value: 'LGPD', label: t('stats.lgpd') },
    { value: 'Beta', label: t('stats.beta') },
  ];

  const HOW_IT_WORKS = [
    {
      step: '01',
      icon: <Search size={24} />,
      title: t('how.step1.title'),
      description: t('how.step1.desc'),
    },
    {
      step: '02',
      icon: <MessageCircle size={24} />,
      title: t('how.step2.title'),
      description: t('how.step2.desc'),
    },
    {
      step: '03',
      icon: <Home size={24} />,
      title: t('how.step3.title'),
      description: t('how.step3.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex justify-end mb-4">
            <LangSwitcher />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#0057FF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('hero.title.pre')}{' '}
              <span className="text-[#0057FF]">{t('hero.title.highlight')}</span>{' '}
              {t('hero.title.post')}
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              {/* Tabs */}
              <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-xl">
                <button className="flex-1 py-2 text-sm font-semibold text-white bg-[#0057FF] rounded-lg transition-all">
                  {t('hero.tabBuy')}
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all">
                  {t('hero.tabRent')}
                </button>
              </div>

              {/* Search input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF] focus:border-transparent"
                  />
                </div>
                <Link href="/imoveis">
                  <button className="bg-[#0057FF] hover:bg-[#0041cc] text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
                    {t('hero.searchButton')}
                  </button>
                </Link>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {t('hero.searchHint')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0057FF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('how.heading')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('how.subheading')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 shadow-card text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-[#0057FF] rounded-2xl mb-5">
                  {item.icon}
                </div>
                <div className="text-4xl font-black text-gray-100 mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t('featured.heading')}
              </h2>
              <p className="text-gray-600">{t('featured.subheading')}</p>
            </div>
            <Link href="/imoveis">
              <Button variant="outline" size="md">
                {t('featured.viewAll')}
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-amber-950">
              {t('featured.demoBadge')}
            </span>
            <span className="text-sm text-amber-200/90">{t('featured.demoNote')}</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROPERTIES.map((property) => (
              <div key={property.id} className="relative">
                <span className="absolute right-3 top-3 z-10 rounded bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-amber-950 shadow">
                  {t('featured.demoBadge')}
                </span>
                <PropertyCard {...property} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for agencies */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center justify-between gap-12">
            <div className="lg:max-w-xl mb-8 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-blue-900 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Building2 size={14} />
                {t('agencyCta.badge')}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('agencyCta.heading')}
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                {t('agencyCta.body')}
              </p>

              <div className="space-y-3 mb-8">
                {[
                  t('agencyCta.feat1'),
                  t('agencyCta.feat2'),
                  t('agencyCta.feat3'),
                  t('agencyCta.feat4'),
                  t('agencyCta.feat5'),
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-[#0057FF] flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/planos">
                  <Button variant="primary" size="lg">
                    {t('agencyCta.start')}
                    <ChevronRight size={18} />
                  </Button>
                </Link>
                <Link href="/planos">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-gray-800"
                  >
                    {t('agencyCta.viewPlans')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4 lg:max-w-sm">
              {[
                { icon: <Clock size={22} />, title: t('agencyCta.card1.title'), desc: t('agencyCta.card1.desc') },
                { icon: <MessageCircle size={22} />, title: t('agencyCta.card2.title'), desc: t('agencyCta.card2.desc') },
                { icon: <Star size={22} />, title: t('agencyCta.card3.title'), desc: t('agencyCta.card3.desc') },
                { icon: <Shield size={22} />, title: t('agencyCta.card4.title'), desc: t('agencyCta.card4.desc') },
              ].map((item) => (
                <div key={item.title} className="bg-gray-800 rounded-2xl p-5">
                  <div className="text-[#0057FF] mb-3">{item.icon}</div>
                  <div className="text-white font-bold text-lg">{item.title}</div>
                  <div className="text-gray-400 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
                  <Home size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Imob<span className="text-[#0057FF]">IA</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.explore')}</h4>
              <ul className="space-y-2">
                {[
                  t('footer.explore.apartments'),
                  t('footer.explore.houses'),
                  t('footer.explore.commercial'),
                  t('footer.explore.land'),
                ].map((link) => (
                  <li key={link}>
                    <Link href="/imoveis" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.forAgencies')}</h4>
              <ul className="space-y-2">
                {[
                  t('footer.agencies.plans'),
                  t('footer.agencies.whatsia'),
                  t('footer.agencies.dashboard'),
                  t('footer.agencies.support'),
                ].map((link) => (
                  <li key={link}>
                    <Link href="/planos" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="mailto:contato@veloxisit.com.br" className="hover:text-gray-300 transition-colors">contato@veloxisit.com.br</a></li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <a href="https://wa.me/5519982103949" className="hover:text-gray-300 transition-colors">(19) 98210-3949</a>
                </li>
                <li>{t('footer.contact.hours')}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              {t('footer.rights', { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-6">
              <Link href="https://veloxisit.com.br/privacidade/" className="text-gray-600 hover:text-white text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="https://veloxisit.com.br/termos/" className="text-gray-600 hover:text-white text-sm transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="https://veloxisit.com.br/lgpd/" className="text-gray-600 hover:text-white text-sm transition-colors">
                {t('footer.lgpd')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
