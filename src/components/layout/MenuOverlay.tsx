'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

const MAIN_LINKS = [
  { href: '/', label_en: 'Home', label_ko: '홈' },
  { href: '/shop', label_en: 'Shop', label_ko: 'Shop' },
  { href: '/lookbooks', label_en: 'Lookbooks', label_ko: 'Lookbooks' },
  { href: '/about', label_en: 'About', label_ko: 'About' },
  { href: '/project', label_en: 'Project', label_ko: 'Project' },
];

export function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; isAdmin?: boolean } | null>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // 메뉴 열림/닫힘 이벤트 리스너
  useEffect(() => {
    function handleMenuEvent(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.open !== undefined) setOpen(detail.open);
    }
    window.addEventListener('chezsua:menu', handleMenuEvent);
    return () => window.removeEventListener('chezsua:menu', handleMenuEvent);
  }, []);

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

  // 페이지 이동 시 자동 닫힘
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

  // 유저 정보 가져오기
  useEffect(() => {
    if (!open) return;

    async function loadUser() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setUser(null);
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();
      setUser({
        id: authUser.id,
        email: authUser.email,
        isAdmin: profile?.role === 'admin',
      });
    }
    loadUser();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-bg-primary z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setOpen(false)}
        aria-label="Close menu"
        className="absolute top-7 right-12 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green max-md:top-5 max-md:right-6"
      >
        Close
      </button>

      <div className="min-h-screen flex flex-col pt-32 pb-12 px-12 max-md:pt-24 max-md:px-7">
        {/* Main Links */}
        <nav className="flex-1">
          <ul className="space-y-3 max-md:space-y-2">
            {MAIN_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-serif text-6xl font-light text-ink-primary hover:italic hover:text-accent-green transition-all max-md:text-4xl"
                >
                  {locale === 'ko' ? link.label_ko : link.label_en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-line">
          {user ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-mono text-[11px] tracking-[0.25em] uppercase">
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-ink-primary hover:text-accent-green transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/account"
                className="text-ink-primary hover:text-accent-green transition-colors"
              >
                My Account
              </Link>
              <Link
                href="/auth/signout"
                className="text-ink-secondary hover:text-ink-primary transition-colors"
              >
                Logout
              </Link>
              <span className="text-ink-muted text-[10px] ml-auto max-md:ml-0">
                {user.email}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-mono text-[11px] tracking-[0.25em] uppercase">
              <Link
                href="/auth/login"
                className="text-ink-primary hover:text-accent-green transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-ink-primary hover:text-accent-green transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
