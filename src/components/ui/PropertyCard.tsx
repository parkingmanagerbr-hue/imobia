import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Car, Square, MessageCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import {
  formatCurrency,
  formatArea,
  getWhatsAppLink,
  PROPERTY_TYPE_LABELS,
} from '@/lib/utils';

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  price: number;
  purpose: 'SALE' | 'RENT';
  type: string;
  area: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpots?: number | null;
  images: string[];
  featured?: boolean;
  agencyPhone?: string;
  agencyName?: string;
}

export function PropertyCard({
  id,
  title,
  address,
  neighborhood,
  city,
  state,
  price,
  purpose,
  type,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  images,
  featured = false,
  agencyPhone,
  agencyName,
}: PropertyCardProps) {
  const mainImage =
    images[0] ||
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';

  const whatsappMessage = `Olá! Tenho interesse no imóvel "${title}" em ${neighborhood}, ${city}. Pode me dar mais informações?`;
  const whatsappLink = agencyPhone
    ? getWhatsAppLink(agencyPhone, whatsappMessage)
    : '#';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="bg-[#0057FF] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Destaque
            </span>
          )}
          <span className="bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {purpose === 'RENT' ? 'Aluguel' : 'Venda'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge variant="default" className="mb-2">
          {PROPERTY_TYPE_LABELS[type] || type}
        </Badge>

        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} />
          <span className="line-clamp-1">
            {neighborhood}, {city} - {state}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
          <span className="flex items-center gap-1">
            <Square size={13} />
            {formatArea(area)}
          </span>
          {bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} />
              {bedrooms} qts
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={13} />
              {bathrooms}
            </span>
          )}
          {parkingSpots && (
            <span className="flex items-center gap-1">
              <Car size={13} />
              {parkingSpots}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(price)}
          </span>
          {purpose === 'RENT' && (
            <span className="text-gray-500 text-sm">/mês</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/imovel/${id}`} className="flex-1">
            <Button variant="outline" size="sm" fullWidth>
              Ver imóvel
            </Button>
          </Link>
          {agencyPhone && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="sm">
                <MessageCircle size={14} />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
