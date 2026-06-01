import { MessageCircle, Phone, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadBadge } from '@/components/ui/LeadBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPhone, getWhatsAppLink } from '@/lib/utils';

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
type LeadSource = 'WHATSAPP' | 'SITE' | 'PHONE';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  property: string;
  propertyId: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Maria Santos',
    phone: '11987654321',
    email: 'maria@email.com',
    message: 'Gostaria de agendar uma visita no final de semana.',
    property: 'Apt. Pinheiros 82m²',
    propertyId: '1',
    source: 'WHATSAPP',
    status: 'NEW',
    createdAt: '2024-01-20T14:30:00',
  },
  {
    id: '2',
    name: 'João Oliveira',
    phone: '11912345678',
    email: 'joao@email.com',
    message: 'Tenho interesse em comprar. Qual o melhor preço?',
    property: 'Casa Alphaville 250m²',
    propertyId: '2',
    source: 'SITE',
    status: 'CONTACTED',
    createdAt: '2024-01-20T12:00:00',
  },
  {
    id: '3',
    name: 'Ana Costa',
    phone: '21998765432',
    message: 'Preciso de um imóvel para alugar com urgência.',
    property: 'Studio Centro 38m²',
    propertyId: '3',
    source: 'WHATSAPP',
    status: 'QUALIFIED',
    createdAt: '2024-01-20T10:15:00',
  },
  {
    id: '4',
    name: 'Carlos Pereira',
    phone: '41976543210',
    email: 'carlos@empresa.com',
    message: 'Buscando sala comercial para minha empresa.',
    property: 'Sala Faria Lima 90m²',
    propertyId: '6',
    source: 'SITE',
    status: 'LOST',
    createdAt: '2024-01-19T16:45:00',
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    phone: '11954321098',
    message: 'Pode me mandar mais fotos da cobertura?',
    property: 'Cobertura Agronômica 320m²',
    propertyId: '4',
    source: 'WHATSAPP',
    status: 'NEW',
    createdAt: '2024-01-19T09:30:00',
  },
  {
    id: '6',
    name: 'Roberto Alves',
    phone: '11967890123',
    email: 'roberto@email.com',
    message: 'Tenho FGTS, aceita?',
    property: 'Apt. Pinheiros 82m²',
    propertyId: '1',
    source: 'PHONE',
    status: 'CONTACTED',
    createdAt: '2024-01-18T14:00:00',
  },
  {
    id: '7',
    name: 'Patricia Souza',
    phone: '21943210987',
    message: 'Qual o prazo para entrega?',
    property: 'Casa Alphaville 250m²',
    propertyId: '2',
    source: 'SITE',
    status: 'QUALIFIED',
    createdAt: '2024-01-18T11:20:00',
  },
];

const STATUS_COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'NEW', label: 'Novos', color: 'bg-blue-100' },
  { status: 'CONTACTED', label: 'Contatados', color: 'bg-cyan-100' },
  { status: 'QUALIFIED', label: 'Qualificados', color: 'bg-green-100' },
  { status: 'LOST', label: 'Perdidos', color: 'bg-red-100' },
];

const SOURCE_LABELS: Record<LeadSource, string> = {
  WHATSAPP: 'WhatsApp',
  SITE: 'Site',
  PHONE: 'Telefone',
};

function LeadCard({ lead }: { lead: Lead }) {
  const whatsappLink = getWhatsAppLink(
    lead.phone,
    `Olá ${lead.name}! Sou da ImobIA. Vi seu interesse no imóvel "${lead.property}". Posso te ajudar?`
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-gray-900 text-sm">{lead.name}</div>
          <div className="text-xs text-gray-500">{formatPhone(lead.phone)}</div>
        </div>
        <Badge
          variant={lead.source === 'WHATSAPP' ? 'success' : lead.source === 'SITE' ? 'primary' : 'default'}
          className="text-xs"
        >
          {SOURCE_LABELS[lead.source]}
        </Badge>
      </div>

      {lead.message && (
        <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-2.5 line-clamp-2">
          &ldquo;{lead.message}&rdquo;
        </p>
      )}

      <div className="text-xs text-gray-500 flex items-center gap-1">
        <ExternalLink size={11} />
        <span className="line-clamp-1">{lead.property}</span>
      </div>

      <div className="flex gap-2 pt-1">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba58] text-white text-xs font-medium py-2 px-3 rounded-xl transition-colors">
            <MessageCircle size={13} />
            WhatsApp
          </button>
        </a>
        <a href={`tel:${lead.phone}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium py-2 px-3 rounded-xl transition-colors">
            <Phone size={13} />
            Ligar
          </button>
        </a>
      </div>

      <div className="text-xs text-gray-400">
        {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const leadsByStatus = STATUS_COLUMNS.reduce<Record<LeadStatus, Lead[]>>(
    (acc, col) => {
      acc[col.status] = MOCK_LEADS.filter((l) => l.status === col.status);
      return acc;
    },
    { NEW: [], CONTACTED: [], QUALIFIED: [], LOST: [] }
  );

  const totalLeads = MOCK_LEADS.length;
  const newLeads = leadsByStatus.NEW.length;
  const qualifiedLeads = leadsByStatus.QUALIFIED.length;
  const conversionRate =
    totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalLeads} leads no total • {newLeads} novos
          </p>
        </div>
        <Button variant="outline" size="md">
          <Filter size={16} />
          Filtrar
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATUS_COLUMNS.map((col) => (
          <div key={col.status} className={`${col.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-bold text-gray-900">
              {leadsByStatus[col.status].length}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">{col.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATUS_COLUMNS.map((col) => (
          <div key={col.status}>
            <div className="flex items-center gap-2 mb-4">
              <LeadBadge status={col.status} />
              <span className="text-sm font-semibold text-gray-900">
                {col.label}
              </span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {leadsByStatus[col.status].length}
              </span>
            </div>

            <div className="space-y-3">
              {leadsByStatus[col.status].length === 0 ? (
                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
                  <p className="text-xs text-gray-400">Nenhum lead aqui</p>
                </div>
              ) : (
                leadsByStatus[col.status].map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resumo de conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">{conversionRate}%</div>
              <div className="text-sm text-gray-500">Taxa de qualificação</div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className="bg-[#0057FF] h-3 rounded-full transition-all"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {qualifiedLeads} de {totalLeads} leads
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
