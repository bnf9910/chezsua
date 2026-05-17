import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: Locale; category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${categoryName} Lookbooks — CHEZSUA`,
    description:
      locale === 'ko'
        ? `CHEZSUA ${categoryName} 룩북 컬렉션`
        : `CHEZSUA ${categoryName} lookbook collection`,
  };
}

interface Lookbook {
  id: string;
  slug: string;
  title_en?: string;
  title_ko?: string;
  client?: string;
  category?: string;
  cover_image?: string;
  images?: string[];
  publish_date?: string;
  is_featured?: boolean;
}

export default async function LookbooksCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('is_featured', { ascending: false, nullsFirst: false })
    .order('publish_date', { ascending: false });

  const allLookbooks: Lookbook[] = lookbooks || [];

  // 모든 카테고리 (탭용)
  const { data: allCategories } = await supabase
    .from('lookbooks')
    .select('category')
    .eq('status', 'published');

  const categoryCounts: Record<string, number> = {};
  (allCategories || []).forEach((row) => {
    const cat = row.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const isKo = locale === 'ko';
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="pt-32 pb-20 max-md:pt-24">
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-16 max-md:mb-10">
        <div className="text-center">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
            CHEZSUA · LOOKBOOKS · {categoryLabel}
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />
          <h1
            className={`text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary mb-6 max-md:text-5xl ${
              isKo ? 'text-korean-serif' : 'text-serif'
            }`}
          >
            {categoryLabel}
          </h1>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-12 max-md:mb-8">
        <div className="flex flex-wrap justify-center gap-3 max-md:gap-2">
          <Link
            href="/lookbooks"
            className="px-5 py-2 text-mono text-[11px] tracking-[0.2em] uppercase border border-line text-ink-secondary hover:border-ink-primary hover:text-ink-primary transition-colors"
          >
            {isKo ? '전체' : 'All'} (
            {Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
          </Link>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <Link
              key={cat}
              href={`/lookbooks/${cat}`}
              className={`px-5 py-2 text-mono text-[11px] tracking-[0.2em] uppercase border transition-colors ${
                cat === category
                  ? 'bg-ink-primary text-bg-primary border-ink-primary'
                  : 'border-line text-ink-secondary hover:border-ink-primary hover:text-ink-primary'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
            </Link>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7">
        {allLookbooks.length === 0 ? (
          <div className="py-20 text-center">
            <p className={`text-3xl text-ink-secondary italic mb-4 ${isKo ? 'text-korean-serif' : 'text-serif'}`}>
              {isKo ? '이 카테고리에 룩북이 없습니다' : 'No lookbooks in this category'}
            </p>
            <Link
              href="/lookbooks"
              className="text-mono text-[11px] tracking-[0.25em] uppercase text-accent-green border-b border-accent-green pb-1 inline-block mt-4"
            >
              ← {isKo ? '전체 룩북 보기' : 'See all lookbooks'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-6">
            {allLookbooks.map((lookbook) => {
              const title = isKo
                ? lookbook.title_ko || lookbook.title_en
                : lookbook.title_en || lookbook.title_ko;
              const coverImage =
                lookbook.cover_image || (lookbook.images && lookbook.images[0]);

              return (
                <Link
                  key={lookbook.id}
                  href={`/lookbooks/story/${lookbook.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] bg-bg-soft overflow-hidden mb-4">
                    {coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImage}
                        alt={title || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {lookbook.is_featured && (
                      <span className="text-mono text-[9px] tracking-[0.2em] uppercase text-accent-green border border-accent-green px-1.5 py-0.5">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-2xl font-light leading-[1.3] text-ink-primary group-hover:text-accent-green transition-colors mb-2 ${
                      isKo ? 'text-korean-serif' : 'text-serif'
                    }`}
                    style={{
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {title}
                  </h3>

                  {lookbook.client && (
                    <p className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
                      {lookbook.client}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
