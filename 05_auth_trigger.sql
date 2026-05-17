-- ============================================================
-- CHEZSUA · 패치 3 SQL - Auth Trigger
-- 회원가입 시 public.users에 자동으로 row 생성
-- ============================================================

-- 1. users 테이블 RLS 정책
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own row" ON public.users;
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- 자기 자신의 정보만 읽기 가능
CREATE POLICY "Users can read own row"
ON public.users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 자기 자신의 정보만 수정 가능
CREATE POLICY "Users can update own row"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));
-- ↑ role은 변경 못 함 (admin이 일반 user로 바꾸거나 그 반대 불가)

-- 관리자는 모든 유저 정보 조회
CREATE POLICY "Admins can read all users"
ON public.users FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 관리자는 모든 유저 수정 가능
CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 2. 회원가입 자동 트리거
-- auth.users에 새 유저가 만들어지면 public.users에도 자동으로 row 생성
-- ============================================================

-- 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거 제거 후 재생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. 이미 가입된 유저 중 public.users에 없는 사람 자동 추가
-- (혹시 모를 누락 방지)
-- ============================================================
INSERT INTO public.users (id, email, name, role, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  'user',
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 완료!
