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

  // 홈페이지 여부 (홈에서는 검은색 CHEZSUA 텍스트)
  const isHome = pathname?.match(/^\/(en|ko|zh)?\/?$/) !== null;

  // Shop/Lookbooks/About/Project (골드 로고)
  const isInnerPage =
    pathname?.match(/^\/(en|ko|zh)\/(shop|lookbooks|about|project|account|terms|privacy|contact|auth)/) !== null;

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
        {isHome ? (
          // 홈: 검은색 CHEZSUA 텍스트
          <Link
            href="/"
            className="text-serif text-2xl tracking-[0.25em] text-ink-primary font-normal hover:text-accent-green transition-colors"
          >
            CHEZSUA
          </Link>
        ) : isInnerPage ? (
          // Shop/Lookbooks/About/Project: 골드 로고 (크기 살짝 축소)
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-gold.png"
              alt="CHEZSUA"
              className={`transition-all duration-300 ${
                scrolled
                  ? 'h-9 max-md:h-7'
                  : 'h-11 max-md:h-9'
              }`}
            />
          </Link>
        ) : (
          // 기타: 검은색 텍스트
          <Link
            href="/"
            className="text-serif text-2xl tracking-[0.25em] text-ink-primary font-normal hover:text-accent-green transition-colors"
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
            className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green transition-colors"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
