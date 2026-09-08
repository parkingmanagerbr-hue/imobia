'use client';

import { useI18n, LANGS, type Lang } from '@/lib/i18n';

export function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <select
      aria-label={t('common.language')}
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className={`bg-white border border-gray-200 rounded-lg text-sm px-2.5 py-1.5 text-gray-700 hover:border-[#0057FF] focus:outline-none focus:ring-2 focus:ring-[#0057FF]/30 ${className}`}
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
