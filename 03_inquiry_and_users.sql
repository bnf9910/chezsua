-- ============================================================
-- CHEZSUA · PHASE 1B SQL
-- 문의 테이블 + 사용자 프로필 필드
-- ============================================================

-- 1. project_inquiries 테이블 (Send Inquiry 저장용)
CREATE TABLE IF NOT EXISTS public.project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',  -- new, replied, archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

-- RLS 정책
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.project_inquiries;

-- 누구나 문의 작성 가능
CREATE POLICY "Anyone can insert inquiries"
ON public.project_inquiries FOR INSERT
TO public
WITH CHECK (true);

-- 관리자만 조회 가능
CREATE POLICY "Admins can read inquiries"
ON public.project_inquiries FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 관리자만 수정 가능
CREATE POLICY "Admins can update inquiries"
ON public.project_inquiries FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 관리자만 삭제 가능
CREATE POLICY "Admins can delete inquiries"
ON public.project_inquiries FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.project_inquiries(status, created_at DESC);

-- ============================================================
-- 2. users 테이블 - 누락된 필드 추가
-- ============================================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS marketing_agreed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- 완료!
-- ============================================================
