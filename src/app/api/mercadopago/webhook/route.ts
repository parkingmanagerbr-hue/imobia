import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface MercadoPagoWebhookBody {
  type: string;
  data: {
    id: string;
  };
  action?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MercadoPagoWebhookBody;

    // Validate webhook signature (optional but recommended)
    const signature = req.headers.get('x-signature');
    console.log('MP Webhook received:', { type: body.type, id: body.data?.id, signature });

    if (body.type === 'subscription_preapproval') {
      const preApprovalId = body.data.id;
      const preApproval = new PreApproval(client);
      const subscription = await preApproval.get({ id: preApprovalId });

      const agencyId = subscription.external_reference;
      if (!agencyId) {
        return NextResponse.json({ ok: true });
      }

      const status = subscription.status;
      const startDate = new Date();
      const endDate = new Date();

      if (status === 'authorized') {
        // Determine plan from frequency
        const frequency = subscription.auto_recurring?.frequency || 1;
        const plan = frequency >= 12 ? 'ANNUAL' : 'MONTHLY';
        const amount = plan === 'ANNUAL' ? 4999 : 499;

        endDate.setMonth(endDate.getMonth() + frequency);

        // Upsert subscription
        await prisma.subscription.upsert({
          where: { id: preApprovalId },
          create: {
            id: preApprovalId,
            agencyId,
            plan,
            status: 'ACTIVE',
            mercadoPagoId: preApprovalId,
            mercadoPagoSubId: subscription.id?.toString(),
            amount,
            startDate,
            endDate,
          },
          update: {
            status: 'ACTIVE',
            endDate,
          },
        });

        // Update agency users plan
        await prisma.user.updateMany({
          where: { agencyId },
          data: {
            plan: plan === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY',
            planStatus: 'ACTIVE',
            planExpiresAt: endDate,
          },
        });
      } else if (status === 'cancelled' || status === 'paused') {
        // Cancel subscription
        await prisma.subscription.updateMany({
          where: { agencyId, mercadoPagoId: preApprovalId },
          data: { status: 'CANCELLED' },
        });

        await prisma.user.updateMany({
          where: { agencyId },
          data: {
            planStatus: 'CANCELLED',
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
