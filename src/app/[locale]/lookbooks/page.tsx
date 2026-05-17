import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Lookbooks — CHEZSUA',
    description:
      locale === 'ko'
        ? 'CHEZSUA의 룩북 컬렉션 — 패션, 브랜드, 호텔, 웨딩, 파인다이닝 플로럴 작업.'
        : 'CHEZSUA lookbooks — fashion, brand, hotel, wedding, and fine dining floral work.',
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
  is_video?: boolean;
  video_url?: string;
}

export default async function LookbooksPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // 모든 published 룩북 가져오기
  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false, nullsFirst: false })
    .order('publish_date', { ascending: false });

  const allLookbooks: Lookbook[] = lookbooks || [];

  // 카테고리별 개수 계산
  const categoryGroups = allLookbooks.reduce((acc, lb) => {
    const cat = lb.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { value: 'all', label_en: 'All', label_ko: '전체', count: allLookbooks.length },
    ...Object.entries(categoryGroups).map(([value, count]) => ({
      value,
      label_en: value.charAt(0).toUpperCase() + value.slice(1),
      label_ko: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    })),
  ];

  const isKo = locale === 'ko';

  return (
    <main className="pt-32 pb-20 max-md:pt-24">
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-16 max-md:mb-10">
        <div className="text-center">
          <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
            CHEZSUA · LOOKBOOKS
          </div>
          <div className="w-12 h-px bg-ink-primary mx-auto mb-8" />
          <h1 className={`text-7xl font-light leading-[1.05] tracking-[-0.02em] text-ink-primary mb-6 max-md:text-5xl ${isKo ? 'text-korean-serif' : 'text-serif'}`}>
            {isKo ? '룩북' : 'Lookbooks'}
          </h1>
          <p className={`text-xl text-ink-secondary leading-[1.85] max-w-2xl mx-auto max-md:text-base ${isKo ? 'text-korean-serif' : 'text-serif'}`}>
            {isKo
              ? '브랜드, 호텔, 웨딩, 파인다이닝을 위한 에디토리얼 플로럴 작업.'
              : 'Editorial floral work for brands, hotels, weddings, and fine dining.'}
          </p>
        </div>
      </section>

      {/* Categories */}
      {allLookbooks.length > 0 && categories.length > 1 && (
        <section className="max-w-[1400px] mx-auto px-12 max-md:px-7 mb-12 max-md:mb-8">
          <div className="flex flex-wrap justify-center gap-3 max-md:gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/lookbooks' : `/lookbooks/${cat.value}`}
                className="px-5 py-2 text-mono text-[11px] tracking-[0.2em] uppercase border border-line text-ink-secondary hover:border-ink-primary hover:text-ink-primary transition-colors"
              >
                {isKo ? cat.label_ko : cat.label_en} ({cat.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lookbook Grid */}
      <section className="max-w-[1400px] mx-auto px-12 max-md:px-7">
        {allLookbooks.length === 0 ? (
          // 비어있을 때
          <div className="py-32 text-center max-md:py-20">
            <p className={`text-3xl text-ink-secondary italic mb-4 ${isKo ? 'text-korean-serif' : 'text-serif'}`}>
              {isKo ? '준비 중입니다' : 'Coming Soon'}
            </p>
            <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
              {isKo ? '새로운 룩북을 곧 만나보실 수 있습니다' : 'New lookbooks will be available soon'}
            </p>
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
                  {/* Image */}
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

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2">
                    {lookbook.is_featured && (
                      <span className="text-mono text-[9px] tracking-[0.2em] uppercase text-accent-green border border-accent-green px-1.5 py-0.5">
                        Featured
                      </span>
                    )}
                    {lookbook.category && (
                      <span className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
                        {lookbook.category}
                      </span>
                    )}
                  </div>

                  {/* Title */}
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

                  {/* Client */}
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
