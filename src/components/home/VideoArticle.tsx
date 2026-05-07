import { Link } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

interface VideoArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  reverse?: boolean;
  index: number;
}

const GRADIENTS = [
  'linear-gradient(135deg, #B8C7B0 0%, #7A9079 100%)',
  'linear-gradient(135deg, #C4A089 0%, #8B6F58 100%)',
  'linear-gradient(135deg, #C9B98F 0%, #9A8862 100%)',
];

export function VideoArticle({ lookbook, locale, reverse, index }: VideoArticleProps) {
  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : locale === 'zh' ? lookbook.article_zh : lookbook.article_en;
  const gradient = GRADIENTS[index % GRADIENTS.length] || GRADIENTS[0];

  return (
    <article
      className={`grid grid-cols-[7fr_3fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-8 ${
        reverse ? 'lg:[direction:rtl]' : ''
      }`}
    >
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className="block aspect-[16/9] overflow-hidden relative group lg:[direction:ltr]"
        style={{ backgroundImage: gradient }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>\")",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M2 2L22 14L2 26V2Z" fill="#1A1F1B" />
            </svg>
          </div>
        </div>

        <div className="absolute top-7 left-7 text-bg-primary text-mono text-xs tracking-[0.3em] font-medium opacity-90">
          {String(index + 1).padStart(2, '0')} / 05
        </div>

        <div className="absolute top-7 right-7 text-bg-primary text-mono text-[10px] tracking-[0.25em] uppercase font-medium opacity-90">
          ▶ Film
        </div>
      </Link>

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
          {locale === 'ko' ? '영상 보기' : locale === 'zh' ? '观看影片' : 'Watch Film'} →
        </Link>
      </div>
    </article>
  );
}
