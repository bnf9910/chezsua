import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return null;
  return supabase;
}

// 시안 v6의 5개 샘플 룩북
const SAMPLE_LOOKBOOKS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

// 샘플 상품 5개 (홈 외 페이지에서 fallback이 있을 수 있음)
const SAMPLE_PRODUCTS = [
  {
    slug: 'sample-product-1',
    name_en: 'Etude in Rose',
    name_ko: '에튀드 인 로즈',
    name_zh: '玫瑰练习曲',
    description_en: 'A composition of antique garden roses and trailing eucalyptus.',
    description_ko: '앤틱 가든 로즈와 흐르는 유칼립투스로 만든 작품.',
    description_zh: '由古董花园玫瑰与垂落桉树组成的作品。',
    images: [],
    category: 'flower-bouquet',
    price_krw: 180000,
    status: 'active',
    sort_order: 1,
    in_stock: true,
  },
  {
    slug: 'sample-product-2',
    name_en: 'Sage Whisper',
    name_ko: '세이지 위스퍼',
    name_zh: '鼠尾草低语',
    description_en: 'Soft sage greens and white peonies, a quiet conversation.',
    description_ko: '부드러운 세이지 그린과 백작약, 조용한 대화.',
    description_zh: '柔和的鼠尾草绿与白芍药，一场静谧的对话。',
    images: [],
    category: 'flower-basket',
    price_krw: 220000,
    status: 'active',
    sort_order: 2,
    in_stock: true,
  },
  {
    slug: 'sample-product-3',
    name_en: 'Maison Pink',
    name_ko: '메종 핑크',
    name_zh: '梅森粉',
    description_en: 'Pink ranunculus and dried hydrangea in muted tones.',
    description_ko: '차분한 톤의 핑크 라넌큘러스와 드라이 하이드랜지아.',
    description_zh: '柔和色调的粉色毛茛与干绣球。',
    images: [],
    category: 'centerpiece',
    price_krw: 150000,
    status: 'active',
    sort_order: 3,
    in_stock: true,
  },
];

export async function POST() {
  const supabase = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 이미 sample-* 슬러그가 있으면 스킵 (중복 방지)
    const { data: existingLb } = await supabase
      .from('lookbooks')
      .select('slug')
      .like('slug', 'sample-%');
    const existingLbSlugs = new Set((existingLb || []).map((l) => l.slug));

    const { data: existingPr } = await supabase
      .from('products')
      .select('slug')
      .like('slug', 'sample-product-%');
    const existingPrSlugs = new Set((existingPr || []).map((p) => p.slug));

    // 신규 데이터만 필터링
    const newLookbooks = SAMPLE_LOOKBOOKS.filter((l) => !existingLbSlugs.has(l.slug));
    const newProducts = SAMPLE_PRODUCTS.filter((p) => !existingPrSlugs.has(p.slug));

    let lookbookResult = { count: 0, error: null as string | null };
    let productResult = { count: 0, error: null as string | null };

    // 룩북 삽입
    if (newLookbooks.length > 0) {
      const { error } = await supabase.from('lookbooks').insert(newLookbooks);
      if (error) {
        lookbookResult.error = error.message;
      } else {
        lookbookResult.count = newLookbooks.length;
      }
    }

    // 상품 삽입
    if (newProducts.length > 0) {
      const { error } = await supabase.from('products').insert(newProducts);
      if (error) {
        productResult.error = error.message;
      } else {
        productResult.count = newProducts.length;
      }
    }

    return NextResponse.json({
      ok: true,
      lookbooks: lookbookResult,
      products: productResult,
      skipped: {
        lookbooks: existingLbSlugs.size,
        products: existingPrSlugs.size,
      },
    });
  } catch (err) {
    console.error('[seed-samples] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
