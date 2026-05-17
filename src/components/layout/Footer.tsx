import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/lib/i18n';

interface FooterProps {
  locale?: Locale | string;
}

export async function Footer({ locale: propLocale }: FooterProps = {}) {
  // locale 안전하게 가져오기 (3중 안전장치)
  let locale: string = 'en';
  
  if (propLocale && typeof propLocale === 'string' && propLocale !== 'undefined') {
    locale = propLocale;
  } else {
    try {
      const intlLocale = await getLocale();
      if (intlLocale && intlLocale !== 'undefined') {
        locale = intlLocale;
      }
    } catch {
      locale = 'en';
    }
  }

  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from('settings').select('*');

  const settings: Record<string, Record<string, string>> = {
    site: { name: 'CHEZSUA', tagline: 'Editorial Floristry · Seoul', description: '' },
    contact: { phone: '', email: 'chezsuaflower@gmail.com', address: 'Seoul · Gangnam', hours: 'Tue — Sat · 10:00 AM — 7:00 PM' },
    social: { instagram: 'https://instagram.com/chezsua', naver_blog: '', youtube: '' },
  };

  (settingsRows || []).forEach((row) => {
    if (settings[row.key]) {
      settings[row.key] = { ...settings[row.key], ...(row.value as Record<string, string>) };
    }
  });

  const labels = {
    contact: locale === 'ko' ? '연락처' : 'Contact',
    visit: locale === 'ko' ? '방문 안내' : 'Visit',
    follow: locale === 'ko' ? '팔로우' : 'Follow',
    inquiries: locale === 'ko' ? '문의' : 'Inquiries',
    startProject: locale === 'ko' ? '프로젝트 시작하기' : 'Start a Project',
    terms: locale === 'ko' ? '이용약관' : 'Terms',
    privacy: locale === 'ko' ? '개인정보 처리방침' : 'Privacy',
    copyright: locale === 'ko' ? '모든 권리 보유' : 'All rights reserved',
  };

  return (
    <footer className="bg-ink-primary text-bg-primary py-20 px-12 max-md:py-14 max-md:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* 상단 로고 */}
        <div className="text-center mb-16 pb-16 border-b border-bg-primary/10">
          <Link
            href={`/${locale}`}
            className="text-serif text-5xl font-light tracking-[0.3em] text-bg-primary inline-block mb-4 max-md:text-4xl"
          >
            CHEZSUA
          </Link>
          <p className="text-mono text-[11px] tracking-[0.3em] uppercase text-bg-primary/60">
            {settings.site.tagline}
          </p>
        </div>

        {/* 4단 그리드 */}
        <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-8 mb-16">
          {/* Contact */}
          <div>
            <h3 className="text-mono text-[10px] tracking-[0.3em] uppercase text-bg-primary/50 mb-4">
              {labels.contact}
            </h3>
            <div className="text-sm text-bg-primary/90 leading-loose">
              {settings.contact.phone && <div>{settings.contact.phone}</div>}
              {settings.contact.email && (
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="hover:text-accent-sage transition-colors"
                >
                  {settings.contact.email}
                </a>
              )}
            </div>
          </div>

          {/* Visit */}
          <div>
            <h3 className="text-mono text-[10px] tracking-[0.3em] uppercase text-bg-primary/50 mb-4">
              {labels.visit}
            </h3>
            <div className="text-sm text-bg-primary/90 leading-loose">
              {settings.contact.address && <div>{settings.contact.address}</div>}
              {settings.contact.hours && (
                <div className="text-bg-primary/70 mt-1">{settings.contact.hours}</div>
              )}
            </div>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-mono text-[10px] tracking-[0.3em] uppercase text-bg-primary/50 mb-4">
              {labels.follow}
            </h3>
            <div className="flex gap-3">
              {settings.social.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-bg-primary/20 text-bg-primary/70 hover:bg-bg-primary hover:text-ink-primary hover:border-bg-primary transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" />
                  </svg>
                </a>
              )}
              {settings.social.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-bg-primary/20 text-bg-primary/70 hover:bg-bg-primary hover:text-ink-primary hover:border-bg-primary transition-all"
                >
                  <svg width="16" height="12" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="0.75" y="0.75" width="22.5" height="15.5" rx="4" />
                    <path d="M9.5 5L15 8.5L9.5 12V5Z" fill="currentColor" />
                  </svg>
                </a>
              )}
              {settings.social.naver_blog && (
                <a
                  href={settings.social.naver_blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Naver Blog"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-bg-primary/20 text-bg-primary/70 hover:bg-bg-primary hover:text-ink-primary hover:border-bg-primary transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 21V3H10L17 14V3H21V21H14L7 10V21H3Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <h3 className="text-mono text-[10px] tracking-[0.3em] uppercase text-bg-primary/50 mb-4">
              {labels.inquiries}
            </h3>
            <Link
              href={`/${locale}/project`}
              className="text-sm text-bg-primary hover:text-accent-sage transition-colors border-b border-bg-primary/30 pb-1 inline-block"
            >
              {labels.startProject} →
            </Link>
          </div>
        </div>

        {/* 하단 */}
        <div className="pt-8 border-t border-bg-primary/10 flex justify-between items-center text-mono text-[10px] tracking-[0.2em] uppercase text-bg-primary/40 max-md:flex-col max-md:gap-4">
          <div>© {new Date().getFullYear()} CHEZSUA · {labels.copyright}</div>
          <div className="flex gap-6">
            <Link href={`/${locale}/terms`} className="hover:text-bg-primary transition-colors">
              {labels.terms}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-bg-primary transition-colors">
              {labels.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
