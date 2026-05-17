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

  // 1. Featured 룩북 조회 (사용자가 고정 + 순서 지정)
  const { data: featured } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('publish_date', { ascending: false })
    .limit(5);

  // 2. 일반 룩북 조회 (Featured 제외, 최신순)
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

  // 3. 합치기: Featured 먼저, 그 다음 최신
  const allLookbooks = [...(featured || []), ...recent];

  // 4. DB에 룩북이 하나도 없으면 fallback 데이터 사용
  if (allLookbooks.length === 0) {
    return <HomeFallback locale={locale} />;
  }

  return (
    <main>
      {allLookbooks.map((lookbook, index) => {
        // 영상 article (is_video=true 또는 video_url 있음)
        if (lookbook.is_video || lookbook.video_url) {
          return (
            <VideoArticle
              key={lookbook.id}
              lookbook={lookbook}
              locale={locale}
              index={index}
            />
          );
        }
        // 일반 매거진 article
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

/**
 * DB가 비어있을 때 표시할 fallback
 * Insert Sample Data를 안내
 */
function HomeFallback({ locale }: { locale: Locale }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg-soft px-12 max-md:px-6">
      <div className="text-center max-w-2xl">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-6">
          CHEZSUA
        </div>
        <h1 className="text-serif text-5xl font-light italic mb-6 max-md:text-4xl">
          Stories Coming Soon
        </h1>
        <p className="text-serif text-lg text-ink-secondary leading-relaxed mb-8">
          {locale === 'ko'
            ? '편집실에서 새로운 이야기를 준비하고 있습니다.'
            : 'New stories are being prepared in the editorial room.'}
        </p>
        <p className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
          Admin: visit /admin/cleanup to insert sample data
        </p>
      </div>
    </main>
  );
}
