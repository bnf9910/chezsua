'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n';
import { CONTACT_INFO } from '@/lib/constants';
import { SocialIcons } from '@/components/ui/SocialIcons';
import type { Locale } from '@/lib/i18n';

export function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale() as Locale;

  return (
    <footer className="bg-ink-primary text-bg-primary px-12 pt-20 pb-10 max-md:px-5">
      <div className="max-w-[1600px] mx-auto grid grid-cols-[1fr_auto_1fr] gap-16 items-center pb-14 border-b border-white/15 max-md:grid-cols-1 max-md:text-center max-md:gap-8 max-md:pb-12">
        {/* Social - locale별 분기 */}
        <div className="max-md:flex max-md:justify-center">
          <SocialIcons locale={locale} variant="dark" size="lg" />
        </div>

        {/* Logo */}
        <div className="text-center">
          <div className="text-serif text-3xl tracking-[0.32em]">
            CHEZ<span className="text-accent-sage">·</span>SUA
          </div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-white/50 mt-2">
            {t('tagline')}
          </div>
        </div>

        {/* Inquiries */}
        <div className="text-right max-md:text-center">
          <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">
            {t('inquiries')}
          </div>
          <Link
            href="/project"
            className="text-serif italic text-2xl text-accent-cream border-b border-accent-cream/40 pb-1 hover:border-accent-cream transition-colors"
          >
            {t('startProject')} →
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-9 flex justify-between text-mono text-[10px] tracking-[0.15em] uppercase text-white/50 flex-wrap gap-4 max-md:justify-center max-md:text-center">
        <div className="flex gap-8 flex-wrap max-md:justify-center max-md:gap-4">
          <span>{locale === 'ko' ? CONTACT_INFO.address_ko : CONTACT_INFO.address_en}</span>
          <span>{CONTACT_INFO.phone}</span>
          <span>{CONTACT_INFO.email}</span>
        </div>
        <span>© {new Date().getFullYear()} CHEZSUA</span>
      </div>
    </footer>
  );
}
