import { Link } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

interface VideoArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  index: number;
}

function formatArticleDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  if (locale === 'ko') return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  if (locale === 'zh') return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function magazineCategory(category: string, locale: Locale): string {
  const map: Record<string, { en: string; ko: string; zh: string }> = {
    fashion: { en: 'Fashion', ko: '패션', zh: '时尚' },
    brands: { en: 'Brands', ko: '브랜드', zh: '品牌' },
    hotels: { en: 'Hotels', ko: '호텔', zh: '酒店' },
    company: { en: 'Company', ko: '기업', zh: '企业' },
    fineDining: { en: 'Fine Dining', ko: '파인 다이닝', zh: '高级餐饮' },
    'fine-dining': { en: 'Fine Dining', ko: '파인 다이닝', zh: '高级餐饮' },
    wedding: { en: 'Wedding', ko: '웨딩', zh: '婚礼' },
    vip: { en: 'VIP', ko: 'VIP', zh: 'VIP' },
    etc: { en: 'Etc', ko: '기타', zh: '其他' },
  };
  return map[category]?.[locale] || category;
}

function renderTitleWithEmphasis(title: string): string {
  return title.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function VideoArticle({ lookbook, locale, index }: VideoArticleProps) {
  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : locale === 'zh' ? lookbook.article_zh : lookbook.article_en;
  const issueNo = String(42 - index).padStart(3, '0');
  const excerpt = article ? article.split('\n')[0] : '';

  const labels = {
    en: { date: 'Date', magazine: 'Magazine', client: 'Client', mainFlorist: 'Main Florist', subFlorist: 'Sub Florist', film: 'Film', watchFilm: 'Watch Film' },
    ko: { date: '일자', magazine: '매거진', client: '클라이언트', mainFlorist: '메인 플로리스트', subFlorist: '서브 플로리스트', film: '영상', watchFilm: '영상 보기' },
    zh: { date: '日期', magazine: '杂志', client: '客户', mainFlorist: '主花艺师', subFlorist: '副花艺师', film: '影片', watchFilm: '观看影片' },
  }[locale];

  return (
    // 매거진 article과 비슷한 크기감을 위해 min-height: 100vh
    <article className="grid bg-bg-soft min-h-screen items-center py-16 max-md:py-10">
      {/* 좌측 메타 (180px) | 영상 (1fr) | 우측 텍스트 (220px) - 영상이 훨씬 커짐 */}
      <div className="w-full px-12 max-md:px-7 grid grid-cols-[180px_1fr_220px] gap-10 items-center max-lg:grid-cols-1 max-lg:gap-8">
        {/* 좌측 메타 */}
        <div className="text-mono text-[10px] tracking-[0.12em] text-ink-secondary leading-[2.1] uppercase max-lg:text-center">
          <span className="text-ink-muted block">{labels.date}</span>
          <div>{formatArticleDate(lookbook.publish_date, locale)}</div>

          <span className="text-ink-muted block mt-3">{labels.magazine}</span>
          <div>{magazineCategory(lookbook.category, locale)}</div>

          <span className="text-ink-muted block mt-3">{labels.client}</span>
          <div className="normal-case">{lookbook.client}</div>

          <span className="text-ink-muted block mt-3">{labels.mainFlorist}</span>
          <div>{lookbook.main_florist || 'YOON'}</div>

          <span className="text-ink-muted block mt-3">{labels.subFlorist}</span>
          <div>{lookbook.sub_florist || 'CHOI'}</div>
        </div>

        {/* 중앙 영상 — aspect ratio 16:9, 큰 사이즈 */}
        <Link
          href={`/lookbooks/story/${lookbook.slug}`}
          className="block aspect-[16/9] bg-ink-primary relative overflow-hidden group w-full max-h-[80vh]"
        >
          {/* 그라디언트 배경 + SVG 일러스트 */}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #B5C2A8 0%, #8FA68C 50%, #4A5F4A 100%)' }}
          >
            <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <g opacity="0.85">
                <ellipse cx="800" cy="450" rx="450" ry="220" fill="#fff" opacity="0.2" />
                <circle cx="700" cy="420" r="80" fill="#E8DFC8" opacity="0.7" />
                <circle cx="900" cy="440" r="90" fill="#F1F0EA" opacity="0.7" />
                <circle cx="780" cy="500" r="70" fill="#E5C5BB" opacity="0.7" />
                <ellipse cx="800" cy="460" rx="240" ry="120" fill="#8FA68C" opacity="0.3" />
              </g>
            </svg>
          </div>

          {/* 영상 N° 라벨 (좌측 상단) */}
          <span className="absolute top-7 left-7 text-mono text-[10px] tracking-[0.3em] uppercase text-white/95 z-[2]">
            — N° {issueNo}
          </span>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center z-[2]">
            <div
              className="w-24 h-24 border border-white/70 rounded-full flex items-center justify-center transition-all group-hover:bg-white/90 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            >
              <span
                className="block ml-1.5"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '16px solid #fff',
                  borderTop: '11px solid transparent',
                  borderBottom: '11px solid transparent',
                }}
              />
            </div>
          </div>
        </Link>

        {/* 우측 텍스트 */}
        <div className="max-lg:text-center">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3">
            ▶ {labels.film}
          </div>
          <h3
            className="text-serif text-[36px] font-normal leading-[1.05] tracking-[-0.015em] text-ink-primary mb-4 max-lg:text-[32px]"
            dangerouslySetInnerHTML={{ __html: renderTitleWithEmphasis(title || '') }}
          />
          {excerpt && (
            <p className="text-serif text-[15px] leading-[1.6] text-ink-secondary mb-6 line-clamp-4">
              {excerpt}
            </p>
          )}
          <Link
            href={`/lookbooks/story/${lookbook.slug}`}
            className="inline-flex items-center gap-3 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1.5 hover:gap-5 transition-all"
          >
            <span>{labels.watchFilm}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
