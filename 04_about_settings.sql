-- ============================================================
-- CHEZSUA · 패치 2 SQL - About Settings
-- ============================================================

-- About 페이지 정보를 settings 테이블에 추가
INSERT INTO public.settings (key, value) VALUES
  ('about', '{
    "label_en": "About — The Atelier",
    "label_ko": "ABOUT — 아틀리에",
    "headline_en": "The Language of *Flowers*",
    "headline_ko": "*꽃*의 언어",
    "intro_en": "CHEZSUA is a Seoul-based florist studio specializing in editorial floral design for fashion brands, hotels, fine dining establishments, and private celebrations. Our work bridges botanical artistry with cultural narrative.",
    "intro_ko": "CHEZSUA는 패션 브랜드, 호텔, 파인 다이닝, 그리고 프라이빗 셀러브레이션을 위한 에디토리얼 플로럴 디자인에 특화된 서울 기반 플로리스트 스튜디오입니다. 우리의 작업은 식물의 예술성과 문화적 내러티브를 연결합니다.",
    "florists_title_en": "Three Hands, One Studio",
    "florists_title_ko": "세 명의 손, 하나의 스튜디오",
    "florists_text_en": "Founded by three Seoul florists with backgrounds in fashion editorial and hospitality. Each piece reflects our shared commitment to seasonal botanicals and considered composition.",
    "florists_text_ko": "패션 에디토리얼과 호스피탈리티 분야의 배경을 가진 세 명의 서울 플로리스트가 설립했습니다. 모든 작품은 계절 식물에 대한 우리의 공통된 헌신과 신중한 구성을 반영합니다.",
    "philosophy_title_en": "Our Approach",
    "philosophy_title_ko": "우리의 접근법",
    "philosophy_text_en": "We approach each project as editorial — building floral compositions that hold their own visual narrative. Our work emphasizes negative space, seasonal restraint, and a quiet sense of refinement.",
    "philosophy_text_ko": "모든 프로젝트를 에디토리얼처럼 접근합니다 — 자체적인 시각적 내러티브를 갖춘 플로럴 구성을 만듭니다. 우리의 작업은 여백, 계절적 절제, 그리고 조용한 정제됨을 강조합니다.",
    "studio_title_en": "The Workshop",
    "studio_title_ko": "워크샵",
    "studio_text_en": "Our atelier is located in Gangnam, Seoul. By appointment only. We work with seasonal Korean botanicals as well as imported flowers from Holland and Japan.",
    "studio_text_ko": "우리 아틀리에는 서울 강남에 위치합니다. 예약제로 운영됩니다. 한국 계절 식물과 더불어 네덜란드 및 일본에서 수입한 꽃을 사용합니다."
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 완료!
