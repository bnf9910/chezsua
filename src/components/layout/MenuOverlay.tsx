'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

interface MenuItem {
  id: string;
  label_en: string;
  label_ko: string;
  href: string;
  color: string;
  font_weight: string;
  font_size: string;
  is_event: boolean;
  event_badge: string;
  is_active: boolean;
  display_order: number;
  open_in_new_tab: boolean;
}

interface MenuOverlayProps {
  isAdmin?: boolean;
  userEmail?: string;
}

// 폴백: DB 메뉴 없을 때 기본 메뉴
const FALLBACK_LINKS: Partial<MenuItem>[] = [
  { href: '/', label_en: 'Home', label_ko: 'Home', color: '#1A1F1B', font_size: 'text-4xl', font_weight: 'normal' },
  { href: '/shop', label_en: 'Shop', label_ko: 'Shop', color: '#1A1F1B', font_size: 'text-4xl', font_weight: 'normal' },
  { href: '/lookbooks', label_en: 'Lookbooks', label_ko: 'Lookbooks', color: '#1A1F1B', font_size: 'text-4xl', font_weight: 'normal' },
  { href: '/about', label_en: 'About', label_ko: 'About', color: '#1A1F1B', font_size: 'text-4xl', font_weight: 'normal' },
  { href: '/project', label_en: 'Project', label_ko: 'Project', color: '#1A1F1B', font_size: 'text-4xl', font_weight: 'normal' },
];

export function MenuOverlay({ isAdmin = false, userEmail = '' }: MenuOverlayProps) {
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState<Partial<MenuItem>[]>(FALLBACK_LINKS);
  const locale = useLocale();
  const pathname = usePathname();
  const isLoggedIn = !!userEmail;

  // DB에서 메뉴 로드
  useEffect(() => {
    async function loadMenus() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (data && data.length > 0) {
          setMenus(data);
        }
      } catch (err) {
        console.error('[MenuOverlay] failed to load menus:', err);
      }
    }
    loadMenus();
  }, []);

  useEffect(() => {
    function handleMenuEvent(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.open !== undefined) setOpen(detail.open);
    }
    window.addEventListener('chezsua:menu', handleMenuEvent);
    return () => window.removeEventListener('chezsua:menu', handleMenuEvent);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function getFontWeight(weight?: string): number {
    switch (weight) {
      case 'light': return 300;
      case 'medium': return 500;
      case 'bold': return 700;
      default: return 400;
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink-primary/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[420px] max-md:w-[90vw] bg-bg-primary z-50 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-10 pt-7 pb-3 max-md:px-7">
            <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted">Menu</div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green transition-colors"
            >
              Close
            </button>
          </div>

          {/* Admin Dashboard */}
          {isAdmin && (
            <div className="px-10 pt-3 pb-2 max-md:px-7">
              <NextLink
                href="/admin"
                className="flex items-center justify-between gap-3 px-4 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green transition-colors group"
              >
                <span className="text-mono text-[11px] tracking-[0.25em] uppercase">관리자 대시보드</span>
                <span className="text-mono text-[16px] group-hover:translate-x-1 transition-transform">→</span>
              </NextLink>
            </div>
          )}

          {/* Main Navigation - DB 동적 메뉴 */}
          <nav className="flex-1 px-10 pt-6 max-md:px-7">
            <ul className="space-y-4">
              {menus.map((menu, i) => {
                const label = locale === 'ko' ? menu.label_ko || menu.label_en : menu.label_en || menu.label_ko;
                const className = `block ${menu.font_size || 'text-4xl'} max-md:!text-3xl hover:italic hover:opacity-70 transition-all`;
                const style = {
                  color: menu.color || '#1A1F1B',
                  fontWeight: getFontWeight(menu.font_weight),
                  fontFamily: "'Cormorant Garamond', 'Noto Serif KR', serif",
                };

                if (menu.open_in_new_tab && menu.href?.startsWith('http')) {
                  return (
                    <li key={menu.id || i}>
                      <a
                        href={menu.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                        style={style}
                      >
                        {label}
                        {menu.is_event && menu.event_badge && (
                          <span
                            className="ml-3 text-mono text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 align-middle text-white"
                            style={{ background: menu.color || '#1A1F1B' }}
                          >
                            {menu.event_badge}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={menu.id || i}>
                    <Link href={menu.href || '/'} className={className} style={style}>
                      {label}
                      {menu.is_event && menu.event_badge && (
                        <span
                          className="ml-3 text-mono text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 align-middle text-white"
                          style={{ background: menu.color || '#1A1F1B' }}
                        >
                          {menu.event_badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
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
