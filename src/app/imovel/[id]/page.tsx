import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  BedDouble,
  Bath,
  Car,
  Square,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  ChevronLeft,
  CheckCircle,
  Home,
  Calendar,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PropertyCard } from '@/components/ui/PropertyCard';
import {
  formatCurrency,
  formatArea,
  getWhatsAppLink,
  PROPERTY_TYPE_LABELS,
} from '@/lib/utils';

// Mock data - in production this would come from Prisma
const MOCK_PROPERTY = {
  id: '1',
  title: 'Apartamento moderno com varanda gourmet',
  description:
    'Lindo apartamento no coração de Pinheiros, com acabamento de alto padrão e varanda gourmet. O imóvel conta com cozinha americana integrada, sala ampla com piso de porcelanato, quartos com armários planejados e banheiro com box de vidro. Condomínio com portaria 24h, academia, piscina e salão de festas. A dois quarteirões do metrô e próximo a restaurantes, cafés e toda a infraestrutura do bairro.',
  type: 'APARTMENT',
  purpose: 'SALE' as 'SALE' | 'RENT',
  price: 850000,
  condoFee: 980,
  iptu: 3200,
  area: 82,
  bedrooms: 2,
  bathrooms: 2,
  parkingSpots: 1,
  floor: 8,
  furnished: false,
  petFriendly: true,
  address: 'Rua das Flores, 123',
  neighborhood: 'Pinheiros',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '05422-000',
  featured: true,
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  ],
  amenities: [
    'Piscina',
    'Academia',
    'Portaria 24h',
    'Churrasqueira',
    'Salão de festas',
    'Pet friendly',
    'Elevador',
    'Gerador',
  ],
  agency: {
    name: 'Premium Imóveis SP',
    phone: '11999999999',
    creci: 'CRECI 12345-SP',
  },
  views: 247,
  createdAt: new Date().toISOString(),
};

const SIMILAR_PROPERTIES = [
  {
    id: '7',
    title: 'Apartamento 3 quartos com suíte master',
    address: 'Rua Pamplona, 567',
    neighborhood: 'Jardim Paulista',
    city: 'São Paulo',
    state: 'SP',
    price: 1450000,
    purpose: 'SALE' as const,
    type: 'APARTMENT',
    area: 110,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpots: 2,
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80'],
    featured: false,
    agencyPhone: '11999999999',
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
    id: '9',
    title: 'Flat executivo mobiliado',
    address: 'Rua Joaquim Floriano, 820',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    price: 5500,
    purpose: 'RENT' as const,
    type: 'APARTMENT',
    area: 55,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpots: 1,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'],
    featured: false,
    agencyPhone: '11999999999',
  },
];

interface PageProps {
  params: { id: string };
}

export default function ImovelPage({ params }: PageProps) {
  const property = MOCK_PROPERTY;

  const whatsappMessage = `Olá! Tenho interesse no imóvel "${property.title}" em ${property.neighborhood}, ${property.city}. Pode me dar mais informações?`;
  const whatsappLink = getWhatsAppLink(property.agency.phone, whatsappMessage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0057FF] transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link href="/imoveis" className="hover:text-[#0057FF] transition-colors">
                Imóveis
              </Link>
              <span>/</span>
              <span className="text-gray-900 truncate">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#0057FF] mb-6 transition-colors"
          >
            <ChevronLeft size={16} />
            Voltar para a busca
          </Link>

          <div className="lg:flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Image Gallery */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="grid grid-cols-2 gap-1">
                  <div className="col-span-2 relative h-72 sm:h-96">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {property.images.slice(1, 4).map((img, i) => (
                    <div key={i} className="relative h-32 sm:h-40">
                      <Image
                        src={img}
                        alt={`${property.title} - foto ${i + 2}`}
                        fill
                        className="object-cover"
                      />
                      {i === 2 && property.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            +{property.images.length - 4} fotos
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title and badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="primary">
                        {PROPERTY_TYPE_LABELS[property.type]}
                      </Badge>
                      <Badge variant={property.purpose === 'SALE' ? 'default' : 'success'}>
                        {property.purpose === 'SALE' ? 'Venda' : 'Aluguel'}
                      </Badge>
                      {property.featured && (
                        <Badge variant="warning">Destaque</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin size={14} />
                      <span>
                        {property.address}, {property.neighborhood},{' '}
                        {property.city} - {property.state}, {property.zipCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Heart size={18} className="text-gray-500" />
                    </button>
                    <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Share2 size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatCurrency(property.price)}
                    {property.purpose === 'RENT' && (
                      <span className="text-base font-normal text-gray-500">/mês</span>
                    )}
                  </div>
                  {(property.condoFee || property.iptu) && (
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {property.condoFee && (
                        <span>Condomínio: {formatCurrency(property.condoFee)}/mês</span>
                      )}
                      {property.iptu && (
                        <span>IPTU: {formatCurrency(property.iptu)}/ano</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Characteristics */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Características
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-[#0057FF]">
                      <Square size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Área total</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatArea(property.area)}
                      </div>
                    </div>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-[#0057FF]">
                        <BedDouble size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Quartos</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {property.bedrooms}
                        </div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-[#0057FF]">
                        <Bath size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Banheiros</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {property.bathrooms}
                        </div>
                      </div>
                    </div>
                  )}
                  {property.parkingSpots !== undefined && property.parkingSpots > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-[#0057FF]">
                        <Car size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Vagas</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {property.parkingSpots}
                        </div>
                      </div>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-[#0057FF]">
                        <Home size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Andar</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {property.floor}º
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Descrição</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Comodidades
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#0057FF] flex-shrink-0" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map placeholder */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Localização
                </h2>
                <div className="bg-gray-100 rounded-xl h-56 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin size={32} className="mx-auto mb-2" />
                    <p className="text-sm">
                      {property.neighborhood}, {property.city} - {property.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-[#0057FF] rounded-full flex items-center justify-center">
                      <Home size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {property.agency.name}
                      </div>
                      <div className="text-xs text-gray-500">{property.agency.creci}</div>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(property.price)}
                  </div>
                  {property.condoFee && (
                    <div className="text-xs text-gray-500 mb-5">
                      + {formatCurrency(property.condoFee)}/mês de condomínio
                    </div>
                  )}

                  <div className="space-y-3">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" size="lg" fullWidth>
                        <MessageCircle size={18} />
                        Falar no WhatsApp
                      </Button>
                    </a>

                    <a href={`tel:${property.agency.phone}`}>
                      <Button variant="outline" size="md" fullWidth>
                        <Phone size={16} />
                        Ligar agora
                      </Button>
                    </a>

                    <Button variant="secondary" size="md" fullWidth>
                      <Calendar size={16} />
                      Agendar visita
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Atendimento 24/7 via WhatsApp com IA
                  </p>
                </div>

                {/* Quick info */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                  <p className="text-xs text-[#0057FF] font-medium mb-1">
                    Código do imóvel
                  </p>
                  <p className="font-mono text-sm text-gray-700">IMB-{params.id.toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {property.views} visualizações
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar properties */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Imóveis similares
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SIMILAR_PROPERTIES.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
