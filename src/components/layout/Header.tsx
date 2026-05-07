'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { SiteMenuItem } from '@/lib/site-menus';

interface HeaderProps {
  locale: Locale;
  menus?: SiteMenuItem[];
}

// 표시할 언어 목록 (zh는 일단 숨김 - 코드와 라우팅은 유지)
const VISIBLE_LANGUAGES: Array<{ code: 'en' | 'ko'; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
  // { code: 'zh', label: 'ZH' }, // 중국어 - 일단 가림
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Header({ locale, menus }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [langOpen, setLangOpen] = useState(false);

  function switchLocale(newLocale: 'en' | 'ko' | 'zh') {
    const segments = pathname.split('/');
    if (['en', 'ko', 'zh'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join('/'));
    setLangOpen(false);
  }

  function openMenu() {
    window.dispatchEvent(new CustomEvent('chezsua:menu', { detail: { open: true } }));
  }

  // 홈에서는 로고 숨김
  const isHome = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-12 pt-7 max-md:px-6 max-md:pt-5 pointer-events-none">
      <div className="flex justify-between items-center pointer-events-auto">
        {/* Left: 홈에서는 빈 공간, 다른 페이지에선 CHEZ·SUA 로고 */}
        {isHome ? (
          <span aria-hidden="true" />
        ) : (
          <Link
            href="/"
            className="text-serif text-xl tracking-[0.3em] text-ink-primary"
          >
            CHEZ<span className="text-accent-green">·</span>SUA
          </Link>
        )}

        {/* Right: Lang | Menu | Cart */}
        <div className="flex items-center gap-7 ml-auto max-md:gap-4">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Language"
              className="text-ink-primary hover:text-accent-green transition-colors p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-9 bg-bg-primary border border-line py-1 min-w-[80px] shadow-md">
                {VISIBLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`block w-full px-4 py-2 text-mono text-[11px] tracking-[0.2em] text-left uppercase hover:bg-bg-secondary ${
                      currentLocale === lang.code ? 'text-ink-primary font-semibold' : 'text-ink-secondary'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu button */}
          <button
            onClick={openMenu}
            className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green transition-colors"
          >
            Menu
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-ink-primary hover:text-accent-green transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l2.5 12.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 6H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
