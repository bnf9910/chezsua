'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n';

interface MenuOverlayProps {
  isAdmin?: boolean;
  userEmail?: string;
}

const MAIN_LINKS = [
  { href: '/', label_en: 'Home', label_ko: 'Home' },
  { href: '/shop', label_en: 'Shop', label_ko: 'Shop' },
  { href: '/lookbooks', label_en: 'Lookbooks', label_ko: 'Lookbooks' },
  { href: '/about', label_en: 'About', label_ko: 'About' },
  { href: '/project', label_en: 'Project', label_ko: 'Project' },
];

export function MenuOverlay({ isAdmin = false, userEmail = '' }: MenuOverlayProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const isLoggedIn = !!userEmail;

  // 메뉴 이벤트
  useEffect(() => {
    function handleMenuEvent(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.open !== undefined) setOpen(detail.open);
    }
    window.addEventListener('chezsua:menu', handleMenuEvent);
    return () => window.removeEventListener('chezsua:menu', handleMenuEvent);
  }, []);

  // 페이지 이동 시 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC로 닫기
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open]);

  // body 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-ink-primary/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Side Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-[420px] max-md:w-[90vw] bg-bg-primary z-50 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-10 pt-7 pb-3 max-md:px-7">
            <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted">
              Menu
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green transition-colors"
            >
              Close
            </button>
          </div>

          {/* Admin Dashboard - 서버에서 받은 isAdmin */}
          {isAdmin && (
            <div className="px-10 pt-3 pb-2 max-md:px-7">
              <Link
                href="/admin"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green transition-colors group"
              >
                <span className="text-mono text-[11px] tracking-[0.25em] uppercase">
                  관리자 대시보드
                </span>
                <span className="text-mono text-[16px] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-10 pt-6 max-md:px-7">
            <ul className="space-y-3">
              {MAIN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-serif text-4xl font-light text-ink-primary hover:italic hover:text-accent-green transition-all max-md:text-3xl"
                  >
                    {locale === 'ko' ? link.label_ko : link.label_en}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="px-10 pb-8 pt-6 border-t border-line max-md:px-7">
            {isLoggedIn ? (
              <div className="space-y-3">
                <Link
                  href="/account"
                  className="block text-mono text-[11px] tracking-[0.25em] uppercase text-ink-primary hover:text-accent-green transition-colors"
                >
                  My Account
                </Link>
                <Link
                  href="/auth/signout"
                  className="block text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  Logout
                </Link>
                <div className="text-mono text-[10px] text-ink-muted truncate pt-2 border-t border-line">
                  {userEmail}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block text-mono text-[11px] tracking-[0.25em] uppercase text-ink-primary hover:text-accent-green transition-colors"
                >
                  Login →
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
