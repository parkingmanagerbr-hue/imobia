'use client';

import { useState } from 'react';
import {
  Building2,
  MessageCircle,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ConfiguracoesPage() {
  const [whatsiaKey, setWhatsiaKey] = useState('');
  const [whatsiaInstance, setWhatsiaInstance] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [savingAgency, setSavingAgency] = useState(false);

  const testWhatsiaConnection = async () => {
    if (!whatsiaKey || !whatsiaInstance) return;
    setTestingConnection(true);
    setConnectionStatus('idle');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/whatsia/notify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test: true,
            apiKey: whatsiaKey,
            instanceId: whatsiaInstance,
          }),
        }
      );
      setConnectionStatus(res.ok ? 'success' : 'error');
    } catch {
      setConnectionStatus('error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveAgency = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingAgency(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavingAgency(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gerencie os dados da sua imobiliária e integrações
        </p>
      </div>

      <div className="space-y-6">
        {/* Agency data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-[#0057FF] rounded-xl">
                <Building2 size={20} />
              </div>
              <CardTitle>Dados da Imobiliária</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAgency} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nome da imobiliária"
                  placeholder="Premium Imóveis SP"
                  defaultValue="Premium Imóveis SP"
                  required
                />
                <Input
                  label="CRECI"
                  placeholder="CRECI 12345-SP"
                  defaultValue="CRECI 12345-SP"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Telefone principal"
                  placeholder="(11) 99999-9999"
                  defaultValue="(11) 99999-9999"
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="contato@imobiliaria.com"
                  defaultValue="contato@premium.com.br"
                  required
                />
              </div>

              <Input
                label="Endereço"
                placeholder="Rua das Flores, 123 — Pinheiros, São Paulo — SP"
                defaultValue="Av. Paulista, 1000 — Bela Vista, São Paulo — SP"
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="Cidade"
                  placeholder="São Paulo"
                  defaultValue="São Paulo"
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Estado
                  </label>
                  <select className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057FF] bg-white">
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
                <Input
                  label="CEP"
                  placeholder="01310-100"
                  defaultValue="01310-100"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={savingAgency}>
                  Salvar dados
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* WhatsIA config */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                  <MessageCircle size={20} />
                </div>
                <CardTitle>Integração WhatsIA</CardTitle>
              </div>
              <Badge variant={connectionStatus === 'success' ? 'success' : 'warning'}>
                {connectionStatus === 'success' ? 'Conectado' : 'Não configurado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Como configurar:</strong> Acesse o painel do WhatsIA em{' '}
                <a
                  href="https://whatsia.veloxisit.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  whatsia.veloxisit.com.br
                </a>
                , crie uma instância e copie sua API Key e Instance ID abaixo.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="API Key"
                type="password"
                placeholder="sua-api-key-do-whatsia"
                value={whatsiaKey}
                onChange={(e) => setWhatsiaKey(e.target.value)}
                hint="Encontre no painel do WhatsIA → Configurações → API"
              />
              <Input
                label="Instance ID"
                placeholder="nome-da-sua-instancia"
                value={whatsiaInstance}
                onChange={(e) => setWhatsiaInstance(e.target.value)}
                hint="O nome da instância criada no WhatsIA"
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={testWhatsiaConnection}
                  loading={testingConnection}
                  disabled={!whatsiaKey || !whatsiaInstance}
                >
                  {testingConnection ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  Testar conexão
                </Button>

                {connectionStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    Conexão estabelecida com sucesso!
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    Falha na conexão. Verifique as credenciais.
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  disabled={!whatsiaKey || !whatsiaInstance}
                >
                  Salvar integração
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <CreditCard size={20} />
              </div>
              <CardTitle>Plano e Assinatura</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-[#0057FF] to-[#0041cc] rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-blue-200 mb-1">Plano atual</div>
                  <div className="text-2xl font-bold">Plano Anual</div>
                </div>
                <Badge className="bg-white/20 text-white border-0">Ativo</Badge>
              </div>
              <div className="text-blue-200 text-sm">
                Válido até <strong className="text-white">31/12/2024</strong>
              </div>
              <div className="mt-3 text-blue-200 text-sm">
                R$ 4.999/ano (R$ 416/mês)
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="md">
                Mudar de plano
              </Button>
              <Button variant="ghost" size="md" className="text-red-500 hover:bg-red-50">
                Cancelar assinatura
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Histórico de pagamentos
              </h4>
              <div className="space-y-2">
                {[
                  { date: '01/01/2024', amount: 'R$ 4.999,00', status: 'Pago' },
                ].map((payment, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2 border-b border-gray-50"
                  >
                    <span className="text-gray-600">{payment.date}</span>
                    <span className="font-medium text-gray-900">{payment.amount}</span>
                    <Badge variant="success">{payment.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
