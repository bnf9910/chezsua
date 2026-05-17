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
  video_url?: string;
  publish_date?: string;
  created_at?: string;
}

interface Props {
  lookbook: Lookbook;
  locale: Locale;
  index: number;
  reverse?: boolean;
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

export function VideoArticle({ lookbook, reverse }: Props) {
  // 항상 영어
  const title = lookbook.title_en || lookbook.title_ko;
  const article = lookbook.article_en || lookbook.article_ko;
  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);
  const date = lookbook.publish_date || lookbook.created_at;

  return (
    <article
      className={`grid grid-cols-[7fr_3fr] gap-16 items-center max-lg:grid-cols-1 max-lg:gap-8 ${
        reverse ? 'lg:[direction:rtl]' : ''
      }`}
    >
      {/* Video / Image - 70% */}
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className="block aspect-[16/9] overflow-hidden relative group lg:[direction:ltr] bg-bg-soft"
      >
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title || ''}
            className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted">
            No Image
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-ink-primary/20">
          <div className="w-20 h-20 rounded-full bg-bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M2 2L22 14L2 26V2Z" fill="#1A1F1B" />
            </svg>
          </div>
        </div>

        <div className="absolute top-7 right-7 text-bg-primary text-mono text-[10px] tracking-[0.25em] uppercase font-medium opacity-90">
          ▶ Film
        </div>
      </Link>

      {/* Text - 30% */}
      <div className="flex flex-col gap-3 lg:[direction:ltr]">
        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green">
          {formatDate(date)}
        </div>
        <h2 className="text-serif text-[clamp(28px,3vw,44px)] font-light leading-[1.1] tracking-[-0.01em]">
          <Link
            href={`/lookbooks/story/${lookbook.slug}`}
            className="hover:text-accent-green transition-colors"
          >
            {title}
          </Link>
        </h2>
        {lookbook.client && (
          <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mt-1">
            {lookbook.client}
          </div>
        )}
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
        <Link
          href={`/lookbooks/story/${lookbook.slug}`}
          className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1 mt-4 self-start hover:text-accent-green hover:border-accent-green transition-colors"
        >
          Watch Film →
        </Link>
      </div>
    </article>
  );
}
