'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Locale } from '@/lib/i18n';

interface CategoryTabsProps {
  locale: Locale;
  active: string;
}

export function CategoryTabs({ active }: CategoryTabsProps) {
  const t = useTranslations('Shop');

  return (
    <nav className="max-w-[1600px] mx-auto px-12 py-7 flex gap-9 text-mono text-[11px] tracking-[0.18em] uppercase border-b border-line-soft overflow-x-auto max-lg:px-7 max-lg:gap-6">
      <Link
        href="/shop"
        className={`whitespace-nowrap pb-1 border-b transition-colors ${
          active === 'all'
            ? 'text-ink-primary border-ink-primary'
            : 'text-ink-muted border-transparent hover:text-ink-primary'
        }`}
      >
        {t('all')}
      </Link>
      {PRODUCT_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/shop/${cat.slug}`}
          className={`whitespace-nowrap pb-1 border-b transition-colors ${
            active === cat.slug
              ? 'text-ink-primary border-ink-primary'
              : 'text-ink-muted border-transparent hover:text-ink-primary'
          }`}
        >
          {/* @ts-expect-error - dynamic key */}
          {t(cat.key)}
        </Link>
      ))}
    </nav>
  );
}
