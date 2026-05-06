import { Link } from '@/lib/i18n';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { getPlaceholderClass } from '@/lib/sample-data';
import type { Lookbook } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface LookbookCardProps {
  lookbook: Lookbook;
  locale: Locale;
  seed: number;
}

export function LookbookCard({ lookbook, locale, seed }: LookbookCardProps) {
  const t = useTranslations('Lookbooks');
  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  // @ts-expect-error - dynamic key
  const categoryKey = t(lookbook.category === 'fine-dining' ? 'fineDining' : lookbook.category);

  return (
    <Link
      href={`/lookbooks/story/${lookbook.slug}`}
      className="group cursor-pointer block"
    >
      <div className="aspect-[4/5] bg-bg-secondary overflow-hidden mb-5 relative">
        <div
          className={`absolute inset-0 transition-transform duration-1000 group-hover:scale-105 ${getPlaceholderClass(seed)}`}
        />
      </div>
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green mb-2">
        {categoryKey}
      </div>
      <h3 className="text-serif text-[26px] font-normal tracking-[-0.01em] leading-tight mb-2 [&>em]:italic">
        {title}
      </h3>
      <div className="text-mono text-[10px] tracking-[0.1em] uppercase text-ink-muted">
        {lookbook.client} <span className="mx-1.5">—</span>{' '}
        {formatDate(lookbook.publish_date, locale)}
      </div>
    </Link>
  );
}
