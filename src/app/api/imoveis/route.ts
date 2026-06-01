import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createPropertySchema = z.object({
  title: z.string().min(10),
  description: z.string().min(50),
  type: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND', 'RURAL']),
  purpose: z.enum(['SALE', 'RENT']),
  price: z.number().positive(),
  condoFee: z.number().min(0).optional(),
  iptu: z.number().min(0).optional(),
  area: z.number().positive(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parkingSpots: z.number().min(0).optional(),
  floor: z.number().min(0).optional(),
  furnished: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  address: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  agencyId: z.string(),
  agentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const purpose = searchParams.get('purpose');
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const agencyId = searchParams.get('agencyId');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
    };

    if (purpose && (purpose === 'SALE' || purpose === 'RENT')) {
      where.purpose = purpose;
    }
    if (type) where.type = type;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minPrice) where.price = { ...((where.price as Record<string, unknown>) || {}), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...((where.price as Record<string, unknown>) || {}), lte: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (agencyId) where.agencyId = agencyId;
    if (featured === 'true') where.featured = true;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: {
          agency: {
            select: {
              id: true,
              name: true,
              phone: true,
              creci: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createPropertySchema.parse(body);

    const property = await prisma.property.create({
      data: {
        ...data,
        images: data.images,
        amenities: data.amenities,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Erro ao criar imóvel' },
      { status: 500 }
    );
  }
}
