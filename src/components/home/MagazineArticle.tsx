import { Link } from '@/lib/i18n';
import { FlowerIllustration } from './FlowerIllustration';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

interface MagazineArticleProps {
  lookbook: Lookbook;
  locale: Locale;
  index: number;
  isFirst?: boolean;
}

// 날짜 포맷: "Sep 03, 2026"
function formatArticleDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  if (locale === 'ko') {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  if (locale === 'zh') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  // English: "Sep 03, 2026"
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

// 카테고리 → MAGAZINE 표시명
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

// 제목에서 *quiet* 같은 마크다운을 <em> 태그로 변환
function renderTitleWithEmphasis(title: string): string {
  return title.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function MagazineArticle({ lookbook, locale, index, isFirst = false }: MagazineArticleProps) {
  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : locale === 'zh' ? lookbook.article_zh : lookbook.article_en;

  // 짝수 index는 zigzag (이미지 우측, 텍스트 좌측)
  const isEven = index % 2 === 1; // index 0=홀수배치, index 1=짝수배치
  const issueNo = String(42 - index).padStart(3, '0'); // 042, 041, 040...

  // 다국어 라벨
  const labels = {
    en: { date: 'Date', magazine: 'Magazine', client: 'Client', mainFlorist: 'Main Florist', subFlorist: 'Sub Florist', article: 'Article', viewDetails: 'View Details' },
    ko: { date: '일자', magazine: '매거진', client: '클라이언트', mainFlorist: '메인 플로리스트', subFlorist: '서브 플로리스트', article: '아티클', viewDetails: '자세히 보기' },
    zh: { date: '日期', magazine: '杂志', client: '客户', mainFlorist: '主花艺师', subFlorist: '副花艺师', article: '文章', viewDetails: '查看详情' },
  }[locale];

  // 본문 짧게 (첫 줄)
  const excerpt = article ? article.split('\n')[0] : '';

  return (
    <article
      className={`grid min-h-screen items-stretch ${
        isEven ? 'grid-cols-[30fr_70fr]' : 'grid-cols-[70fr_30fr]'
      } max-lg:grid-cols-1 max-lg:min-h-0`}
    >
      {/* IMAGE WRAP - 짝수일 땐 order 2로 우측 이동 */}
      <Link
        href={`/lookbooks/story/${lookbook.slug}`}
        className={`relative overflow-hidden block group bg-bg-secondary min-h-screen max-lg:min-h-[60vh] ${
          isEven ? 'lg:order-2' : ''
        }`}
      >
        <FlowerIllustration index={index} />

        {/* hover overlay */}
        <div className="absolute inset-0 bg-ink-primary/0 group-hover:bg-ink-primary/10 transition-colors duration-700 z-[1]" />

        {/* N° 번호 */}
        <span className="absolute top-8 left-8 text-mono text-[10px] tracking-[0.3em] uppercase text-white/95 z-[2]">
          — N° {issueNo}
        </span>
      </Link>

      {/* CONTENT */}
      <div
        className={`flex flex-col justify-center bg-bg-primary px-14 py-20 max-md:px-7 max-md:py-12 ${
          isEven ? 'lg:order-1' : ''
        } ${isFirst ? 'lg:pt-[130px]' : ''}`}
      >
        {/* Meta Box */}
        <div className="text-mono text-[10px] tracking-[0.08em] text-ink-secondary leading-loose mb-7 pb-5 border-b border-line">
          <MetaRow label={labels.date} value={formatArticleDate(lookbook.publish_date, locale)} />
          <MetaRow label={labels.magazine} value={magazineCategory(lookbook.category, locale)} />
          <MetaRow label={labels.client} value={lookbook.client} />
          <MetaRow label={labels.mainFlorist} value={lookbook.main_florist || 'YOON'} />
          <MetaRow label={labels.subFlorist} value={lookbook.sub_florist || 'CHOI'} />
        </div>

        {/* Article Label */}
        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-4">
          {labels.article} — N° {issueNo}
        </div>

        {/* Title with italic emphasis */}
        <h2
          className="text-serif font-normal leading-[1.05] tracking-[-0.015em] text-ink-primary mb-6"
          style={{ fontSize: 'clamp(36px, 3.2vw, 56px)' }}
          dangerouslySetInnerHTML={{ __html: renderTitleWithEmphasis(title || '') }}
        />

        {/* Excerpt */}
        {excerpt && (
          <p className="text-serif text-[17px] font-normal leading-[1.55] text-ink-secondary mb-8">
            {excerpt}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/lookbooks/story/${lookbook.slug}`}
          className="inline-flex items-center gap-3 text-mono text-[11px] tracking-[0.3em] uppercase text-ink-primary border-b border-ink-primary pb-1.5 self-start hover:gap-5 transition-all"
        >
          <span>{labels.viewDetails}</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2 uppercase">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink-primary normal-case">{value}</span>
    </div>
  );
}

// .article-title em 스타일 적용을 위한 글로벌 스타일은 globals.css에 추가:
// .article-title em, [data-article-title] em {
//   font-style: italic;
//   font-weight: 300;
// }
