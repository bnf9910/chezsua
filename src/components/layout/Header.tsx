'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 어떤 페이지인지 판단
  // /ko/shop, /ko/shop/category, /ko/lookbooks, /ko/lookbooks/category 등
  const isShopOrLookbook =
    pathname?.match(/^\/(en|ko|zh)\/(shop|lookbooks)/) !== null;

  // 홈페이지 여부 (홈에서는 로고 안 보임)
  const isHome = pathname?.match(/^\/(en|ko|zh)?\/?$/) !== null;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function openMenu() {
    window.dispatchEvent(
      new CustomEvent('chezsua:menu', { detail: { open: true } })
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-primary/95 backdrop-blur-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="flex justify-between items-center px-12 max-md:px-6">
        {/* Logo Area */}
        {isShopOrLookbook ? (
          // Shop/Lookbooks: 큰 골드 로고 이미지
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-gold.png"
              alt="CHEZSUA"
              className={`transition-all duration-300 ${
                scrolled
                  ? 'h-12 max-md:h-9'
                  : 'h-16 max-md:h-12'
              }`}
            />
          </Link>
        ) : isHome ? (
          // 홈: 로고 숨김 (Hero 영상이 메인)
          <div />
        ) : (
          // 나머지: 텍스트 로고
          <Link
            href="/"
            className="text-serif text-2xl tracking-[0.25em] text-ink-primary font-normal hover:text-accent-gold transition-colors"
          >
            CHEZSUA
          </Link>
        )}

        {/* Right side */}
        <div className="flex items-center gap-6 max-md:gap-4">
          {/* Admin Button */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-gold hover:text-bg-primary hover:bg-accent-gold border border-accent-gold px-3 py-1.5 transition-all max-md:px-2 max-md:py-1"
            >
              Admin
            </Link>
          )}

          {/* Menu Button */}
          <button
            onClick={openMenu}
            aria-label="Open menu"
            className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-gold transition-colors"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
