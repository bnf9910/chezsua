-- ============================================================
-- CHEZSUA · 패치 7 SQL
-- florists 테이블 + about 페이지 브랜드 섹션
-- ============================================================

-- 1. florists 테이블 (플로리스트 정보)
CREATE TABLE IF NOT EXISTS public.florists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ko TEXT,
  role_en TEXT,
  role_ko TEXT,
  bio_en TEXT,
  bio_ko TEXT,
  photo TEXT,
  instagram TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE public.florists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active florists" ON public.florists;
DROP POLICY IF EXISTS "Admins can manage florists" ON public.florists;

CREATE POLICY "Anyone can read active florists"
ON public.florists FOR SELECT
TO public
USING (is_active = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage florists"
ON public.florists FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_florists_order ON public.florists(display_order, is_active);

-- 2. About 페이지의 브랜드 섹션 데이터 추가 (settings 테이블)
INSERT INTO public.settings (key, value) VALUES
  ('about_brand', '{
    "label_en": "About — The Atelier",
    "label_ko": "ABOUT — 아틀리에",
    "headline_en": "The Language of *Flowers*",
    "headline_ko": "*꽃*의 언어",
    "subtitle_en": "Editorial Floristry · Seoul",
    "subtitle_ko": "에디토리얼 플로리스트 · 서울",
    "intro_en": "CHEZSUA is a Seoul-based florist studio specializing in editorial floral design for fashion brands, hotels, fine dining establishments, and private celebrations. Our work bridges botanical artistry with cultural narrative.",
    "intro_ko": "CHEZSUA는 패션 브랜드, 호텔, 파인 다이닝, 그리고 프라이빗 셀러브레이션을 위한 에디토리얼 플로럴 디자인에 특화된 서울 기반 플로리스트 스튜디오입니다. 우리의 작업은 식물의 예술성과 문화적 내러티브를 연결합니다.",
    "philosophy_en": "We approach each project as editorial — building floral compositions that hold their own visual narrative. Our work emphasizes negative space, seasonal restraint, and a quiet sense of refinement.",
    "philosophy_ko": "모든 프로젝트를 에디토리얼처럼 접근합니다 — 자체적인 시각적 내러티브를 갖춘 플로럴 구성을 만듭니다. 우리의 작업은 여백, 계절적 절제, 그리고 조용한 정제됨을 강조합니다.",
    "studio_text_en": "Our atelier is located in Gangnam, Seoul. By appointment only. We work with seasonal Korean botanicals as well as imported flowers from Holland and Japan.",
    "studio_text_ko": "우리 아틀리에는 서울 강남에 위치합니다. 예약제로 운영됩니다. 한국 계절 식물과 더불어 네덜란드 및 일본에서 수입한 꽃을 사용합니다.",
    "cover_image": ""
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. 샘플 플로리스트 데이터 (선택)
INSERT INTO public.florists (name_en, name_ko, role_en, role_ko, bio_en, bio_ko, display_order, is_active)
VALUES
  ('YOON', '윤', 'Founder · Main Florist', '대표 · 메인 플로리스트', 'Background in fashion editorial and luxury hospitality. Specializes in large-scale installations.', '패션 에디토리얼과 럭셔리 호스피탈리티 분야의 배경을 가지고 있으며, 대형 설치 작업을 전문으로 합니다.', 1, TRUE),
  ('CHOI', '최', 'Sub Florist', '서브 플로리스트', 'Focuses on intimate compositions and bridal work with attention to seasonal Korean botanicals.', '계절 한국 식물을 활용한 친밀한 구성과 웨딩 작업에 집중합니다.', 2, TRUE)
ON CONFLICT DO NOTHING;

-- 완료!
