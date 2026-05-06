'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/lib/i18n';
import { Link } from '@/lib/i18n';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Home과 Lookbook 상세에서는 헤더 투명 + 로고 숨김
  const isImmersive =
    pathname === '/' ||
    /^\/lookbooks\/story\/[^/]+$/.test(pathname);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // MENU 토글 시 body 스크롤 잠금 + custom event
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    window.dispatchEvent(
      new CustomEvent('chezsua:menu', { detail: { open: menuOpen } })
    );
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // 페이지 전환 시 메뉴 자동 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const switchLocale = (next: Locale) => {
    router.replace(`/${next}${pathname === '/' ? '' : pathname}`);
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-center px-12 py-7 max-md:px-5 max-md:py-4 pointer-events-auto">
        {/* Logo - Home에서는 숨김 */}
        <Link
          href="/"
          className={`text-serif text-2xl tracking-[0.32em] whitespace-nowrap transition-opacity duration-300 ${
            isImmersive ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } max-md:text-base max-md:tracking-[0.22em]`}
        >
          CHEZ<span className="italic font-light text-accent-sage mx-[2px]">·</span>SUA
        </Link>

        {/* Right cluster: 🌐 / MENU / 🛒 */}
        <div className="flex items-center gap-6 max-md:gap-3">
          {/* Language toggle (globe) */}
          <div ref={langRef} className="relative inline-flex">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((v) => !v);
              }}
              aria-label={t('language')}
              className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-primary hover:bg-ink-primary/5 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="w-[18px] h-[18px]"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18" />
                <path d="M12 3a14 14 0 0 0 0 18" />
              </svg>
            </button>
            <div
              className={`absolute top-[calc(100%+6px)] -right-2 bg-bg-soft border border-line p-1 min-w-[80px] shadow-lg transition-all duration-200 ${
                langOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
            >
              <button
                onClick={() => switchLocale('en')}
                className={`block w-full px-4 py-2 text-mono text-[11px] tracking-[0.2em] text-left uppercase hover:bg-bg-secondary ${
                  locale === 'en' ? 'text-ink-primary font-semibold' : 'text-ink-secondary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale('ko')}
                className={`block w-full px-4 py-2 text-mono text-[11px] tracking-[0.2em] text-left uppercase hover:bg-bg-secondary ${
                  locale === 'ko' ? 'text-ink-primary font-semibold' : 'text-ink-secondary'
                }`}
              >
                KO
              </button>
              <button
                onClick={() => switchLocale('zh')}
                className={`block w-full px-4 py-2 text-mono text-[11px] tracking-[0.2em] text-left uppercase hover:bg-bg-secondary ${
                  locale === 'zh' ? 'text-ink-primary font-semibold' : 'text-ink-secondary'
                }`}
              >
                ZH
              </button>
            </div>
          </div>

          {/* MENU text */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`text-mono text-xs tracking-[0.25em] uppercase text-ink-primary relative px-[2px] py-1 max-md:text-[11px] menu-toggle ${
              menuOpen ? 'is-open' : ''
            }`}
          >
            {t('menu')}
            <span className="absolute left-[2px] right-[2px] bottom-0 h-px bg-ink-primary origin-right scale-x-0 transition-transform duration-300 menu-underline" />
          </button>

          {/* Cart icon */}
          <Link
            href="/cart"
            aria-label={t('cart')}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-ink-primary hover:bg-ink-primary/5 transition-colors relative"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[19px] h-[19px]"
            >
              <path d="M3 4h2.5l2 13h11l2-9H7" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .menu-toggle:hover .menu-underline,
        .menu-toggle.is-open .menu-underline {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>
    </header>
  );
}
