import Link from 'next/link';
import {
  Building2,
  Users,
  TrendingUp,
  Eye,
  Plus,
  MessageCircle,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadBadge } from '@/components/ui/LeadBadge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const METRICS = [
  {
    label: 'Total de Imóveis',
    value: '24',
    change: '+3 este mês',
    up: true,
    icon: <Building2 size={20} />,
    color: 'bg-blue-100 text-[#0057FF]',
  },
  {
    label: 'Leads Hoje',
    value: '7',
    change: '+2 vs ontem',
    up: true,
    icon: <Users size={20} />,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Taxa de Conversão',
    value: '18%',
    change: '-2% este mês',
    up: false,
    icon: <TrendingUp size={20} />,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Imóveis Ativos',
    value: '19',
    change: '79% do total',
    up: true,
    icon: <Eye size={20} />,
    color: 'bg-orange-100 text-orange-600',
  },
];

const RECENT_LEADS = [
  {
    id: '1',
    name: 'Maria Santos',
    phone: '(11) 98765-4321',
    property: 'Apt. Pinheiros 82m²',
    source: 'WHATSAPP' as const,
    status: 'NEW' as const,
    time: '14 min atrás',
  },
  {
    id: '2',
    name: 'João Oliveira',
    phone: '(11) 91234-5678',
    property: 'Casa Alphaville 250m²',
    source: 'SITE' as const,
    status: 'CONTACTED' as const,
    time: '2h atrás',
  },
  {
    id: '3',
    name: 'Ana Costa',
    phone: '(21) 99876-5432',
    property: 'Studio Centro 38m²',
    source: 'WHATSAPP' as const,
    status: 'QUALIFIED' as const,
    time: '5h atrás',
  },
  {
    id: '4',
    name: 'Carlos Pereira',
    phone: '(41) 97654-3210',
    property: 'Sala Faria Lima 90m²',
    source: 'SITE' as const,
    status: 'LOST' as const,
    time: '1 dia atrás',
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    phone: '(11) 95432-1098',
    property: 'Cobertura Agronômica 320m²',
    source: 'WHATSAPP' as const,
    status: 'NEW' as const,
    time: '1 dia atrás',
  },
];

// Simple bar chart data
const CHART_DATA = [
  { day: 'Seg', leads: 4 },
  { day: 'Ter', leads: 7 },
  { day: 'Qua', leads: 5 },
  { day: 'Qui', leads: 9 },
  { day: 'Sex', leads: 12 },
  { day: 'Sáb', leads: 6 },
  { day: 'Dom', leads: 3 },
];

const MAX_LEADS = Math.max(...CHART_DATA.map((d) => d.leads));

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bem-vindo de volta! Aqui está o resumo da sua imobiliária.
          </p>
        </div>
        <Link href="/dashboard/imoveis/novo">
          <Button variant="primary" size="md">
            <Plus size={16} />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {METRICS.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${metric.color}`}>
                  {metric.icon}
                </div>
                {metric.up ? (
                  <ArrowUpRight size={16} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-gray-500">{metric.label}</div>
              <div
                className={`text-xs mt-1 font-medium ${
                  metric.up ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads por dia (últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {CHART_DATA.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">{data.leads}</span>
                  <div
                    className="w-full bg-[#0057FF] rounded-t-lg transition-all hover:bg-[#0041cc]"
                    style={{
                      height: `${(data.leads / MAX_LEADS) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-xs text-gray-400">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-500">
              <span>Total: <strong className="text-gray-900">46 leads</strong></span>
              <span>Média: <strong className="text-gray-900">6.6/dia</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Atalhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/imoveis/novo">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-blue-100 text-[#0057FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Plus size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Adicionar imóvel
                    </div>
                    <div className="text-xs text-gray-500">Cadastre um novo imóvel</div>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/leads">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Ver leads</div>
                    <div className="text-xs text-gray-500">7 novos leads hoje</div>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/configuracoes">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Configurar WhatsIA
                    </div>
                    <div className="text-xs text-gray-500">Conectar sua instância</div>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/configuracoes">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Configurações</div>
                    <div className="text-xs text-gray-500">Dados da imobiliária</div>
                  </div>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leads Recentes</CardTitle>
            <Link href="/dashboard/leads">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">
                    Nome
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4 hidden sm:table-cell">
                    Telefone
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4 hidden md:table-cell">
                    Imóvel
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 pb-3">
                    Quando
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_LEADS.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.source}</div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{lead.phone}</span>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {lead.property}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <LeadBadge status={lead.status} />
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-400">{lead.time}</span>
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
