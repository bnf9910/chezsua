import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

interface Lookbook {
  id: string;
  slug: string;
  title_en?: string;
  title_ko?: string;
  title_zh?: string;
  article_en?: string;
  article_ko?: string;
  article_zh?: string;
  client: string;
  category?: string;
  main_florist?: string;
  sub_florist?: string;
  cover_image?: string;
  images?: string[];
  publish_date: string;
}

interface Props {
  lookbook: Lookbook;
  locale: Locale;
  index: number;
  isReversed?: boolean;
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  if (locale === 'ko') return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function magazineCategory(category: string, locale: Locale): string {
  const map: Record<string, { en: string; ko: string }> = {
    fashion: { en: 'Fashion', ko: 'Fashion' },
    brands: { en: 'Brands', ko: 'Brands' },
    hotels: { en: 'Hotels', ko: 'Hotels' },
    company: { en: 'Company', ko: 'Company' },
    'fine-dining': { en: 'Fine Dining', ko: 'Fine Dining' },
    wedding: { en: 'Wedding', ko: 'Wedding' },
    vip: { en: 'VIP', ko: 'VIP' },
    etc: { en: 'Etc', ko: 'Etc' },
  };
  return map[category]?.[locale === 'ko' ? 'ko' : 'en'] || category;
}

export function MagazineArticle({ lookbook, locale, index, isReversed }: Props) {
  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : lookbook.article_en;
  const coverImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]);
  const articleNum = String(42 - index).padStart(3, '0');

  return (
    <section className={`min-h-screen flex items-center px-12 py-20 max-md:px-6 max-md:py-14 ${
      index % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-soft'
    }`}>
      <div className={`max-w-[1400px] mx-auto grid grid-cols-2 gap-16 items-center w-full max-lg:gap-10 max-md:grid-cols-1 max-md:gap-8 ${
        isReversed ? 'lg:[direction:rtl]' : ''
      }`}>
        {/* Image */}
        <div className={`${isReversed ? 'lg:[direction:ltr]' : ''}`}>
          <Link
            href={`/${locale}/lookbooks/story/${lookbook.slug}`}
            className="block aspect-[4/5] bg-ink-primary overflow-hidden group"
          >
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt={title || lookbook.client}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent-sage to-accent-green" />
            )}
          </Link>
        </div>

        {/* Content */}
        <div className={`${isReversed ? 'lg:[direction:ltr]' : ''}`}>
          {/* Article Number */}
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3">
            CHEZSUA · Article N° {articleNum}
          </div>

          {/* Title */}
          <h2
            className="text-serif text-6xl font-light leading-[1.1] tracking-[-0.015em] text-ink-primary mb-8 max-md:text-4xl"
            dangerouslySetInnerHTML={{ __html: renderEmphasis(title || '') }}
          />

          {/* Meta */}
          <div className="space-y-2 mb-8 text-mono text-[11px] tracking-[0.15em] text-ink-secondary">
            <div>
              <span className="text-ink-muted uppercase tracking-[0.25em] mr-3 text-[10px]">
                {locale === 'ko' ? 'Date' : 'Date'}
              </span>
              {formatDate(lookbook.publish_date, locale)}
            </div>
            <div>
              <span className="text-ink-muted uppercase tracking-[0.25em] mr-3 text-[10px]">
                {locale === 'ko' ? 'Client' : 'Client'}
              </span>
              {lookbook.client}
            </div>
            {lookbook.category && (
              <div>
                <span className="text-ink-muted uppercase tracking-[0.25em] mr-3 text-[10px]">
                  {locale === 'ko' ? 'Category' : 'Category'}
                </span>
                {magazineCategory(lookbook.category, locale)}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {article && (
            <p className="text-serif text-lg text-ink-secondary leading-[1.8] mb-10 line-clamp-4 max-md:text-base">
              {article.substring(0, 240)}
              {article.length > 240 && '...'}
            </p>
          )}

          {/* View Details Link */}
          <Link
            href={`/${locale}/lookbooks/story/${lookbook.slug}`}
            className="inline-flex items-center gap-3 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary border-b-2 border-ink-primary pb-1 hover:text-accent-green hover:border-accent-green transition-colors"
          >
            {locale === 'ko' ? 'View Details' : 'View Details'}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
