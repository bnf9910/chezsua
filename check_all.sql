-- ============================================================
-- CHEZSUA · 전체 점검 SQL
-- ============================================================

-- ┌──────────────────────────────────────────────────────────┐
-- │ 1. INQUIRIES 점검                                         │
-- └──────────────────────────────────────────────────────────┘

-- 1-1. project_inquiries 테이블이 있는지 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'project_inquiries'
) AS inquiries_table_exists;

-- 1-2. 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 누락 컬럼 추가
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.project_inquiries ADD COLUMN IF NOT EXISTS budget TEXT;

-- RLS 정책
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.project_inquiries;

-- 누구나 문의 제출 가능
CREATE POLICY "Anyone can insert inquiries"
ON public.project_inquiries FOR INSERT
TO public
WITH CHECK (true);

-- 1-3. 현재 등록된 inquiries 개수 확인
SELECT COUNT(*) AS total_inquiries FROM public.project_inquiries;

-- 1-4. 최근 5개 확인
SELECT id, name, email, type, status, created_at 
FROM public.project_inquiries 
ORDER BY created_at DESC 
LIMIT 5;


-- ┌──────────────────────────────────────────────────────────┐
-- │ 2. POPUPS 점검                                            │
-- └──────────────────────────────────────────────────────────┘

-- 2-1. popups 테이블 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'popups'
) AS popups_table_exists;

-- 2-2. popups 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT,
  title_ko TEXT,
  content_en TEXT,
  content_ko TEXT,
  image TEXT,
  link_url TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  position TEXT DEFAULT 'center',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.popups ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.popups ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- RLS
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active popups" ON public.popups;
DROP POLICY IF EXISTS "Anyone can read active popups" ON public.popups;
DROP POLICY IF EXISTS "Admins can manage popups" ON public.popups;

-- 모든 사용자가 활성 팝업 읽기 가능
CREATE POLICY "Public can read active popups"
ON public.popups FOR SELECT
TO public
USING (is_active = TRUE);


-- ┌──────────────────────────────────────────────────────────┐
-- │ 3. SETTINGS 점검                                          │
-- └──────────────────────────────────────────────────────────┘

-- 3-1. settings 테이블 확인 및 정책
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;

CREATE POLICY "Public can read settings"
ON public.settings FOR SELECT
TO public
USING (true);

-- 3-2. 기본 settings 추가 (없으면)
INSERT INTO public.settings (key, value) VALUES
  ('site', '{"name": "CHEZSUA", "tagline": "Editorial Floristry · Seoul", "description": ""}'::jsonb),
  ('contact', '{"phone": "", "email": "chezsuaflower@gmail.com", "address": "Seoul · Gangnam", "hours": "Mon — Sat · 11:00 AM — 7:00 PM"}'::jsonb),
  ('social', '{"instagram": "", "naver_blog": "", "youtube": ""}'::jsonb),
  ('seo', '{"default_title": "CHEZSUA", "default_description": "", "og_image": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ┌──────────────────────────────────────────────────────────┐
-- │ 4. ADMIN 권한 확인                                        │
-- └──────────────────────────────────────────────────────────┘

SELECT id, email, role 
FROM public.users 
WHERE email = 'chezsuaflower@gmail.com';

-- role이 admin이 아니면:
-- UPDATE public.users SET role = 'admin' WHERE email = 'chezsuaflower@gmail.com';


-- ============================================================
-- ✅ 완료
-- ============================================================
