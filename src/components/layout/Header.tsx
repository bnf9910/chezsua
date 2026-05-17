'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import NextLink from 'next/link';
import { Link } from '@/lib/i18n';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const isHome = pathname?.match(/^\/(en|ko|zh)?\/?$/) !== null;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 외부 클릭으로 언어 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside() {
      setLangOpen(false);
    }
    if (langOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [langOpen]);

  function openMenu() {
    window.dispatchEvent(
      new CustomEvent('chezsua:menu', { detail: { open: true } })
    );
  }

  function switchLocale(newLocale: string) {
    if (!pathname) return;
    // 현재 경로에서 locale 부분만 교체
    const newPath = pathname.replace(/^\/(en|ko|zh)/, `/${newLocale}`);
    router.push(newPath);
    setLangOpen(false);
  }

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ko', label: 'KO', name: '한국어' },
  ];

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
                scrolled ? 'h-9 max-md:h-7' : 'h-11 max-md:h-9'
              }`}
            />
          </Link>
        )}

        {/* Right */}
        <div className="flex items-center gap-5 max-md:gap-3">
          {/* 🌐 Language Switcher */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Change language"
              className="flex items-center gap-1.5 text-mono text-[11px] tracking-[0.2em] uppercase text-ink-primary hover:text-accent-green transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{locale.toUpperCase()}</span>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 bg-bg-primary border border-line shadow-lg min-w-[140px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`w-full px-4 py-2.5 text-left text-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                      lang.code === locale
                        ? 'bg-bg-soft text-accent-green'
                        : 'text-ink-secondary hover:bg-bg-soft hover:text-ink-primary'
                    }`}
                  >
                    {lang.label} — {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Button */}
          {isAdmin && (
            <NextLink
              href="/admin"
              className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green hover:text-bg-primary hover:bg-accent-green border border-accent-green px-3 py-1.5 transition-all max-md:px-2 max-md:py-1"
            >
              Admin
            </NextLink>
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
