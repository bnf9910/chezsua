import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

// ============ 시안 v6 샘플 룩북 5개 (홈과 동일) ============
const FALLBACK_LOOKBOOKS: Record<string, Lookbook> = {
  'sample-1': {
    id: 'fallback-1',
    slug: 'sample-1',
    title_en: 'A study in *quiet* opulence',
    title_ko: '*조용한* 풍요로움에 대한 연구',
    title_zh: '*静谧*奢华的研究',
    article_en: 'For the autumn unveiling at Lotte Jamsil, we draped the boutique in muted blooms — antique garden roses, smoked eucalyptus, dried hydrangea — composing a still life that whispered rather than declared.\n\nEach arrangement carried the weight of restraint, the vocabulary of a season folding into itself.',
    article_ko: '잠실 롯데백화점 가을 신상 발표를 위해, 우리는 부티크를 차분한 꽃들로 채웠습니다 — 앤틱 가든 로즈, 스모크 유칼립투스, 드라이 하이드랜지아.\n\n각 작품은 절제의 무게를, 한 계절이 스스로에게로 접히는 어휘를 담았습니다.',
    article_zh: '为乐天蚕室秋季新品发布，我们用静谧的花卉装点精品店 — 古董花园玫瑰、烟熏桉树、干绣球花。',
    cover_image: '',
    images: [],
    category: 'fashion',
    client: 'PRADA — Lotte Jamsil',
    main_florist: 'YOON',
    sub_florist: 'CHOI',
    publish_date: '2026-09-03',
    status: 'published',
    sort_order: 1,
    is_featured: true,
    is_video: false,
    video_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lookbook,
  'sample-2': {
    id: 'fallback-2',
    slug: 'sample-2',
    title_en: 'A lobby, *blooming*',
    title_ko: '*꽃이 피어나는* 로비',
    title_zh: '*绽放的*大堂',
    article_en: "A monumental centerpiece marking the hotel's tenth anniversary — sculpted from cymbidium orchids, white peony, and trailing greenery.",
    article_ko: '호텔 10주년을 기념하는 기념비적 센터피스 — 심비디움 난, 백작약, 그리고 흐르는 그린.',
    article_zh: '为酒店十周年打造的纪念性中心装置 — 由心碧兰、白芍药与垂落的绿植雕琢而成。',
    cover_image: '',
    images: [],
    category: 'hotels',
    client: 'Four Seasons Seoul',
    main_florist: 'SUA',
    sub_florist: 'YOON',
    publish_date: '2026-08-21',
    status: 'published',
    sort_order: 2,
    is_featured: true,
    is_video: false,
    video_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lookbook,
  'sample-3': {
    id: 'fallback-3',
    slug: 'sample-3',
    title_en: 'Vows by the *sea*',
    title_ko: '*바닷가의* 서약',
    title_zh: '*海边*的誓言',
    article_en: 'An intimate ceremony framed by hand-tied bouquets of garden roses, ranunculus, and trailing jasmine — captured against the island wind.',
    article_ko: '가든 로즈, 라넌큘러스, 흐르는 자스민으로 만든 핸드타이드 부케로 둘러싸인 친밀한 예식 — 제주 바람을 배경으로.',
    article_zh: '由花园玫瑰、毛茛与垂落茉莉手扎花束围绕的私密仪式 — 以济州的风为背景。',
    cover_image: '',
    images: [],
    category: 'wedding',
    client: 'Private — Jeju',
    main_florist: 'SUA',
    sub_florist: 'CHOI',
    publish_date: '2026-08-12',
    status: 'published',
    sort_order: 3,
    is_featured: true,
    is_video: true,
    video_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lookbook,
  'sample-4': {
    id: 'fallback-4',
    slug: 'sample-4',
    title_en: 'Tabletop as *theatre*',
    title_ko: '*극장으로서의* 테이블',
    title_zh: '作为*剧场*的餐桌',
    article_en: 'A seasonal collaboration with chef Anh Sung-jae — twelve courses, twelve compositions, each a fleeting still life.',
    article_ko: '안성재 셰프와의 시즌 콜라보 — 12개 코스, 12개 구성, 각각이 순간의 정물화.',
    article_zh: '与安主厨的季节合作 — 十二道菜，十二个构图，每一刻都是静物。',
    cover_image: '',
    images: [],
    category: 'fine-dining',
    client: 'Mosu Seoul',
    main_florist: 'YOON',
    sub_florist: 'SUA',
    publish_date: '2026-07-29',
    status: 'published',
    sort_order: 4,
    is_featured: true,
    is_video: false,
    video_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lookbook,
  'sample-5': {
    id: 'fallback-5',
    slug: 'sample-5',
    title_en: 'A garden of *equestrian* heritage',
    title_ko: '*승마의* 정원',
    title_zh: '*马术*遗产的花园',
    article_en: 'A seasonal window for Maison Dosan — a meditation on equestrian heritage, in saddle-leather browns.',
    article_ko: '메종 도산의 시즌 윈도우 — 승마 헤리티지에 대한 명상, 안장 가죽의 갈색 톤으로.',
    article_zh: '为道山之家打造的季节橱窗 — 关于马术遗产的冥想，以鞍革褐色调展现。',
    cover_image: '',
    images: [],
    category: 'fashion',
    client: 'Hermès — Maison Dosan',
    main_florist: 'CHOI',
    sub_florist: 'YOON',
    publish_date: '2026-07-14',
    status: 'published',
    sort_order: 5,
    is_featured: true,
    is_video: false,
    video_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lookbook,
};

const SAMPLE_GRADIENTS: Record<string, string> = {
  'sample-1': 'linear-gradient(135deg, #E5C5BB 0%, #D9B7A0 50%, #B89882 100%)',
  'sample-2': 'linear-gradient(135deg, #E8DFC8 0%, #C9B98A 50%, #8FA68C 100%)',
  'sample-3': 'linear-gradient(135deg, #B5C2A8 0%, #8FA68C 50%, #4A5F4A 100%)',
  'sample-4': 'linear-gradient(135deg, #E5C5BB 0%, #C9A0A0 50%, #8B5A6B 100%)',
  'sample-5': 'linear-gradient(135deg, #E8DFC8 0%, #B5A88E 50%, #6B5F4D 100%)',
};

function renderTitleWithEmphasis(title: string): string {
  return title.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function formatArticleDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  if (locale === 'ko') return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  if (locale === 'zh') return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LookbookStoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 1. 샘플 룩북 체크 (DB에 룩북 0개일 때 시안 샘플로 표시)
  let lookbook: Lookbook | null = null;

  if (slug.startsWith('sample-')) {
    lookbook = FALLBACK_LOOKBOOKS[slug] || null;
  } else {
    // 2. DB에서 가져오기
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('lookbooks')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      lookbook = (data as Lookbook) || null;
    } catch {
      lookbook = null;
    }
  }

  if (!lookbook) notFound();

  const title = locale === 'ko' ? lookbook.title_ko : locale === 'zh' ? lookbook.title_zh : lookbook.title_en;
  const article = locale === 'ko' ? lookbook.article_ko : locale === 'zh' ? lookbook.article_zh : lookbook.article_en;
  const isSample = slug.startsWith('sample-');
  const gradient = isSample ? SAMPLE_GRADIENTS[slug] : null;

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative aspect-[16/9] max-h-[80vh] overflow-hidden bg-bg-secondary">
        {lookbook.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lookbook.cover_image}
            alt={title || lookbook.client}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={gradient ? { backgroundImage: gradient } : { backgroundColor: '#E6EDE3' }}
          />
        )}
      </section>

      {/* Content */}
      <article className="max-w-[800px] mx-auto px-7 py-20 max-md:py-12">
        <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-5">
          {lookbook.category} · {formatArticleDate(lookbook.publish_date, locale)}
        </div>

        <h1
          className="text-serif font-normal leading-[1.05] tracking-[-0.015em] text-ink-primary mb-8"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
          dangerouslySetInnerHTML={{ __html: renderTitleWithEmphasis(title || '') }}
        />

        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-12 pb-6 border-b border-line space-y-1">
          <div>Client · {lookbook.client}</div>
          {lookbook.main_florist && <div>Main Florist · {lookbook.main_florist}</div>}
          {lookbook.sub_florist && <div>Sub Florist · {lookbook.sub_florist}</div>}
        </div>

        {article && (
          <div className="text-serif text-lg leading-[1.8] text-ink-secondary whitespace-pre-line">
            {article}
          </div>
        )}

        {/* Image gallery */}
        {lookbook.images && lookbook.images.length > 0 && (
          <div className="grid grid-cols-2 gap-5 mt-16 max-md:grid-cols-1">
            {lookbook.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${title} ${i + 1}`}
                className="w-full aspect-[3/4] object-cover bg-bg-secondary"
              />
            ))}
          </div>
        )}

        {/* 샘플 룩북 안내 */}
        {isSample && (
          <div className="mt-16 p-7 bg-bg-soft border border-line border-l-4 border-l-accent-green text-sm text-ink-secondary leading-relaxed">
            <strong className="text-accent-green text-mono text-[10px] tracking-[0.2em] uppercase block mb-2">Sample Article</strong>
            {locale === 'ko'
              ? '이 글은 디자인 샘플입니다. 관리자 페이지에서 실제 룩북을 추가하시면 자동으로 교체됩니다.'
              : locale === 'zh'
                ? '此为设计示例。在管理页面添加实际作品集后将自动替换。'
                : 'This is a design sample. Add real lookbooks via the admin panel and they will replace these automatically.'}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-block text-mono text-[11px] tracking-[0.3em] uppercase text-ink-secondary border-b border-line pb-1.5 hover:text-ink-primary"
          >
            ← {locale === 'ko' ? '홈으로' : locale === 'zh' ? '首页' : 'Back to Home'}
          </Link>
        </div>
      </article>
    </div>
  );
}
