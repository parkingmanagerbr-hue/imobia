import type { Metadata } from 'next';
import './globals.css';
import { WhatsAppWidget } from './_components/WhatsAppWidget';
import { I18nProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  // metadataBase resolve as URLs relativas e habilita canonical/og:url — sem
  // ele o Next nao emite essas tags e o site sai sem canonical (achado da
  // auditoria de set/2026).
  metadataBase: new URL('https://imobia.veloxisit.com.br'),
  alternates: { canonical: '/' },
  title: {
    default: 'ImobIA — Imóveis com Inteligência Artificial',
    template: '%s | ImobIA',
  },
  description:
    'Encontre o imóvel perfeito com IA. Imóveis para compra e aluguel em todo o Brasil com atendimento 24/7 via WhatsApp.',
  keywords: ['imóveis', 'aluguel', 'compra', 'apartamento', 'casa', 'IA', 'WhatsApp'],
  openGraph: {
    title: 'ImobIA — Imóveis com Inteligência Artificial',
    description: 'Encontre o imóvel perfeito com IA. Imóveis para compra e aluguel em todo o Brasil com atendimento 24/7 via WhatsApp.',
    images: [
      {
        url: 'https://veloxisit.com.br/og/imobia.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
    locale: 'pt_BR',
    url: 'https://imobia.veloxisit.com.br/',
    siteName: 'ImobIA',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <I18nProvider>
          {children}
          <WhatsAppWidget
            businessName="ImobIA"
            greeting="Olá! Quer usar IA no seu negócio imobiliário ou está buscando imóvel? Estamos aqui!"
          />
        </I18nProvider>
      </body>
    </html>
  );
}
