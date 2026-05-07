import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MagazineArticle } from '@/components/home/MagazineArticle';
import { VideoArticle } from '@/components/home/VideoArticle';
import type { Locale } from '@/lib/i18n';
import type { Lookbook } from '@/lib/types';

// ============ 시안 v6 샘플 룩북 5개 ============
// DB에 룩북이 0개일 때 fallback. 관리자가 룩북 추가하면 자동으로 사라짐.
const FALLBACK_LOOKBOOKS: Lookbook[] = [
  {
    id: 'fallback-1',
    slug: 'sample-1',
    title_en: 'A study in *quiet* opulence',
    title_ko: '*조용한* 풍요로움에 대한 연구',
    title_zh: '*静谧*奢华的研究',
    article_en: 'For the autumn unveiling at Lotte Jamsil, we draped the boutique in muted blooms — antique garden roses, smoked eucalyptus, dried hydrangea — composing a still life that whispered rather than declared.',
    article_ko: '잠실 롯데백화점 가을 신상 발표를 위해, 우리는 부티크를 차분한 꽃들로 채웠습니다 — 앤틱 가든 로즈, 스모크 유칼립투스, 드라이 하이드랜지아.',
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
  {
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
  {
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
  {
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
  {
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
];

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // DB에서 published 룩북 가져오기 (최신순, 최대 5개)
  let lookbooks: Lookbook[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('lookbooks')
      .select('*')
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .limit(5);
    lookbooks = (data as Lookbook[]) || [];
  } catch {
    lookbooks = [];
  }

  // DB가 비어있으면 시안 fallback 사용
  const displayLookbooks = lookbooks.length > 0 ? lookbooks : FALLBACK_LOOKBOOKS;

  return (
    <div>
      {displayLookbooks.map((lookbook, idx) => {
        // is_video true이거나 fallback의 3번째(index=2)는 영상 article로
        const isVideo = lookbook.is_video || (lookbooks.length === 0 && idx === 2);

        if (isVideo) {
          return (
            <VideoArticle
              key={lookbook.id}
              lookbook={lookbook}
              locale={locale as Locale}
              index={idx}
            />
          );
        }

        return (
          <MagazineArticle
            key={lookbook.id}
            lookbook={lookbook}
            locale={locale as Locale}
            index={idx}
            isFirst={idx === 0}
          />
        );
      })}
    </div>
  );
}
