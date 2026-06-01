import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { plan, agencyId } = await req.json() as { plan: 'MONTHLY' | 'ANNUAL'; agencyId: string };

    const amount = plan === 'ANNUAL' ? 4999 : 499;
    const frequency = plan === 'ANNUAL' ? 12 : 1;
    const planName = plan === 'ANNUAL' ? 'Anual' : 'Mensal';

    const preApproval = new PreApproval(client);

    const result = await preApproval.create({
      body: {
        reason: `ImobIA - Plano ${planName}`,
        auto_recurring: {
          frequency,
          frequency_type: 'months',
          transaction_amount: amount,
          currency_id: 'BRL',
        },
        back_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        payer_email: '',
        external_reference: agencyId,
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error('MercadoPago subscription error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar assinatura' },
      { status: 500 }
    );
  }
}
