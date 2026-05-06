import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CONTACT_INFO } from '@/lib/constants';
import { SocialIcons } from '@/components/ui/SocialIcons';
import { routing, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return { title: t('title') };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[880px] mx-auto px-12 py-24 text-center max-md:px-7 max-md:py-12">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5">
          — {t('label')}
        </div>
        <h1 className="text-serif text-[clamp(48px,6vw,80px)] font-light leading-[1.05] tracking-[-0.015em] mb-14 [&>em]:italic">
          {t('title')}
        </h1>

        <div className="grid grid-cols-2 gap-x-16 gap-y-14 text-left max-w-[680px] mx-auto mb-16 pt-14 border-t border-line max-md:grid-cols-1 max-md:gap-9 max-md:pt-9">
          <ContactItem label={t('atelier')}>
            {t('atelierValue')}
            <br />
            <span className="text-ink-secondary">{t('atelierNote')}</span>
          </ContactItem>
          <ContactItem label={t('phone')}>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
              className="border-b border-line hover:border-ink-primary transition-colors"
            >
              {CONTACT_INFO.phone}
            </a>
          </ContactItem>
          <ContactItem label={t('email')}>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="border-b border-line hover:border-ink-primary transition-colors"
            >
              {CONTACT_INFO.email}
            </a>
          </ContactItem>
          <ContactItem label={t('hours')}>
            {t('hoursValue')}
            <br />
            <span className="text-ink-secondary">{t('hoursTime')}</span>
          </ContactItem>
        </div>

        <div className="flex justify-center">
          <SocialIcons locale={locale as Locale} size="lg" variant="default" />
        </div>
      </div>
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-3">
        {label}
      </div>
      <div className="text-serif text-[22px] font-normal text-ink-primary leading-[1.4]">
        {children}
      </div>
    </div>
  );
}
