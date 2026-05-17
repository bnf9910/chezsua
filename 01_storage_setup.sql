-- ============================================================
-- CHEZSUA · 사진 업로드 인프라 SQL
-- ============================================================
-- 실행 순서:
-- 1. Supabase Dashboard → Storage에서 'chezsua-images' 버킷 만들기 (Public 체크)
-- 2. 이 SQL 실행
-- ============================================================

-- 1. lookbooks 테이블에 images 배열 컬럼 추가 (여러 사진 저장용)
ALTER TABLE public.lookbooks
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. products 테이블에 images 배열 컬럼 추가
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- ============================================================
-- Storage 정책: chezsua-images 버킷에 대한 접근 권한
-- (버킷이 Public이면 SELECT는 자동, 나머지는 정책 설정)
-- ============================================================

-- 모두 읽기 가능 (Public 버킷이면 자동이지만 명시)
CREATE POLICY IF NOT EXISTS "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chezsua-images');

-- 인증된 관리자만 업로드 가능
CREATE POLICY IF NOT EXISTS "Admins can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chezsua-images'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 관리자만 삭제 가능
CREATE POLICY IF NOT EXISTS "Admins can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chezsua-images'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 관리자만 업데이트 가능
CREATE POLICY IF NOT EXISTS "Admins can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chezsua-images'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
