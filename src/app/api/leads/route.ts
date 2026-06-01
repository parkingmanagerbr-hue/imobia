import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email().optional(),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  agencyId: z.string(),
  source: z.enum(['WHATSAPP', 'SITE', 'PHONE']).default('SITE'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get('agencyId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (agencyId) where.agencyId = agencyId;
    if (status) where.status = status;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            neighborhood: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createLeadSchema.parse(body);

    // Create lead
    const lead = await prisma.lead.create({
      data,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            neighborhood: true,
            city: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsiaApiKey: true,
            whatsiaInstanceId: true,
          },
        },
      },
    });

    // Fire WhatsIA notification if agency has WhatsIA configured
    if (lead.agency.whatsiaApiKey && lead.agency.whatsiaInstanceId && lead.property) {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/whatsia/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            name: lead.name,
            phone: lead.phone,
            message: lead.message,
          },
          property: lead.property,
          agency: {
            name: lead.agency.name,
            phone: lead.agency.phone,
            whatsiaApiKey: lead.agency.whatsiaApiKey,
            whatsiaInstanceId: lead.agency.whatsiaInstanceId,
          },
        }),
      }).catch((err) => console.error('WhatsIA notification failed:', err));
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
  }
}
