import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n';
import { LookbookCard } from '@/components/lookbook/LookbookCard';
import { LookbookCategoryTabs } from '@/components/lookbook/LookbookCategoryTabs';
import { SAMPLE_LOOKBOOKS } from '@/lib/sample-data';
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
  const t = await getTranslations({ locale, namespace: 'Lookbooks' });
  return { title: t('title') };
}

export default async function LookbooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Lookbooks' });

  // TODO: Supabase에서 published 룩북 전체 조회
  const lookbooks = SAMPLE_LOOKBOOKS;

  return (
    <div className="pt-24">
      <section className="max-w-[1600px] mx-auto px-12 pt-15 pb-9 max-lg:px-7">
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/" className="hover:text-ink-primary">
            Home
          </Link>{' '}
          / <span className="text-ink-primary">{t('title')}</span>
        </div>
        <div className="flex justify-between items-end border-b border-line pb-8">
          <h1 className="text-serif text-[clamp(56px,7vw,96px)] font-light leading-none tracking-[-0.015em]">
            <em className="italic">{t('title')}</em>
          </h1>
          <div className="text-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            <strong className="text-ink-primary font-medium">{lookbooks.length}</strong>{' '}
            {t('stories')} · 2018 — 2026
          </div>
        </div>
      </section>

      <LookbookCategoryTabs locale={locale as Locale} active="all" />

      <section className="max-w-[1600px] mx-auto px-12 pt-14 pb-24 grid grid-cols-3 gap-x-8 gap-y-16 max-lg:px-7 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-10 max-md:px-5">
        {lookbooks.map((lookbook, i) => (
          <LookbookCard
            key={lookbook.id}
            lookbook={lookbook}
            locale={locale as Locale}
            seed={i}
          />
        ))}
      </section>
    </div>
  );
}
