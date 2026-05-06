import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import { SAMPLE_LOOKBOOKS } from '@/lib/sample-data';
import type { Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  const params = [];
  for (const locale of ['en', 'ko']) {
    for (const lookbook of SAMPLE_LOOKBOOKS) {
      params.push({ locale, slug: lookbook.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lookbook = SAMPLE_LOOKBOOKS.find((l) => l.slug === slug);
  if (!lookbook) return { title: 'Not Found' };
  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  return {
    title: lookbook.meta_title ?? title,
    description: lookbook.meta_description ?? undefined,
  };
}

export default async function LookbookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Lookbook' });

  const lookbook = SAMPLE_LOOKBOOKS.find((l) => l.slug === slug);
  if (!lookbook) notFound();

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : lookbook.article_en;
  const number = String(42 - SAMPLE_LOOKBOOKS.indexOf(lookbook)).padStart(3, '0');

  return (
    <>
      {/* 7:3 hero */}
      <section className="grid grid-cols-[70fr_30fr] min-h-screen items-stretch max-lg:grid-cols-1">
        {/* Image side */}
        <div className="relative overflow-hidden bg-bg-secondary min-h-screen max-lg:min-h-[70vh]">
          <span className="absolute top-7 left-7 text-mono text-[10px] tracking-[0.3em] text-white/95 z-10 uppercase">
            — N° {number}
          </span>
          <div className={`absolute inset-0 ${getPlaceholderClass(0)}`}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 50%)',
              }}
            />
          </div>
        </div>

        {/* Content side */}
        <aside className="px-14 pt-32 pb-20 flex flex-col justify-center bg-bg-primary max-lg:p-7 max-lg:pt-16">
          <div className="text-mono text-[10px] tracking-[0.08em] leading-loose mb-7 pb-5 border-b border-line uppercase">
            <MetaRow label={t('date')} value={formatDate(lookbook.publish_date, locale as Locale)} />
            <MetaRow label={t('magazine')} value={lookbook.magazine} />
            <MetaRow label={t('client')} value={lookbook.client} />
            <MetaRow label={t('mainFlorist')} value={lookbook.main_florist} />
            {lookbook.sub_florist && <MetaRow label={t('subFlorist')} value={lookbook.sub_florist} />}
          </div>

          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
            Lookbook — N° {number}
          </div>

          <h1 className="text-serif text-[clamp(36px,3.2vw,56px)] font-normal leading-[1.05] tracking-[-0.015em] mb-6 [&>em]:italic [&>em]:font-light">
            {title}
          </h1>

          <p className="text-serif text-[17px] leading-[1.55] text-ink-secondary mb-8">
            {article.length > 200 ? article.slice(0, 200) + '…' : article}
          </p>
        </aside>
      </section>

      {/* Body */}
      <article className="max-w-[1080px] mx-auto px-12 py-24 max-md:px-7 max-md:py-16">
        <p className="text-serif text-lg leading-[1.75] text-ink-secondary mb-8">{article}</p>

        {/* Gallery placeholder */}
        <div className="grid grid-cols-2 gap-6 my-16">
          <div className="col-span-2 aspect-video bg-bg-secondary overflow-hidden relative">
            <div className={`absolute inset-0 ${getPlaceholderClass(1)}`} />
          </div>
          <div className="aspect-[4/5] bg-bg-secondary overflow-hidden relative">
            <div className={`absolute inset-0 ${getPlaceholderClass(2)}`} />
          </div>
          <div className="aspect-[4/5] bg-bg-secondary overflow-hidden relative">
            <div className={`absolute inset-0 ${getPlaceholderClass(3)}`} />
          </div>
        </div>

        <p className="text-serif italic text-[36px] font-light leading-tight text-accent-green text-center my-20 max-w-[800px] mx-auto py-12 border-t border-b border-line max-md:text-2xl max-md:my-12 max-md:py-8">
          &ldquo;Floristry, at its best, is a kind of editing — knowing what to leave out.&rdquo;
        </p>
      </article>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink-primary">{value}</span>
    </div>
  );
}
