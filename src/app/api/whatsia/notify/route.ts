import { NextRequest, NextResponse } from 'next/server';

interface Lead {
  name: string;
  phone: string;
  message?: string;
}

interface Property {
  title: string;
  price: number;
  neighborhood?: string;
  city?: string;
}

interface Agency {
  name: string;
  phone: string;
  whatsiaApiKey: string;
  whatsiaInstanceId: string;
}

interface NotifyBody {
  lead?: Lead;
  property?: Property;
  agency?: Agency;
  test?: boolean;
  apiKey?: string;
  instanceId?: string;
}

async function sendWhatsAppMessage(
  instanceId: string,
  apiKey: string,
  number: string,
  text: string
): Promise<boolean> {
  const whatsiaUrl = process.env.WHATSIA_URL || 'https://whatsia.veloxisit.com.br';
  try {
    const res = await fetch(`${whatsiaUrl}/message/sendText/${instanceId}`, {
      method: 'POST',
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ number, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NotifyBody;

    // Test connection mode
    if (body.test) {
      const whatsiaUrl = process.env.WHATSIA_URL || 'https://whatsia.veloxisit.com.br';
      const res = await fetch(
        `${whatsiaUrl}/instance/fetchInstances`,
        {
          headers: { apikey: body.apiKey || '' },
        }
      );
      if (!res.ok) {
        return NextResponse.json({ error: 'Connection failed' }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    const { lead, property, agency } = body;

    if (!lead || !property || !agency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { whatsiaApiKey, whatsiaInstanceId } = agency;

    // Format price
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(property.price);

    // Notify agent about new lead
    const agentMessage = [
      `🏠 *Novo Lead ImobIA*`,
      ``,
      `👤 ${lead.name}`,
      `📱 ${lead.phone}`,
      `🏡 Interesse: ${property.title}`,
      `💰 ${formattedPrice}`,
      `📍 ${property.neighborhood || ''}, ${property.city || ''}`,
      lead.message ? `\n💬 "${lead.message}"` : '',
      ``,
      `_Responda diretamente para este número_`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    await sendWhatsAppMessage(
      whatsiaInstanceId,
      whatsiaApiKey,
      agency.phone,
      agentMessage
    );

    // Send welcome message to lead
    const leadMessage = [
      `Olá ${lead.name}! 👋`,
      ``,
      `Recebemos seu interesse no imóvel *${property.title}*.`,
      ``,
      `Em breve nossa equipe entrará em contato! 🏠`,
      ``,
      `_ImobIA - ${agency.name}_`,
    ].join('\n');

    await sendWhatsAppMessage(
      whatsiaInstanceId,
      whatsiaApiKey,
      lead.phone,
      leadMessage
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('WhatsIA notification error:', error);
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 });
  }
}
