'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const propertySchema = z.object({
  type: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND', 'RURAL']),
  purpose: z.enum(['SALE', 'RENT']),
  title: z.string().min(10, 'Título deve ter pelo menos 10 caracteres'),
  description: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  condoFee: z.coerce.number().min(0).optional(),
  iptu: z.coerce.number().min(0).optional(),
  area: z.coerce.number().positive('Área deve ser positiva'),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  parkingSpots: z.coerce.number().min(0).optional(),
  floor: z.coerce.number().min(0).optional(),
  furnished: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  zipCode: z.string().min(8, 'CEP inválido'),
  address: z.string().min(5, 'Endereço obrigatório'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const AMENITIES_OPTIONS = [
  'Piscina',
  'Academia',
  'Churrasqueira',
  'Playground',
  'Salão de festas',
  'Portaria 24h',
  'Elevador',
  'Gerador',
  'Pet friendly',
  'Mobiliado',
  'Ar condicionado',
  'Varanda',
  'Vista para o mar',
  'Área de serviço',
  'Depósito',
  'Jardim',
];

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];

export default function NovoImovelPage() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'APARTMENT',
      purpose: 'SALE',
      status: 'ACTIVE',
      furnished: false,
      petFriendly: false,
    },
  });

  const propertyType = watch('type');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amenities: selectedAmenities,
          images,
        }),
      });

      if (res.ok) {
        window.location.href = '/dashboard/imoveis';
      }
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  const showBedroomsBathrooms = propertyType !== 'LAND' && propertyType !== 'RURAL';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/imoveis">
          <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Imóvel</h1>
          <p className="text-gray-500 text-sm mt-1">
            Preencha os dados do imóvel para publicar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Informações básicas</CardTitle>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Tipo de imóvel <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF] bg-white"
                >
                  <option value="APARTMENT">Apartamento</option>
                  <option value="HOUSE">Casa</option>
                  <option value="COMMERCIAL">Comercial</option>
                  <option value="LAND">Terreno</option>
                  <option value="RURAL">Rural</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Finalidade <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('purpose')}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF] bg-white"
                >
                  <option value="SALE">Venda</option>
                  <option value="RENT">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <Input
                label="Título do anúncio"
                placeholder="Ex: Apartamento 2 quartos com varanda em Pinheiros"
                required
                error={errors.title?.message}
                {...register('title')}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Descreva o imóvel em detalhes: características, localização, diferenciais..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF] resize-none"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Valores</CardTitle>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Preço"
                type="number"
                placeholder="0"
                required
                error={errors.price?.message}
                hint="Em reais (R$)"
                {...register('price')}
              />
              <Input
                label="Condomínio"
                type="number"
                placeholder="0"
                hint="Valor mensal em R$"
                error={errors.condoFee?.message}
                {...register('condoFee')}
              />
              <Input
                label="IPTU"
                type="number"
                placeholder="0"
                hint="Valor anual em R$"
                error={errors.iptu?.message}
                {...register('iptu')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Detalhes do imóvel</CardTitle>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Área total (m²)"
                type="number"
                placeholder="0"
                required
                error={errors.area?.message}
                {...register('area')}
              />
              {showBedroomsBathrooms && (
                <>
                  <Input
                    label="Quartos"
                    type="number"
                    placeholder="0"
                    error={errors.bedrooms?.message}
                    {...register('bedrooms')}
                  />
                  <Input
                    label="Banheiros"
                    type="number"
                    placeholder="0"
                    error={errors.bathrooms?.message}
                    {...register('bathrooms')}
                  />
                </>
              )}
              <Input
                label="Vagas de garagem"
                type="number"
                placeholder="0"
                error={errors.parkingSpots?.message}
                {...register('parkingSpots')}
              />
              {propertyType === 'APARTMENT' && (
                <Input
                  label="Andar"
                  type="number"
                  placeholder="0"
                  error={errors.floor?.message}
                  {...register('floor')}
                />
              )}
            </div>

            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('furnished')}
                  className="rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
                />
                <span className="text-sm text-gray-700">Mobiliado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('petFriendly')}
                  className="rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
                />
                <span className="text-sm text-gray-700">Pet friendly</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardContent>
            <CardTitle className="mb-6">Endereço</CardTitle>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <Input
                label="CEP"
                placeholder="00000-000"
                required
                error={errors.zipCode?.message}
                {...register('zipCode')}
              />
              <Input
                label="Bairro"
                placeholder="Nome do bairro"
                required
                error={errors.neighborhood?.message}
                {...register('neighborhood')}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Cidade"
                  placeholder="Cidade"
                  required
                  error={errors.city?.message}
                  {...register('city')}
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('state')}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF] bg-white"
                  >
                    <option value="">UF</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Input
              label="Endereço completo"
              placeholder="Rua, número, complemento"
              required
              error={errors.address?.message}
              {...register('address')}
            />
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent>
            <CardTitle className="mb-2">Comodidades</CardTitle>
            <p className="text-sm text-gray-500 mb-4">
              Selecione as comodidades disponíveis
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded border-gray-300 text-[#0057FF] focus:ring-[#0057FF]"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardContent>
            <CardTitle className="mb-2">Fotos</CardTitle>
            <p className="text-sm text-gray-500 mb-4">
              Adicione fotos do imóvel (mínimo 1, máximo 20)
            </p>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#0057FF] transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-600">
                Clique para fazer upload ou arraste aqui
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG ou WEBP até 10MB cada
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent>
            <CardTitle className="mb-4">Status de publicação</CardTitle>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="ACTIVE"
                  {...register('status')}
                  className="text-[#0057FF] focus:ring-[#0057FF]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Publicar agora</span>
                  <p className="text-xs text-gray-500">O imóvel ficará visível no site</p>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="INACTIVE"
                  {...register('status')}
                  className="text-[#0057FF] focus:ring-[#0057FF]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Salvar rascunho</span>
                  <p className="text-xs text-gray-500">Não ficará visível ainda</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/dashboard/imoveis">
            <Button variant="secondary" size="lg">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            <Save size={16} />
            Salvar imóvel
          </Button>
        </div>
      </form>
    </div>
  );
}
