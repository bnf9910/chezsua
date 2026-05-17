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

function formatDate(date: string | undefined): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export function MagazineArticle({ lookbook, isReversed }: Props) {
  // 영어 고정
  const title = lookbook.title_en || lookbook.title_ko;
  const article = lookbook.article_en || lookbook.article_ko;

  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);
  const date = lookbook.publish_date || lookbook.created_at;

  return (
    <article
      className={`grid grid-cols-[7fr_3fr] items-stretch h-screen w-full max-lg:grid-cols-1 max-lg:h-auto ${
        isReversed ? 'lg:[direction:rtl]' : ''
      }`}
    >
      {/* Image - 가로 70% + 세로 100vh */}
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className="relative block w-full h-full overflow-hidden bg-bg-soft lg:[direction:ltr] group max-lg:aspect-[4/3] max-lg:h-auto"
      >
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title || ''}
            className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-1000 max-lg:relative"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
            No Image
          </div>
        )}
      </Link>

      {/* Text - 가로 30% + 세로 가운데 정렬 */}
      <div className="flex items-center justify-center px-12 py-16 max-lg:px-7 max-lg:py-12 lg:[direction:ltr]">
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Title */}
          <h2
            className="text-serif text-[clamp(28px,2.5vw,42px)] font-light leading-[1.15] tracking-[-0.01em] text-ink-primary"
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
          {date && (
            <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mt-2">
              {formatDate(date)}
            </div>
          )}
          {lookbook.client && (
            <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
              {lookbook.client}
            </div>
          )}

          {/* Article Preview */}
          {article && (
            <p
              className="text-serif text-base leading-[1.7] text-ink-secondary mt-3"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {article.split('\n')[0]}
            </p>
          )}

          {/* View Details */}
          <Link
            href={`/lookbooks/story/${lookbook.slug}`}
            className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-primary hover:text-accent-green border-b border-ink-primary hover:border-accent-green pb-1 mt-5 self-start inline-flex items-center gap-2 transition-colors"
          >
            View Details <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
