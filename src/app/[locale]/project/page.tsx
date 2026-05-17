import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectInquiryForm } from '@/components/home/ProjectInquiryForm';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? 'Project · 문의 — CHEZSUA' : 'Project · Inquiry — CHEZSUA',
    description: locale === 'ko'
      ? '브랜드 협업, 호텔, 웨딩 프로젝트 문의를 받습니다.'
      : 'Brand collaborations, hotel partnerships, and wedding inquiries.',
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: settingsRows } = await supabase.from('settings').select('*');

  const settings: Record<string, Record<string, string>> = {
    contact: { phone: '', email: 'chezsuaflower@gmail.com', address: 'Seoul · Gangnam', hours: 'Tue — Sat · 10:00 AM — 7:00 PM' },
    social: { instagram: '', naver_blog: '', youtube: '' },
  };

  (settingsRows || []).forEach((row) => {
    if (settings[row.key]) {
      settings[row.key] = { ...settings[row.key], ...(row.value as Record<string, string>) };
    }
  });

  const isKo = locale === 'ko';

  return (
    <main className="pt-32 pb-20">
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-12 max-md:px-7 text-center mb-20 max-md:mb-12">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
          {isKo ? '프로젝트 · 문의' : 'Project · Inquiry'}
        </div>

        <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />

        <h1 className="text-serif text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary mb-8 max-md:text-5xl">
          {isKo ? '함께 만들어요' : 'Let\'s Create Together'}
        </h1>

        <p className="text-serif text-xl text-ink-secondary leading-[1.7] max-w-2xl mx-auto max-md:text-base">
          {isKo
            ? '브랜드 협업, 호텔 파트너십, 웨딩, 그리고 특별한 순간을 위한 프로젝트를 함께 만들어갑니다.'
            : 'Brand collaborations, hotel partnerships, weddings, and projects for special moments.'}
        </p>
      </section>

      {/* Two columns: Form + Contact Info */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7">
        <div className="grid grid-cols-[1fr_400px] gap-16 max-lg:grid-cols-1 max-lg:gap-10">
          {/* Left: Inquiry Form */}
          <div>
            <h2 className="text-serif text-3xl font-light italic mb-8 max-md:text-2xl">
              {isKo ? '문의하기' : 'Start a Project'}
            </h2>
            <ProjectInquiryForm locale={locale} />
          </div>

          {/* Right: Contact Info */}
          <aside className="bg-bg-soft border border-line p-10 max-md:p-7 h-fit sticky top-32 max-lg:static">
            <h2 className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-6">
              {isKo ? '연락처' : 'Contact'}
            </h2>

            <div className="space-y-6">
              {settings.contact.phone && (
                <ContactItem
                  label={isKo ? '전화' : 'Phone'}
                  value={settings.contact.phone}
                />
              )}

              <ContactItem
                label={isKo ? '이메일' : 'Email'}
                value={settings.contact.email}
                href={`mailto:${settings.contact.email}`}
              />

              <ContactItem
                label={isKo ? '아틀리에' : 'Atelier'}
                value={settings.contact.address}
                subValue={isKo ? '예약제 운영' : 'By appointment'}
              />

              <ContactItem
                label={isKo ? '영업시간' : 'Hours'}
                value={settings.contact.hours}
              />

              {/* Social */}
              {(settings.social.instagram || settings.social.naver_blog || settings.social.youtube) && (
                <div className="pt-6 border-t border-line">
                  <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-3">
                    {isKo ? '팔로우' : 'Follow'}
                  </div>
                  <div className="flex gap-3">
                    {settings.social.instagram && (
                      <a
                        href={settings.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-ink-primary/20 text-ink-primary hover:bg-ink-primary hover:text-bg-primary transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="18" cy="6" r="1" fill="currentColor" />
                        </svg>
                      </a>
                    )}
                    {settings.social.naver_blog && (
                      <a
                        href={settings.social.naver_blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Naver Blog"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-ink-primary/20 text-ink-primary hover:bg-ink-primary hover:text-bg-primary transition-all"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 21V3H10L17 14V3H21V21H14L7 10V21H3Z" />
                        </svg>
                      </a>
                    )}
                    {settings.social.youtube && (
                      <a
                        href={settings.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-ink-primary/20 text-ink-primary hover:bg-ink-primary hover:text-bg-primary transition-all"
                      >
                        <svg width="16" height="12" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="0.75" y="0.75" width="22.5" height="15.5" rx="4" />
                          <path d="M9.5 5L15 8.5L9.5 12V5Z" fill="currentColor" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ContactItem({ label, value, subValue, href }: {
  label: string;
  value: string;
  subValue?: string;
  href?: string;
}) {
  return (
    <div>
      <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-2">
        {label}
      </div>
      {href ? (
        <a href={href} className="text-base text-ink-primary hover:text-accent-green transition-colors break-all">
          {value}
        </a>
      ) : (
        <div className="text-base text-ink-primary">{value}</div>
      )}
      {subValue && (
        <div className="text-xs text-ink-muted mt-1">{subValue}</div>
      )}
    </div>
  );
}
