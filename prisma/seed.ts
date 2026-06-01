import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do ImobIA...')

  // ── 1. USUÁRIO ADMIN ──────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('imobia2026', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@imobia.com.br' },
    update: {},
    create: {
      name: 'Admin ImobIA',
      email: 'admin@imobia.com.br',
      password: hashedPassword,
      role: 'ADMIN',
      plan: 'ANNUAL',
      planStatus: 'ACTIVE',
    },
  })

  const agent1 = await prisma.user.upsert({
    where: { email: 'joao@imoveisprima.com.br' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@imoveisprima.com.br',
      password: hashedPassword,
      role: 'AGENT',
      plan: 'MONTHLY',
      planStatus: 'ACTIVE',
    },
  })

  const agent2 = await prisma.user.upsert({
    where: { email: 'ana@casanova.com.br' },
    update: {},
    create: {
      name: 'Ana Costa',
      email: 'ana@casanova.com.br',
      password: hashedPassword,
      role: 'AGENT',
      plan: 'ANNUAL',
      planStatus: 'ACTIVE',
    },
  })

  console.log('✅ Usuários criados')

  // ── 2. AGÊNCIAS ───────────────────────────────────────────────────────────
  const agency1 = await prisma.agency.upsert({
    where: { slug: 'imoveis-prima' },
    update: {},
    create: {
      name: 'Imóveis Prima',
      slug: 'imoveis-prima',
      phone: '11987654321',
      email: 'contato@imoveisprima.com.br',
      address: 'Av. Paulista, 1000, Sala 501',
      city: 'São Paulo',
      state: 'SP',
      creci: 'CRECI-SP 12345-J',
      whatsiaInstanceId: 'prima-instance',
      userId: agent1.id,
    },
  })

  const agency2 = await prisma.agency.upsert({
    where: { slug: 'casa-nova-imoveis' },
    update: {},
    create: {
      name: 'Casa Nova Imóveis',
      slug: 'casa-nova-imoveis',
      phone: '11976543210',
      email: 'contato@casanova.com.br',
      address: 'Rua Oscar Freire, 500',
      city: 'São Paulo',
      state: 'SP',
      creci: 'CRECI-SP 67890-J',
      whatsiaInstanceId: 'casanova-instance',
      userId: agent2.id,
    },
  })

  console.log('✅ Agências criadas')

  // ── 3. IMÓVEIS ────────────────────────────────────────────────────────────
  const properties = [
    // ─ Apartamentos para Alugar ─
    {
      title: 'Apartamento moderno na Vila Madalena',
      description: 'Lindo apartamento com 3 quartos em uma das regiões mais charmosas de São Paulo. Varanda gourmet, cozinha americana e vaga de garagem. Próximo a restaurantes, bares e transporte público.',
      type: 'APARTMENT' as const,
      purpose: 'RENT' as const,
      price: 320000, // R$3.200 em centavos
      condoFee: 75000, // R$750
      iptu: 15000, // R$150/mês
      area: 85,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 1,
      floor: 5,
      furnished: true,
      petFriendly: true,
      address: 'Rua Mourato Coelho, 450, Apto 54',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05417-010',
      lat: -23.5541,
      lng: -46.6871,
      status: 'ACTIVE' as const,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      ],
      amenities: ['Piscina', 'Academia', 'Portaria 24h', 'Salão de Festas', 'Churrasqueira'],
      agencyId: agency1.id,
      agentId: agent1.id,
      views: 347,
    },
    {
      title: 'Studio no coração do Itaim Bibi',
      description: 'Studio compacto e inteligente, completamente reformado. Mobiliado com móveis planejados de alto padrão. Ideal para profissionais que buscam praticidade e localização privilegiada.',
      type: 'APARTMENT' as const,
      purpose: 'RENT' as const,
      price: 230000, // R$2.300
      condoFee: 95000,
      iptu: 8000,
      area: 38,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpots: 1,
      floor: 12,
      furnished: true,
      petFriendly: false,
      address: 'Rua Joaquim Floriano, 72, Apto 1201',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04534-000',
      lat: -23.5851,
      lng: -46.6774,
      status: 'ACTIVE' as const,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      ],
      amenities: ['Concierge', 'Academia', 'Coworking', 'Rooftop'],
      agencyId: agency1.id,
      agentId: agent1.id,
      views: 512,
    },
    {
      title: 'Apartamento 2 quartos no Brooklin',
      description: 'Ótimo apartamento em localização estratégica próxima à Marginal Pinheiros. 2 quartos sendo 1 suíte, sala ampla e sacada. Condomínio com infraestrutura completa de lazer.',
      type: 'APARTMENT' as const,
      purpose: 'RENT' as const,
      price: 280000,
      condoFee: 110000,
      iptu: 12000,
      area: 72,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpots: 1,
      floor: 8,
      furnished: false,
      petFriendly: true,
      address: 'Av. Dr. Chucri Zaidan, 200, Apto 82',
      neighborhood: 'Brooklin',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04583-110',
      lat: -23.6121,
      lng: -46.6960,
      status: 'ACTIVE' as const,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
      ],
      amenities: ['Piscina', 'Sauna', 'Quadra', 'Portaria 24h'],
      agencyId: agency1.id,
      agentId: agent1.id,
      views: 198,
    },

    // ─ Apartamentos à Venda ─
    {
      title: 'Cobertura duplex em Moema',
      description: 'Cobertura espetacular com vista panorâmica para o Parque do Ibirapuera. 4 suítes, sala de estar e jantar integradas, cozinha gourmet, 3 vagas e área de lazer privativa no terraço.',
      type: 'APARTMENT' as const,
      purpose: 'SALE' as const,
      price: 420000000, // R$4.200.000
      condoFee: 280000,
      iptu: 95000,
      area: 320,
      bedrooms: 4,
      bathrooms: 5,
      parkingSpots: 3,
      floor: 22,
      furnished: false,
      petFriendly: true,
      address: 'Alameda dos Arapanés, 1500, Cobertura',
      neighborhood: 'Moema',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04524-002',
      lat: -23.6001,
      lng: -46.6651,
      status: 'ACTIVE' as const,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      ],
      amenities: ['Piscina privativa', 'Spa', 'Home cinema', 'Academia privativa', 'Concierge VIP'],
      agencyId: agency2.id,
      agentId: agent2.id,
      views: 892,
    },
    {
      title: 'Apartamento 3 suítes no Alto de Pinheiros',
      description: 'Apartamento em andar alto com excelente acabamento. 3 suítes sendo a master com closet e banheiro com banheira. Cozinha gourmet, dependência completa e 2 vagas de garagem.',
      type: 'APARTMENT' as const,
      purpose: 'SALE' as const,
      price: 189000000, // R$1.890.000
      condoFee: 185000,
      iptu: 42000,
      area: 158,
      bedrooms: 3,
      bathrooms: 4,
      parkingSpots: 2,
      floor: 14,
      furnished: false,
      petFriendly: true,
      address: 'Rua Deputado Lacerda Franco, 300, Apto 142',
      neighborhood: 'Alto de Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05083-000',
      lat: -23.5508,
      lng: -46.7194,
      status: 'ACTIVE' as const,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800',
      ],
      amenities: ['Piscina', 'Academia', 'Salão de festas', 'Brinquedoteca', 'Portaria 24h'],
      agencyId: agency2.id,
      agentId: agent2.id,
      views: 421,
    },

    // ─ Casas ─
    {
      title: 'Casa em condomínio fechado em Alphaville',
      description: 'Linda casa em condomínio de alto padrão com 4 quartos sendo 2 suítes. Amplo quintal com piscina, churrasqueira e área gourmet. Segurança 24 horas, clube completo.',
      type: 'HOUSE' as const,
      purpose: 'SALE' as const,
      price: 285000000, // R$2.850.000
      condoFee: 420000,
      iptu: 78000,
      area: 380,
      bedrooms: 4,
      bathrooms: 5,
      parkingSpots: 4,
      floor: 1,
      furnished: false,
      petFriendly: true,
      address: 'Rua das Palmeiras, 45 - Alphaville Residencial 1',
      neighborhood: 'Alphaville',
      city: 'Barueri',
      state: 'SP',
      zipCode: '06474-030',
      lat: -23.4892,
      lng: -46.8521,
      status: 'ACTIVE' as const,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      ],
      amenities: ['Piscina', 'Churrasqueira', 'Campo de tênis', 'Clube completo', 'Segurança 24h'],
      agencyId: agency1.id,
      agentId: agent1.id,
      views: 634,
    },
    {
      title: 'Casa para alugar em Granja Viana',
      description: 'Casa espaçosa com 3 quartos e área de lazer completa. Quintal grande com piscina e churrasqueira. Localização tranquila com fácil acesso à Raposo Tavares.',
      type: 'HOUSE' as const,
      purpose: 'RENT' as const,
      price: 650000, // R$6.500
      condoFee: 0,
      iptu: 22000,
      area: 250,
      bedrooms: 3,
      bathrooms: 3,
      parkingSpots: 3,
      floor: 1,
      furnished: false,
      petFriendly: true,
      address: 'Rua dos Ipês, 78',
      neighborhood: 'Granja Viana',
      city: 'Carapicuíba',
      state: 'SP',
      zipCode: '06322-000',
      lat: -23.5231,
      lng: -46.8452,
      status: 'ACTIVE' as const,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      ],
      amenities: ['Piscina', 'Churrasqueira', 'Garagem coberta'],
      agencyId: agency2.id,
      agentId: agent2.id,
      views: 287,
    },

    // ─ Comercial ─
    {
      title: 'Sala comercial na Faria Lima',
      description: 'Sala comercial de alto padrão no coração do eixo financeiro de São Paulo. Laje corporativa com 180m², sistema de ar-condicionado central, piso elevado e 4 vagas rotativas.',
      type: 'COMMERCIAL' as const,
      purpose: 'RENT' as const,
      price: 850000, // R$8.500
      condoFee: 350000,
      iptu: 95000,
      area: 180,
      bedrooms: 0,
      bathrooms: 3,
      parkingSpots: 4,
      floor: 18,
      furnished: false,
      petFriendly: false,
      address: 'Av. Brigadeiro Faria Lima, 3144, 18º andar',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01451-000',
      lat: -23.5763,
      lng: -46.6905,
      status: 'ACTIVE' as const,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366754035-f200968a7b2d?w=800',
      ],
      amenities: ['Recepção', 'Copa', 'Sala de reunião', 'CFTV', 'Gerador'],
      agencyId: agency2.id,
      agentId: agent2.id,
      views: 156,
    },

    // ─ Terreno ─
    {
      title: 'Terreno em condomínio fechado - Cotia',
      description: 'Terreno plano em condomínio residencial de alto padrão. Área de 800m² com topografia ideal para construção. Condomínio com portaria 24h, lagos e área verde preservada.',
      type: 'LAND' as const,
      purpose: 'SALE' as const,
      price: 85000000, // R$850.000
      condoFee: 180000,
      iptu: 8000,
      area: 800,
      bedrooms: 0,
      bathrooms: 0,
      parkingSpots: 0,
      floor: 0,
      furnished: false,
      petFriendly: true,
      address: 'Condomínio Village das Flores, Lote 47',
      neighborhood: 'Village das Flores',
      city: 'Cotia',
      state: 'SP',
      zipCode: '06705-000',
      lat: -23.6012,
      lng: -46.9218,
      status: 'ACTIVE' as const,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      ],
      amenities: ['Área verde', 'Portaria 24h', 'Lagos artificiais'],
      agencyId: agency1.id,
      agentId: agent1.id,
      views: 89,
    },
  ]

  for (const property of properties) {
    await prisma.property.create({ data: property })
  }
  console.log(`✅ ${properties.length} imóveis criados`)

  // ── 4. LEADS DE EXEMPLO ──────────────────────────────────────────────────
  const allProperties = await prisma.property.findMany({ take: 4 })

  const leads = [
    {
      name: 'Carlos Mendes',
      phone: '11991234567',
      email: 'carlos.mendes@email.com',
      message: 'Tenho interesse no apartamento da Vila Madalena. Posso visitar essa semana?',
      propertyId: allProperties[0]?.id,
      agencyId: agency1.id,
      status: 'NEW' as const,
      source: 'WHATSAPP' as const,
    },
    {
      name: 'Patricia Oliveira',
      phone: '11998765432',
      email: 'patricia.o@gmail.com',
      message: 'Quero alugar o studio do Itaim. Qual o valor do seguro-fiança?',
      propertyId: allProperties[1]?.id,
      agencyId: agency1.id,
      status: 'CONTACTED' as const,
      source: 'SITE' as const,
    },
    {
      name: 'Roberto Alves',
      phone: '11976543210',
      email: 'roberto.alves@empresa.com.br',
      message: 'Tenho interesse na cobertura de Moema. Aceita financiamento Caixa?',
      propertyId: allProperties[3]?.id,
      agencyId: agency2.id,
      status: 'QUALIFIED' as const,
      source: 'WHATSAPP' as const,
    },
    {
      name: 'Fernanda Santos',
      phone: '11965432109',
      email: 'fernanda.santos@hotmail.com',
      message: 'Interessada na casa de Alphaville. Minha família tem 2 cães. Pode?',
      propertyId: allProperties[5]?.id,
      agencyId: agency1.id,
      status: 'NEW' as const,
      source: 'WHATSAPP' as const,
    },
    {
      name: 'Marcos Cunha',
      phone: '11954321098',
      email: 'marcos.cunha@outlook.com',
      message: 'Gostei muito do apartamento em Moema. Quando posso agendar uma visita?',
      propertyId: allProperties[4]?.id,
      agencyId: agency2.id,
      status: 'LOST' as const,
      source: 'SITE' as const,
    },
    {
      name: 'Juliana Ferreira',
      phone: '11943210987',
      email: 'juliana.ferreira@email.com',
      message: 'Preciso de sala comercial na Faria Lima até 200m². Esta disponível para visita?',
      propertyId: allProperties[7]?.id,
      agencyId: agency2.id,
      status: 'QUALIFIED' as const,
      source: 'PHONE' as const,
    },
  ]

  for (const lead of leads) {
    if (lead.propertyId) {
      await prisma.lead.create({ data: lead })
    }
  }
  console.log(`✅ ${leads.length} leads criados`)

  // ── 5. ASSINATURAS ────────────────────────────────────────────────────────
  await prisma.subscription.createMany({
    data: [
      {
        agencyId: agency1.id,
        plan: 'MONTHLY',
        status: 'ACTIVE',
        mercadoPagoId: 'mp-sub-12345',
        amount: 49900,
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-06-01'),
      },
      {
        agencyId: agency2.id,
        plan: 'ANNUAL',
        status: 'ACTIVE',
        mercadoPagoId: 'mp-sub-67890',
        amount: 499900,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-01-01'),
      },
    ],
  })
  console.log('✅ Assinaturas criadas')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📋 Credenciais de acesso:')
  console.log('   Admin:  admin@imobia.com.br  / imobia2026')
  console.log('   Agente: joao@imoveisprima.com.br / imobia2026')
  console.log('   Agente: ana@casanova.com.br   / imobia2026')
  console.log('\n📊 Dados criados:')
  console.log('   2 agências')
  console.log('   9 imóveis (apartamentos, casas, comercial, terreno)')
  console.log('   6 leads com status variados')
  console.log('   2 assinaturas (mensal + anual)')
}

main()
  .catch((e) => { console.error('❌ Seed falhou:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
