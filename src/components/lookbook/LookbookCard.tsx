import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface Lookbook {
  id: string;
  slug: string;
  title_en?: string;
  title_ko?: string;
  client?: string;
  category?: string;
  cover_image?: string;
  images?: string[];
  publish_date: string;
}

interface Props {
  lookbook: Lookbook;
  locale: Locale;
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function LookbookCard({ lookbook, locale }: Props) {
  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);

  return (
    <Link
      href={`/${locale}/lookbooks/story/${lookbook.slug}`}
      className="group block"
    >
      <div className="aspect-[4/5] bg-ink-primary overflow-hidden mb-4">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title || lookbook.client || 'Lookbook'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-sage to-accent-green" />
        )}
      </div>

      {lookbook.client && (
        <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1">
          {lookbook.client}
        </div>
      )}

      <h3
        className="text-serif text-xl leading-tight text-ink-primary group-hover:italic transition-all"
        dangerouslySetInnerHTML={{ __html: renderEmphasis(title || '') }}
      />

      {lookbook.category && (
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-accent-green mt-2">
          {lookbook.category}
        </div>
      )}
    </Link>
  );
}
