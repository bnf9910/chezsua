import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { formatDate, truncate } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import type { Lookbook } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface VideoArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  seed: number;
}

export function VideoArticle({ lookbook, locale, seed }: VideoArticleProps) {
  const t = useTranslations('Lookbook');
  const tHome = useTranslations('Home');

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const excerpt =
    locale === 'ko'
      ? lookbook.excerpt_ko ?? truncate(lookbook.article_ko, 50)
      : lookbook.excerpt_en ?? truncate(lookbook.article_en, 50);

  return (
    <article className="bg-bg-soft py-32 max-lg:py-20">
      <div className="max-w-[1600px] mx-auto px-12 grid grid-cols-[280px_1fr_280px] gap-14 items-center max-lg:grid-cols-1 max-lg:gap-8 max-lg:px-7">
        {/* Left: meta */}
        <div className="text-mono text-[10px] tracking-[0.12em] leading-[2.1] uppercase text-ink-secondary">
          <MetaItem label={t('date')} value={formatDate(lookbook.publish_date, locale)} />
          <MetaItem label={t('magazine')} value={lookbook.magazine} />
          <MetaItem label={t('client')} value={lookbook.client} />
          <MetaItem label={t('mainFlorist')} value={lookbook.main_florist} />
          {lookbook.sub_florist && (
            <MetaItem label={t('subFlorist')} value={lookbook.sub_florist} />
          )}
        </div>

        {/* Center: video */}
        <div className="relative aspect-video bg-ink-primary overflow-hidden">
          <div className={`absolute inset-0 ${getPlaceholderClass(seed)}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              aria-label="Play video"
              className="w-[88px] h-[88px] border border-white/70 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all hover:bg-white/90 group"
            >
              <span
                className="ml-1 transition-colors"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '14px solid currentColor',
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  color: 'white',
                }}
              />
            </button>
          </div>
        </div>

        {/* Right: article */}
        <div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3">
            Film
          </div>
          <h3 className="text-serif text-[32px] font-normal leading-[1.05] tracking-[-0.015em] mb-4 text-ink-primary [&>em]:italic [&>em]:font-light">
            {title}
          </h3>
          <p className="text-serif text-base leading-[1.65] text-ink-secondary mb-6">
            {excerpt}
          </p>
          <Link
            href={`/lookbooks/${lookbook.slug}`}
            className="inline-flex items-center gap-3 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1.5 transition-all duration-300 hover:gap-5 w-fit"
          >
            {tHome('watchFilm')}
            <span className="font-sans">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4 first:mt-0">
      <div className="text-ink-muted">{label}</div>
      <div className="text-ink-primary">{value}</div>
    </div>
  );
}
