import Image from 'next/image';
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

const STATS = [
  { value: '2.400+', label: 'imóveis disponíveis' },
  { value: '180+', label: 'imobiliárias parceiras' },
  { value: '98%', label: 'clientes satisfeitos' },
  { value: '24/7', label: 'atendimento IA' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Search size={24} />,
    title: 'Busque',
    description:
      'Use nossos filtros inteligentes para encontrar o imóvel ideal. Filtre por localização, preço, tamanho e muito mais.',
  },
  {
    step: '02',
    icon: <MessageCircle size={24} />,
    title: 'Agende via WhatsApp IA',
    description:
      'Nossa IA responde instantaneamente no WhatsApp, 24 horas por dia. Agende visitas, tire dúvidas e receba propostas.',
  },
  {
    step: '03',
    icon: <Home size={24} />,
    title: 'Realize o sonho',
    description:
      'Feche negócio com total segurança. Nossas imobiliárias parceiras cuidam de toda a documentação para você.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#0057FF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap size={14} />
              Atendimento com IA 24/7 via WhatsApp
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Encontre o imóvel{' '}
              <span className="text-[#0057FF]">perfeito</span> com IA
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Mais de 2.400 imóveis em todo o Brasil. Atendimento instantâneo via
              WhatsApp com inteligência artificial, disponível 24 horas por dia.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              {/* Tabs */}
              <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-xl">
                <button className="flex-1 py-2 text-sm font-semibold text-white bg-[#0057FF] rounded-lg transition-all">
                  Comprar
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-all">
                  Alugar
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
                    placeholder="Cidade, bairro ou endereço..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057FF] focus:border-transparent"
                  />
                </div>
                <Link href="/imoveis">
                  <button className="bg-[#0057FF] hover:bg-[#0041cc] text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
                    Buscar
                  </button>
                </Link>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Buscar em São Paulo, Rio de Janeiro, Curitiba, Florianópolis...
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
              Como funciona
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Encontrar seu próximo imóvel nunca foi tão simples. Três passos e você já
              está conversando com um especialista.
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
                Imóveis em destaque
              </h2>
              <p className="text-gray-600">Selecionados especialmente para você</p>
            </div>
            <Link href="/imoveis">
              <Button variant="outline" size="md">
                Ver todos
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} {...property} />
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
                Para Imobiliárias
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Digitalize sua imobiliária com IA
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Integre o WhatsIA à sua imobiliária e tenha um agente de IA atendendo
                seus clientes 24 horas por dia, 7 dias por semana. Nunca perca um lead.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Agente IA no WhatsApp 24/7',
                  'Dashboard completo de leads',
                  'Imóveis ilimitados',
                  'Relatórios e métricas',
                  'Suporte prioritário',
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
                    Começar agora
                    <ChevronRight size={18} />
                  </Button>
                </Link>
                <Link href="/planos">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-gray-800"
                  >
                    Ver planos
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4 lg:max-w-sm">
              {[
                { icon: <Clock size={22} />, title: '24/7', desc: 'Atendimento ininterrupto' },
                { icon: <MessageCircle size={22} />, title: 'WhatsApp', desc: 'Canal preferido dos brasileiros' },
                { icon: <Star size={22} />, title: '98%', desc: 'Taxa de satisfação' },
                { icon: <Shield size={22} />, title: 'Seguro', desc: 'Dados protegidos LGPD' },
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
                A plataforma imobiliária que usa IA para conectar compradores,
                locatários e imobiliárias.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Explorar</h4>
              <ul className="space-y-2">
                {['Apartamentos', 'Casas', 'Comercial', 'Terrenos'].map((link) => (
                  <li key={link}>
                    <Link href="/imoveis" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Para Imobiliárias</h4>
              <ul className="space-y-2">
                {['Planos', 'WhatsIA', 'Dashboard', 'Suporte'].map((link) => (
                  <li key={link}>
                    <Link href="/planos" className="text-gray-500 hover:text-white text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li>contato@veloxisit.com.br</li>
                <li>Seg–Sex, 9h–18h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 ImobIA. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-white text-sm transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-gray-600 hover:text-white text-sm transition-colors">
                Termos
              </Link>
              <Link href="#" className="text-gray-600 hover:text-white text-sm transition-colors">
                LGPD
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
