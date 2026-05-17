-- ============================================================
-- CHEZSUA · 패치 10 SQL
-- 관리자 계정 role 확인 및 설정
-- ============================================================

-- 1. 현재 본인 계정 role 확인
-- chezsuaflower@gmail.com이 admin인지 확인
SELECT id, email, name, role, created_at 
FROM public.users 
WHERE email = 'chezsuaflower@gmail.com';

-- 2. admin이 아니면 admin으로 설정
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'chezsuaflower@gmail.com'
AND (role IS NULL OR role != 'admin');

-- 3. 모든 admin 계정 확인
SELECT id, email, name, role 
FROM public.users 
WHERE role = 'admin';

-- 4. 만약 다른 관리자 계정이 필요하면 (선택)
-- UPDATE public.users SET role = 'admin' WHERE email = 'other-admin@email.com';

-- ============================================================
-- 완료! 이 쿼리들의 결과로 admin이 등록되어 있어야 메뉴에 Dashboard 버튼 표시됨
-- ============================================================
