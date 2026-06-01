'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const MOCK_PROPERTIES = [
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
    id: '8',
    title: 'Terreno para construção em área valorizada',
    address: 'Estrada das Pedras, 100',
    neighborhood: 'Granja Viana',
    city: 'Cotia',
    state: 'SP',
    price: 320000,
    purpose: 'SALE' as const,
    type: 'LAND',
    area: 500,
    bedrooms: null,
    bathrooms: null,
    parkingSpots: null,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'],
    featured: false,
    agencyPhone: '11999999999',
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

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartamento' },
  { value: 'HOUSE', label: 'Casa' },
  { value: 'COMMERCIAL', label: 'Comercial' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'RURAL', label: 'Rural' },
];

const BEDROOMS = ['1', '2', '3', '4+'];

const AMENITIES = [
  'Piscina',
  'Academia',
  'Churrasqueira',
  'Playground',
  'Portaria 24h',
  'Pet friendly',
  'Mobiliado',
  'Ar condicionado',
];

interface Filters {
  purpose: string;
  types: string[];
  bedrooms: string[];
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  amenities: string[];
}

export default function ImoveisPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    purpose: '',
    types: [],
    bedrooms: [],
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    amenities: [],
  });

  const toggleType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const toggleBedrooms = (b: string) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(b)
        ? prev.bedrooms.filter((x) => x !== b)
        : [...prev.bedrooms, b],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const clearFilters = () => {
    setFilters({
      purpose: '',
      types: [],
      bedrooms: [],
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      amenities: [],
    });
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Finalidade */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Finalidade</h3>
        <div className="flex gap-2">
          {['', 'SALE', 'RENT'].map((p) => (
            <button
              key={p}
              onClick={() => setFilters((prev) => ({ ...prev, purpose: p }))}
              className={cn(
                'flex-1 py-2 text-xs font-medium rounded-lg border transition-all',
                filters.purpose === p
                  ? 'bg-[#0057FF] text-white border-[#0057FF]'
                  : 'text-gray-600 border-gray-200 hover:border-gray-400'
              )}
            >
              {p === '' ? 'Todos' : p === 'SALE' ? 'Comprar' : 'Alugar'}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo de imóvel</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.types.includes(type.value)}
                onChange={() => toggleType(type.value)}
                className="rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Faixa de preço</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
          />
        </div>
      </div>

      {/* Quartos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quartos</h3>
        <div className="flex gap-2">
          {BEDROOMS.map((b) => (
            <button
              key={b}
              onClick={() => toggleBedrooms(b)}
              className={cn(
                'flex-1 py-2 text-xs font-medium rounded-lg border transition-all',
                filters.bedrooms.includes(b)
                  ? 'bg-[#0057FF] text-white border-[#0057FF]'
                  : 'text-gray-600 border-gray-200 hover:border-gray-400'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Área */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Área (m²)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minArea}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minArea: e.target.value }))
            }
            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxArea}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxArea: e.target.value }))
            }
            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
          />
        </div>
      </div>

      {/* Amenidades */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Comodidades</h3>
        <div className="space-y-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" size="sm" fullWidth onClick={clearFilters}>
        Limpar filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {MOCK_PROPERTIES.length} imóveis encontrados
              </h1>
              <p className="text-sm text-gray-500">Todo o Brasil</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">Filtros</h2>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#0057FF] hover:underline"
                  >
                    Limpar
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-black/40"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="relative bg-white w-80 h-full overflow-y-auto p-6 z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-gray-900">Filtros</h2>
                    <button onClick={() => setSidebarOpen(false)}>
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {MOCK_PROPERTIES.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
