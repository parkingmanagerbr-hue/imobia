'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home } from 'lucide-react';
import { Button } from './Button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Imob<span className="text-[#0057FF]">IA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/imoveis"
              className="text-sm font-medium text-gray-600 hover:text-[#0057FF] transition-colors"
            >
              Imóveis
            </Link>
            <Link
              href="/planos"
              className="text-sm font-medium text-gray-600 hover:text-[#0057FF] transition-colors"
            >
              Para Imobiliárias
            </Link>
            <Link
              href="/planos"
              className="text-sm font-medium text-gray-600 hover:text-[#0057FF] transition-colors"
            >
              Planos
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/api/auth/signin">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/planos">
              <Button variant="primary" size="sm">
                Anunciar
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link
            href="/imoveis"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Imóveis
          </Link>
          <Link
            href="/planos"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Para Imobiliárias
          </Link>
          <Link
            href="/planos"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileOpen(false)}
          >
            Planos
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/api/auth/signin">
              <Button variant="outline" size="md" fullWidth>
                Entrar
              </Button>
            </Link>
            <Link href="/planos">
              <Button variant="primary" size="md" fullWidth>
                Anunciar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
