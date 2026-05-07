import { Link } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

interface MagazineArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  reverse?: boolean;
  index: number;
}

// 인덱스에 따른 그라디언트 - 인라인 스타일로 강제 적용
const GRADIENTS = [
  'linear-gradient(135deg, #E5C5BB 0%, #C4A089 100%)',
  'linear-gradient(135deg, #C4D0C0 0%, #8FA68C 100%)',
  'linear-gradient(135deg, #E8DFC8 0%, #C9B98F 100%)',
  'linear-gradient(135deg, #D6CFB8 0%, #A8A07A 100%)',
  'linear-gradient(135deg, #B8C7B0 0%, #7A9079 100%)',
];

export function MagazineArticle({ lookbook, locale, reverse, index }: MagazineArticleProps) {
  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : locale === 'zh' ? lookbook.article_zh : lookbook.article_en;
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <article
      className={`grid grid-cols-[7fr_3fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-8 ${
        reverse ? 'lg:[direction:rtl]' : ''
      }`}
    >
      {/* Image - 70% */}
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className="block aspect-[4/5] overflow-hidden relative group lg:[direction:ltr]"
        style={{ background: gradient }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>\")",
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink-primary/0 group-hover:bg-ink-primary/15 transition-colors duration-500" />

        {/* Index number */}
        <div className="absolute top-7 left-7 text-bg-primary text-mono text-xs tracking-[0.3em] font-medium opacity-90">
          {String(index + 1).padStart(2, '0')} / 05
        </div>
      </Link>

      {/* Text - 30% */}
      <div className="flex flex-col gap-3 lg:[direction:ltr]">
        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green">
          {formatDate(lookbook.publish_date, locale)}
        </div>
        <h2 className="text-serif text-[clamp(28px,3vw,44px)] font-light leading-[1.1] tracking-[-0.01em]">
          <Link
            href={`/lookbooks/story/${lookbook.slug}`}
            className="hover:text-accent-green transition-colors"
          >
            {title}
          </Link>
        </h2>
        <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mt-1">
          {lookbook.client}
        </div>
        {article && (
          <p className="text-serif text-base leading-[1.7] text-ink-secondary mt-3 line-clamp-4">
            {article.split('\n')[0]}
          </p>
        )}
        <Link
          href={`/lookbooks/story/${lookbook.slug}`}
          className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1 mt-4 self-start hover:text-accent-green hover:border-accent-green transition-colors"
        >
          {locale === 'ko' ? '자세히 보기' : locale === 'zh' ? '查看详情' : 'View Details'} →
        </Link>
      </div>
    </article>
  );
}
