-- ============================================================
-- CHEZSUA · PHASE 1A SQL
-- Settings 테이블 + 룩북 정렬 + SEO 필드
-- ============================================================

-- 1. settings 테이블 (사이트 전반 설정)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 기본 설정 데이터
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"name": "CHEZSUA", "tagline": "Editorial Floristry · Seoul", "description": "Seoul-based florist for fashion, hotels, fine dining, and wedding"}'::jsonb),
  ('contact', '{"phone": "+82 02-XXXX-XXXX", "email": "chezsuaflower@gmail.com", "address": "Seoul · Gangnam", "hours": "Tue — Sat · 10:00 AM — 7:00 PM"}'::jsonb),
  ('social', '{"instagram": "https://instagram.com/chezsua", "naver_blog": "https://blog.naver.com/chezsua_", "youtube": ""}'::jsonb),
  ('seo', '{"default_title": "CHEZSUA — Editorial Floristry, Seoul", "default_description": "Seoul-based luxury florist specializing in editorial floral design for fashion brands, hotels, fine dining, and private celebrations.", "default_keywords": "서울 플로리스트, 강남 플로리스트, 럭셔리 플로리스트, 패션 플로리스트, 호텔 플로리스트, 웨딩 플로리스트, 챠즈수아, chezsua, editorial floristry seoul"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS 정책
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON public.settings;

CREATE POLICY "Anyone can read settings"
ON public.settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert settings"
ON public.settings FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 2. 룩북 테이블에 featured_order + SEO 필드 추가
-- ============================================================

ALTER TABLE public.lookbooks
  ADD COLUMN IF NOT EXISTS featured_order INTEGER,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_lookbooks_featured 
  ON public.lookbooks(is_featured, featured_order) 
  WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_lookbooks_publish_date 
  ON public.lookbooks(publish_date DESC) 
  WHERE status = 'published';
