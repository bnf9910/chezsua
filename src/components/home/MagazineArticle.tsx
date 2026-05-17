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

function formatDate(date: string | undefined, locale: Locale): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (locale === 'ko') {
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export function MagazineArticle({ lookbook, locale, isReversed }: Props) {
  const isKo = locale === 'ko';
  const title = isKo ? lookbook.title_ko || lookbook.title_en : lookbook.title_en || lookbook.title_ko;
  const article = isKo ? lookbook.article_ko || lookbook.article_en : lookbook.article_en || lookbook.article_ko;

  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);
  const date = lookbook.publish_date || lookbook.created_at;

  return (
    <article
      className={`grid grid-cols-[7fr_5fr] items-stretch min-h-[80vh] max-lg:grid-cols-1 max-lg:min-h-0 ${
        isReversed ? 'lg:[direction:rtl]' : ''
      }`}
    >
      {/* Image - 풀와이드 한쪽 끝까지 */}
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className="block relative overflow-hidden bg-bg-soft lg:[direction:ltr] group max-lg:aspect-[4/3]"
      >
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title || ''}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 max-lg:relative"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
            No Image
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex items-center px-16 py-20 max-lg:px-7 max-lg:py-12 lg:[direction:ltr]">
        <div className="w-full max-w-[500px]">
          {/* Title */}
          <h2
            className={`text-5xl font-light leading-[1.15] mb-8 text-ink-primary max-md:text-3xl ${
              isKo ? 'text-korean-serif' : 'text-serif'
            }`}
            style={{
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            <Link href={`/lookbooks/story/${lookbook.slug}`} className="hover:text-accent-green transition-colors">
              {title}
            </Link>
          </h2>

          {/* Meta */}
          <div className="space-y-1.5 mb-8 text-sm">
            {date && (
              <div className="flex gap-4">
                <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted w-20">
                  Date
                </span>
                <span className="text-ink-primary">{formatDate(date, locale)}</span>
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

          {/* Article Preview */}
          {article && (
            <div
              className={`text-ink-secondary mb-8 leading-[1.85] ${
                isKo ? 'text-korean-serif' : 'text-serif'
              }`}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
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
    </article>
  );
}
