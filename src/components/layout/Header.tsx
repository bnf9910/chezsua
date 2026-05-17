'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Link } from '@/lib/i18n';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        {/* Logo */}
        {isHome ? (
          <div />
        ) : (
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sage.png"
              alt="CHEZSUA"
              className={`transition-all duration-300 ${
                scrolled
                  ? 'h-9 max-md:h-7'
                  : 'h-11 max-md:h-9'
              }`}
            />
          </Link>
        )}

        {/* Right */}
        <div className="flex items-center gap-6 max-md:gap-4">
          {/* Admin Button - 일반 Next.js Link (locale 접두사 없음) */}
          {isAdmin && (
            <NextLink
              href="/admin"
              className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green hover:text-bg-primary hover:bg-accent-green border border-accent-green px-3 py-1.5 transition-all max-md:px-2 max-md:py-1"
            >
              Admin
            </NextLink>
          )}

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
