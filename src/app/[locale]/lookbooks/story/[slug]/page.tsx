import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LookbookStoryGallery } from '@/components/lookbook/LookbookStoryGallery';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

// 동적 SEO 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!lookbook) {
    return { title: 'Not Found · CHEZSUA' };
  }

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : lookbook.article_en;

  // SEO 필드 우선, 없으면 기본값
  const seoTitle = lookbook.seo_title || `${title?.replace(/\*([^*]+)\*/g, '$1')} — CHEZSUA`;
  const seoDescription = lookbook.seo_description || article?.substring(0, 160) || 'CHEZSUA Editorial Floristry';
  const seoKeywords = lookbook.seo_keywords || `${lookbook.client}, ${lookbook.category}, 서울 플로리스트, CHEZSUA, 챠즈수아`;
  const ogImage = lookbook.cover_image || (lookbook.images && lookbook.images[0]) || '/og-default.jpg';

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: lookbook.publish_date,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://chezsua.com/${locale}/lookbooks/story/${slug}`,
      languages: {
        'en': `https://chezsua.com/en/lookbooks/story/${slug}`,
        'ko': `https://chezsua.com/ko/lookbooks/story/${slug}`,
      },
    },
  };
}

function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  if (locale === 'ko') return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function magazineCategory(category: string, locale: Locale): string {
  const map: Record<string, { en: string; ko: string }> = {
    fashion: { en: 'Fashion', ko: '패션' },
    brands: { en: 'Brands', ko: '브랜드' },
    hotels: { en: 'Hotels', ko: '호텔' },
    company: { en: 'Company', ko: '기업' },
    'fine-dining': { en: 'Fine Dining', ko: '파인 다이닝' },
    fineDining: { en: 'Fine Dining', ko: '파인 다이닝' },
    wedding: { en: 'Wedding', ko: '웨딩' },
    vip: { en: 'VIP', ko: 'VIP' },
    etc: { en: 'Etc', ko: '기타' },
  };
  return map[category]?.[locale === 'ko' ? 'ko' : 'en'] || category;
}

function renderEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export default async function LookbookStoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  // 룩북 조회
  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!lookbook) notFound();

  // 관련 룩북 3개 (같은 카테고리)
  const { data: related } = await supabase
    .from('lookbooks')
    .select('id, slug, title_en, title_ko, client, cover_image, images, publish_date')
    .eq('status', 'published')
    .eq('category', lookbook.category)
    .neq('id', lookbook.id)
    .order('publish_date', { ascending: false })
    .limit(3);

  const title = locale === 'ko' ? lookbook.title_ko : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : lookbook.article_en;
  const issueNo = String(42 - 0).padStart(3, '0'); // 추후 자동 계산

  // 이미지 배열 만들기 (cover_image + images 통합)
  const allImages: string[] = [];
  if (lookbook.cover_image) allImages.push(lookbook.cover_image);
  if (lookbook.images && Array.isArray(lookbook.images)) {
    lookbook.images.forEach((img: string) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  const labels = {
    date: locale === 'ko' ? '일자' : 'Date',
    client: locale === 'ko' ? '클라이언트' : 'Client',
    category: locale === 'ko' ? '카테고리' : 'Category',
    mainFlorist: locale === 'ko' ? '메인 플로리스트' : 'Main Florist',
    subFlorist: locale === 'ko' ? '서브 플로리스트' : 'Sub Florist',
    relatedStories: locale === 'ko' ? '관련 스토리' : 'Related Stories',
    backToLookbooks: locale === 'ko' ? '← 룩북 목록' : '← Back to Lookbooks',
  };

  // 구조화 데이터 (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title?.replace(/\*([^*]+)\*/g, '$1'),
    image: allImages,
    datePublished: lookbook.publish_date,
    author: {
      '@type': 'Organization',
      name: 'CHEZSUA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CHEZSUA',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chezsua.com/logo.png',
      },
    },
    description: article?.substring(0, 200),
  };

  return (
    <>
      {/* SEO: 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 갤러리 (전체 덮은 사진 + 썸네일 갤러리) */}
      <LookbookStoryGallery images={allImages} title={title || lookbook.client} />

      {/* 매거진 본문 */}
      <article className="max-w-[800px] mx-auto px-12 max-md:px-7 py-20 max-md:py-14">
        {/* 라벨 */}
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green text-center mb-3">
          CHEZSUA · Article N° {issueNo}
        </div>

        <div className="w-12 h-px bg-ink-primary mx-auto mb-6" />

        {/* 제목 */}
        <h1
          className="text-serif text-5xl font-light leading-[1.1] tracking-[-0.015em] text-ink-primary text-center mb-10 max-md:text-4xl"
          dangerouslySetInnerHTML={{ __html: renderEmphasis(title || '') }}
        />

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12 pt-8 pb-8 border-y border-line max-md:grid-cols-2">
          <MetaItem label={labels.date} value={formatDate(lookbook.publish_date, locale)} />
          <MetaItem label={labels.category} value={magazineCategory(lookbook.category, locale)} />
          <MetaItem label={labels.client} value={lookbook.client} />
          {lookbook.main_florist && (
            <MetaItem label={labels.mainFlorist} value={lookbook.main_florist} />
          )}
          {lookbook.sub_florist && (
            <MetaItem label={labels.subFlorist} value={lookbook.sub_florist} />
          )}
        </div>

        {/* 본문 */}
        {article && (
          <div className="text-serif text-lg leading-[1.85] text-ink-secondary whitespace-pre-line space-y-6">
            {article.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                dangerouslySetInnerHTML={{ __html: renderEmphasis(paragraph) }}
              />
            ))}
          </div>
        )}

        {/* 뒤로가기 */}
        <div className="text-center mt-16 pt-10 border-t border-line">
          <Link
            href={`/${locale}/lookbooks`}
            className="text-mono text-[11px] tracking-[0.3em] uppercase text-ink-secondary hover:text-ink-primary border-b border-ink-secondary pb-1 transition-colors"
          >
            {labels.backToLookbooks}
          </Link>
        </div>
      </article>

      {/* 관련 룩북 */}
      {related && related.length > 0 && (
        <section className="bg-bg-soft py-20 max-md:py-14">
          <div className="max-w-[1400px] mx-auto px-12 max-md:px-6">
            <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green text-center mb-12">
              {labels.relatedStories}
            </h2>

            <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
              {related.map((item) => {
                const itemTitle = locale === 'ko' ? item.title_ko : item.title_en;
                const itemImage = item.cover_image || (item.images && item.images[0]);
                return (
                  <Link
                    key={item.id}
                    href={`/${locale}/lookbooks/story/${item.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[4/5] bg-ink-primary overflow-hidden mb-4">
                      {itemImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={itemImage}
                          alt={itemTitle || item.client}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-sage to-accent-green" />
                      )}
                    </div>
                    <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1">
                      {item.client}
                    </div>
                    <h3
                      className="text-serif text-xl leading-tight text-ink-primary group-hover:italic transition-all"
                      dangerouslySetInnerHTML={{ __html: renderEmphasis(itemTitle || '') }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-1">
        {label}
      </div>
      <div className="text-mono text-[13px] tracking-[0.05em] text-ink-primary">
        {value}
      </div>
    </div>
  );
}
