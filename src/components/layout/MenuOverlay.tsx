'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import type { Locale } from '@/lib/i18n';
import type { SiteMenuItem } from '@/lib/site-menus';

interface MenuOverlayProps {
  locale: Locale;
  menus: SiteMenuItem[];
}

export function MenuOverlay({ locale, menus }: MenuOverlayProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);

    const supabase = createClient();

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        // role 확인
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setOpen(detail?.open ?? false);
    };
    window.addEventListener('chezsua:menu', handler);
    return () => window.removeEventListener('chezsua:menu', handler);
  }, []);

  // 메뉴 열릴 때 body 스크롤 잠금
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

  const close = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('chezsua:menu', { detail: { open: false } }));
  };

  if (!mounted) return null;
  if (!open) return null;

  const topMenus = menus
    .filter((m) => !m.parent_id && m.visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 bg-ink-primary/40 z-40"
        style={{ animation: 'menuFadeIn 0.4s ease' }}
      />

      {/* Slide-in panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 w-[480px] h-screen bg-bg-primary z-50 flex flex-col px-12 pt-24 pb-12 border-l border-line max-md:w-full max-md:px-7 overflow-y-auto"
        style={{ animation: 'menuSlideIn 0.5s cubic-bezier(0.7,0,0.3,1)' }}
      >
        <button
          onClick={close}
          aria-label="Close menu"
          className="absolute top-7 right-12 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green transition-colors max-md:right-7"
        >
          Close ×
        </button>

        <nav className="flex flex-col gap-1">
          {topMenus.map((menu) => {
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

          {/* 관리자만 표시되는 Admin 메뉴 */}
          {isAdmin && (
            <a
              href="/admin"
              onClick={close}
              className="text-serif text-[44px] font-normal leading-tight py-1 transition-all duration-300 hover:translate-x-2 max-md:text-[32px] flex items-baseline gap-3"
              style={{ color: '#C53030', fontWeight: 500 }}
            >
              <span
                className="text-mono text-[9px] tracking-[0.25em] uppercase px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: '#C53030',
                  color: '#fff',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontSize: '9px',
                }}
              >
                ADMIN
              </span>
              Admin Panel
            </a>
          )}
        </nav>

        {/* Login / My Account 영역 */}
        <div className="mt-10 pt-8 border-t border-line-soft">
          {isLoggedIn ? (
            <>
              <Link
                href="/account"
                onClick={close}
                className="block text-mono text-[12px] tracking-[0.25em] uppercase text-accent-green hover:text-ink-primary transition-colors mb-3"
              >
                → My Account
              </Link>
              <Link
                href="/auth/signout"
                onClick={close}
                className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary transition-colors"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={close}
                className="block text-mono text-[12px] tracking-[0.25em] uppercase text-accent-green hover:text-ink-primary transition-colors mb-3"
              >
                → Login
              </Link>
              <Link
                href="/auth/register"
                onClick={close}
                className="block text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="mt-auto pt-12 border-t border-line">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-4">
            Visit · Inquire
          </div>
          <div className="text-sm text-ink-secondary leading-loose mb-6">
            Seoul · Gangnam
            <br />
            +82 02-XXXX-XXXX
            <br />
            chezsuaflower@gmail.com
          </div>
          <div className="flex gap-3">
            <a href="https://instagram.com/chezsua" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-ink-primary hover:text-bg-primary hover:border-ink-primary transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-ink-primary hover:text-bg-primary hover:border-ink-primary transition-all">
              <svg width="16" height="12" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="0.75" y="0.75" width="22.5" height="15.5" rx="4" />
                <path d="M9.5 5L15 8.5L9.5 12V5Z" fill="currentColor" />
              </svg>
            </a>
            <a href="https://blog.naver.com/chezsua_" aria-label="Naver Blog" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center border border-line text-ink-secondary hover:bg-ink-primary hover:text-bg-primary hover:border-ink-primary transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21V3H10L17 14V3H21V21H14L7 10V21H3Z" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes menuFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes menuSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
