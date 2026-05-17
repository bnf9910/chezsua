import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface Lookbook {
  id: string;
  slug: string;
  title_en?: string;
  title_ko?: string;
  article_en?: string;
  article_ko?: string;
  client?: string;
  category?: string;
  cover_image?: string;
  images?: string[];
  publish_date?: string;
  created_at?: string;
}

interface Props {
  lookbook: Lookbook;
  locale: Locale;
  index: number;
  isReversed?: boolean;
}

export function MagazineArticle({ lookbook, locale, index, isReversed }: Props) {
  const isKo = locale === 'ko';
  const title = isKo ? lookbook.title_ko || lookbook.title_en : lookbook.title_en || lookbook.title_ko;
  const article = isKo ? lookbook.article_ko || lookbook.article_en : lookbook.article_en || lookbook.article_ko;

  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);
  const date = lookbook.publish_date || lookbook.created_at;
  const articleNumber = String(42 - index).padStart(3, '0');

  return (
    <section className="py-20 max-md:py-12 px-12 max-md:px-6">
      <div className="max-w-[1400px] mx-auto">
        <div
          className={`grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-10 ${
            isReversed ? 'lg:[direction:rtl]' : ''
          }`}
        >
          {/* Image */}
          <div className={isReversed ? 'lg:[direction:ltr]' : ''}>
            <div className="aspect-[4/5] bg-bg-soft overflow-hidden">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt={title || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={isReversed ? 'lg:[direction:ltr]' : ''}>
            {/* Article Number */}
            <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-6">
              CHEZSUA · ARTICLE N° {articleNumber}
            </div>

            {/* Title - 한글이면 Noto Serif KR */}
            <h2
              className={`text-5xl font-light leading-[1.2] mb-8 text-ink-primary max-md:text-3xl ${
                isKo ? 'text-korean-serif' : 'text-serif'
              }`}
              style={{
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
              }}
            >
              {title}
            </h2>

            {/* Meta */}
            <div className="space-y-1.5 mb-8 text-sm">
              {date && (
                <div className="flex gap-4">
                  <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted w-20">
                    Date
                  </span>
                  <span className="text-ink-primary">
                    {new Date(date).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', '.')}
                  </span>
                </div>
              )}
              {lookbook.client && (
                <div className="flex gap-4">
                  <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted w-20">
                    Client
                  </span>
                  <span className="text-ink-primary uppercase">{lookbook.client}</span>
                </div>
              )}
              {lookbook.category && (
                <div className="flex gap-4">
                  <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted w-20">
                    Category
                  </span>
                  <span className="text-ink-primary uppercase">{lookbook.category}</span>
                </div>
              )}
            </div>

            {/* Article Preview - 잘림 수정 */}
            {article && (
              <div
                className={`text-ink-secondary mb-8 leading-[1.85] ${
                  isKo ? 'text-korean-serif' : 'text-serif'
                }`}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: isKo ? '15px' : '16px',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                {article}
              </div>
            )}

            {/* View Details */}
            <Link
              href={`/lookbooks/story/${lookbook.slug}`}
              className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green border-b border-ink-primary hover:border-accent-green pb-1 inline-flex items-center gap-2 transition-colors"
            >
              View Details <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
