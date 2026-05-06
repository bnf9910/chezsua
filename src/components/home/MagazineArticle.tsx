import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { formatDate, truncate } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import type { Lookbook } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface MagazineArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  seed: number;
  reverse?: boolean;
}

export function MagazineArticle({ lookbook, locale, seed, reverse }: MagazineArticleProps) {
  const t = useTranslations('Lookbook');
  const tHome = useTranslations('Home');
  const number = String(42 - seed).padStart(3, '0');

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const excerpt =
    locale === 'ko'
      ? lookbook.excerpt_ko ?? truncate(lookbook.article_ko, 50)
      : lookbook.excerpt_en ?? truncate(lookbook.article_en, 50);

  return (
    <article
      className={`grid min-h-screen items-stretch ${
        reverse
          ? 'grid-cols-[30fr_70fr] max-lg:grid-cols-1'
          : 'grid-cols-[70fr_30fr] max-lg:grid-cols-1'
      }`}
    >
      {/* Image side */}
      <div
        className={`relative overflow-hidden bg-bg-secondary min-h-screen max-lg:min-h-[80vh] ${
          reverse ? 'order-2' : 'order-1'
        } max-lg:order-1`}
      >
        <span className="absolute top-7 left-7 text-mono text-[10px] tracking-[0.3em] text-white/95 z-10 uppercase">
          — N° {number}
        </span>
        <div
          className={`absolute inset-0 ${getPlaceholderClass(seed)}`}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(45,63,46,0.3) 0%, transparent 50%)',
            }}
          />
        </div>
      </div>

      {/* Content side */}
      <div
        className={`px-14 py-20 flex flex-col justify-center bg-bg-primary max-lg:p-7 max-lg:py-16 ${
          reverse ? 'order-1' : 'order-2'
        } max-lg:order-2 ${seed === 0 ? 'pt-[130px] max-lg:pt-16' : ''}`}
      >
        {/* Meta */}
        <div className="text-mono text-[10px] tracking-[0.08em] leading-loose mb-7 pb-5 border-b border-line uppercase">
          <MetaRow label={t('date')} value={formatDate(lookbook.publish_date, locale)} />
          <MetaRow label={t('magazine')} value={lookbook.magazine} />
          <MetaRow label={t('client')} value={lookbook.client} />
          <MetaRow label={t('mainFlorist')} value={lookbook.main_florist} />
          {lookbook.sub_florist && <MetaRow label={t('subFlorist')} value={lookbook.sub_florist} />}
        </div>

        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
          Article — N° {number}
        </div>

        <h2 className="text-serif text-[clamp(36px,3.2vw,56px)] font-normal leading-[1.05] tracking-[-0.015em] mb-6 text-ink-primary [&>em]:italic [&>em]:font-light">
          {title}
        </h2>

        <p className="text-serif text-[17px] font-normal leading-[1.55] text-ink-secondary mb-8">
          {excerpt}
        </p>

        <Link
          href={`/lookbooks/${lookbook.slug}`}
          className="inline-flex items-center gap-3 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1.5 transition-all duration-300 hover:gap-5 w-fit"
        >
          {tHome('viewDetails')}
          <span className="font-sans">→</span>
        </Link>
      </div>
    </article>
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
