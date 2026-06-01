import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ImobIA — Imóveis com Inteligência Artificial',
    template: '%s | ImobIA',
  },
  description:
    'Encontre o imóvel perfeito com IA. Imóveis para compra e aluguel em todo o Brasil com atendimento 24/7 via WhatsApp.',
  keywords: ['imóveis', 'aluguel', 'compra', 'apartamento', 'casa', 'IA', 'WhatsApp'],
  openGraph: {
    title: 'ImobIA — Imóveis com Inteligência Artificial',
    description: 'Encontre o imóvel perfeito com IA.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
