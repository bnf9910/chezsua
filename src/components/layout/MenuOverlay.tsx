'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n';
import { CONTACT_INFO } from '@/lib/constants';
import { SocialIcons } from '@/components/ui/SocialIcons';
import type { Locale } from '@/lib/i18n';

interface MenuOverlayProps {
  locale: Locale;
}

export function MenuOverlay({ locale }: MenuOverlayProps) {
  const t = useTranslations('Menu');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setOpen(detail?.open ?? false);
    };
    window.addEventListener('chezsua:menu', handler);
    return () => window.removeEventListener('chezsua:menu', handler);
  }, []);

  const close = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('chezsua:menu', { detail: { open: false } }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-ink-primary/40 z-40 transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 w-[480px] h-screen bg-bg-primary z-40 flex flex-col px-12 pt-24 pb-12 border-l border-line transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] max-md:w-full max-md:px-7 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ willChange: 'transform' }}
      >
        <nav className="flex flex-col gap-1">
          <MenuLink href="/" onClick={close}>
            <em>—</em> {t('home')}
          </MenuLink>
          <MenuLink href="/shop" onClick={close}>
            {t('shop')}
          </MenuLink>
          <MenuLink href="/lookbooks" onClick={close}>
            {t('lookbooks')}
          </MenuLink>
          <MenuLink href="/about" onClick={close}>
            {t('about')}
          </MenuLink>
          <MenuLink href="/project" onClick={close}>
            {t('project')} <em>—</em>
          </MenuLink>
          <MenuLink href="/contact" onClick={close}>
            {t('contact')}
          </MenuLink>
        </nav>

        <div className="mt-auto pt-12 border-t border-line">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-4">
            {t('visit')}
          </div>
          <div className="text-sm text-ink-secondary leading-loose mb-6">
            {locale === 'ko' ? CONTACT_INFO.address_ko : CONTACT_INFO.address_en}
            <br />
            {CONTACT_INFO.phone}
            <br />
            {CONTACT_INFO.email}
          </div>
          <SocialIcons locale={locale} size="sm" variant="default" />
        </div>
      </aside>
    </>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-serif text-[44px] font-normal leading-tight text-ink-primary py-1 transition-all duration-300 hover:text-accent-green hover:translate-x-2 [&>em]:italic [&>em]:font-light max-md:text-[32px]"
    >
      {children}
    </Link>
  );
}
