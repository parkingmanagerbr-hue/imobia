'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
  { href: '/dashboard/imoveis', label: 'Imóveis', icon: <Building2 size={18} /> },
  { href: '/dashboard/leads', label: 'Leads', icon: <Users size={18} /> },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
          <Home size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Imob<span className="text-[#0057FF]">IA</span>
        </span>
      </div>

      {/* Quick action */}
      <div className="px-4 py-4 border-b border-gray-800">
        <Link href="/dashboard/imoveis/novo">
          <button className="w-full flex items-center gap-2 bg-[#0057FF] hover:bg-[#0041cc] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} />
            Novo Imóvel
          </button>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[#0057FF] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <Home size={18} />
          Ver Site
        </Link>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all"
        >
          <LogOut size={18} />
          Sair
        </Link>
      </div>
    </aside>
  );
}
