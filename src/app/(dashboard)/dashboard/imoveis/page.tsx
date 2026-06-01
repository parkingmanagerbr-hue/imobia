import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  formatCurrency,
  formatArea,
  PROPERTY_TYPE_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_STATUS_LABELS,
} from '@/lib/utils';

interface MockProperty {
  id: string;
  title: string;
  type: string;
  purpose: 'SALE' | 'RENT';
  price: number;
  area: number;
  bedrooms: number | null;
  city: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED';
  images: string[];
  createdAt: string;
}

const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: '1',
    title: 'Apartamento moderno com varanda gourmet',
    type: 'APARTMENT',
    purpose: 'SALE',
    price: 850000,
    area: 82,
    bedrooms: 2,
    city: 'São Paulo',
    state: 'SP',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=60'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Casa espaçosa com piscina em condomínio',
    type: 'HOUSE',
    purpose: 'SALE',
    price: 1200000,
    area: 250,
    bedrooms: 4,
    city: 'Barueri',
    state: 'SP',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=60'],
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Studio charmoso no centro histórico',
    type: 'APARTMENT',
    purpose: 'RENT',
    price: 2500,
    area: 38,
    bedrooms: 1,
    city: 'Curitiba',
    state: 'PR',
    status: 'RENTED',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=60'],
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Cobertura duplex com vista panorâmica',
    type: 'APARTMENT',
    purpose: 'SALE',
    price: 2800000,
    area: 320,
    bedrooms: 4,
    city: 'Florianópolis',
    state: 'SC',
    status: 'ACTIVE',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60'],
    createdAt: '2024-01-03',
  },
  {
    id: '5',
    title: 'Sala comercial no Faria Lima',
    type: 'COMMERCIAL',
    purpose: 'RENT',
    price: 12000,
    area: 90,
    bedrooms: null,
    city: 'São Paulo',
    state: 'SP',
    status: 'INACTIVE',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=60'],
    createdAt: '2023-12-20',
  },
];

const statusBadgeVariant: Record<
  MockProperty['status'],
  'success' | 'danger' | 'info' | 'warning'
> = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  SOLD: 'info',
  RENTED: 'danger',
};

export default function ImoveisDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie seu portfólio de imóveis
          </p>
        </div>
        <Link href="/dashboard/imoveis/novo">
          <Button variant="primary" size="md">
            <Plus size={16} />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-48">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar imóveis..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Todos', 'Ativos', 'Inativos', 'Vendidos', 'Alugados'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 hover:border-[#0057FF] hover:text-[#0057FF] transition-all first:bg-[#0057FF] first:text-white first:border-[#0057FF]"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {MOCK_PROPERTIES.length} imóveis cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    Imóvel
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">
                    Finalidade
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                    Preço
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_PROPERTIES.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm line-clamp-1 max-w-48">
                            {property.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.city}, {property.state} •{' '}
                            {formatArea(property.area)}
                            {property.bedrooms && ` • ${property.bedrooms} qts`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {PROPERTY_TYPE_LABELS[property.type]}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">
                        {PROPERTY_PURPOSE_LABELS[property.purpose]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatCurrency(property.price)}
                        {property.purpose === 'RENT' && (
                          <span className="text-xs font-normal text-gray-400">/mês</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusBadgeVariant[property.status]}>
                        {PROPERTY_STATUS_LABELS[property.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/imovel/${property.id}`} target="_blank">
                          <button
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057FF] hover:bg-blue-50 transition-colors"
                            title="Ver imóvel"
                          >
                            <Eye size={15} />
                          </button>
                        </Link>
                        <Link href={`/dashboard/imoveis/${property.id}/editar`}>
                          <button
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Editar"
                          >
                            <Edit size={15} />
                          </button>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          title={
                            property.status === 'ACTIVE' ? 'Desativar' : 'Ativar'
                          }
                        >
                          {property.status === 'ACTIVE' ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
