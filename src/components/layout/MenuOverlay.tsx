'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n';
import { CONTACT_INFO } from '@/lib/constants';
import { SocialIcons } from '@/components/ui/SocialIcons';
import type { Locale } from '@/lib/i18n';
import type { SiteMenuItem } from '@/lib/site-menus';
import { getMenuItemStyle } from '@/lib/site-menus';

interface MenuOverlayProps {
  locale: Locale;
  menus: SiteMenuItem[];
}

export function MenuOverlay({ locale, menus }: MenuOverlayProps) {
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

  // 최상위 메뉴만 (parent_id가 null)
  const topMenus = menus
    .filter((m) => !m.parent_id && m.visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <div
        onClick={close}
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        className="fixed inset-0 bg-ink-primary/40 z-40 transition-opacity duration-500"
      />

      <aside
        role="dialog"
        aria-modal="true"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          willChange: 'transform',
        }}
        className="fixed top-0 right-0 w-[480px] h-screen bg-bg-primary z-40 flex flex-col px-12 pt-24 pb-12 border-l border-line transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] max-md:w-full max-md:px-7 overflow-y-auto"
      >
        <nav className="flex flex-col gap-1">
          {topMenus.map((menu) => {
            // 메뉴 스타일에서 fontSize는 큰 메뉴에 너무 큰 값이 들어갈 수 있어서, 메뉴 오버레이용으로 다시 계산
            const customStyle: React.CSSProperties = {
              color: menu.style_color || undefined,
              fontWeight:
                menu.style_weight === 'bold'
                  ? 700
                  : menu.style_weight === 'black'
                    ? 900
                    : menu.style_weight === 'medium'
                      ? 500
                      : undefined,
              fontStyle: menu.style_italic ? 'italic' : undefined,
              textDecoration: menu.style_underline ? 'underline' : undefined,
              fontSize:
                menu.style_size === 'xl'
                  ? '52px'
                  : menu.style_size === 'lg'
                    ? '48px'
                    : menu.style_size === 'sm'
                      ? '32px'
                      : undefined,
            };

            return (
              <Link
                key={menu.id}
                href={menu.href}
                onClick={close}
                style={customStyle}
                className="text-serif text-[44px] font-normal leading-tight text-ink-primary py-1 transition-all duration-300 hover:translate-x-2 max-md:text-[32px] flex items-baseline gap-3"
              >
                {menu.is_event && (
                  <span
                    className="text-mono text-[9px] tracking-[0.25em] uppercase px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: menu.style_color || '#C53030',
                      color: '#fff',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      textDecoration: 'none',
                      fontSize: '9px',
                    }}
                  >
                    NEW
                  </span>
                )}
                {menu.label_en}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-12 border-t border-line">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-4">
            Visit · Inquire
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
