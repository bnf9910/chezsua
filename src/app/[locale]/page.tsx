import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MagazineArticle } from '@/components/home/MagazineArticle';
import { VideoArticle } from '@/components/home/VideoArticle';
import type { Locale } from '@/lib/i18n';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // 1. Featured 룩북
  const { data: featured } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('publish_date', { ascending: false })
    .limit(5);

  // 2. 일반 룩북
  let recent: typeof featured = [];
  const featuredIds = (featured || []).map((f) => f.id);

  if ((featured?.length || 0) < 5) {
    const remainingCount = 5 - (featured?.length || 0);

    let recentQuery = supabase
      .from('lookbooks')
      .select('*')
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .limit(remainingCount);

    if (featuredIds.length > 0) {
      recentQuery = recentQuery.not('id', 'in', `(${featuredIds.join(',')})`);
    }

    const { data } = await recentQuery;
    recent = data || [];
  }

  const allLookbooks = [...(featured || []), ...recent];

  // DB 비어있을 때 fallback
  if (allLookbooks.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-primary px-12 max-md:px-6 py-20">
        <div className="text-center max-w-3xl">
          <div className="mb-16 max-md:mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-black.png"
              alt="CHEZSUA"
              className="h-32 max-md:h-20 mx-auto"
            />
          </div>

          <h1 className="text-serif text-8xl font-medium italic text-ink-primary mb-8 leading-[1.1] tracking-[-0.02em] max-md:text-5xl">
            Stories Coming Soon
          </h1>

          <p className="text-serif text-2xl text-ink-secondary leading-relaxed max-md:text-lg">
            {locale === 'ko'
              ? '편집실에서 새로운 이야기를 준비하고 있습니다.'
              : 'New stories are being prepared in the editorial room.'}
          </p>
        </div>
      </main>
    );
  }

  // 룩북이 있으면 풀와이드 매거진 레이아웃
  return (
    <main>
      {allLookbooks.map((lookbook, index) => {
        if (lookbook.is_video || lookbook.video_url) {
          return (
            <section
              key={lookbook.id}
              className="py-20 max-md:py-12 px-12 max-md:px-6"
            >
              <div className="max-w-[1400px] mx-auto">
                <VideoArticle
                  lookbook={lookbook}
                  locale={locale}
                  index={index}
                  reverse={index % 2 === 1}
                />
              </div>
            </section>
          );
        }
        return (
          <MagazineArticle
            key={lookbook.id}
            lookbook={lookbook}
            locale={locale}
            index={index}
            isReversed={index % 2 === 1}
          />
        );
      })}
    </main>
  );
}
