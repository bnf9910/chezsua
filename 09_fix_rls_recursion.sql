-- ============================================================
-- CHEZSUA · 패치 14 SQL
-- users 테이블 RLS 무한 재귀 (infinite recursion) 해결
-- ============================================================

-- 문제: "Admins can read all users" 정책이 users 테이블을 다시 조회
-- → 무한 재귀 발생 → 500 에러

-- 해결: 모든 기존 정책 제거 후, 재귀 없는 정책으로 재설정

-- 1. users 테이블의 모든 정책 제거
DROP POLICY IF EXISTS "Users can read own row" ON public.users;
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for own user" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;

-- 2. 단순한 정책만 사용 (재귀 없음)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 본인 row만 조회 가능
CREATE POLICY "Users read own profile"
ON public.users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 본인 row만 수정 가능
CREATE POLICY "Users update own profile"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================
-- 다른 테이블들도 users 테이블 EXISTS 조회를 단순화
-- (admin 체크는 서버에서 SERVICE_ROLE로 함)
-- ============================================================

-- products: 단순화
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

CREATE POLICY "Public can read active products"
ON public.products FOR SELECT
TO public
USING (status = 'active');

-- (admin 작업은 서버에서 SERVICE_ROLE로 처리되므로 RLS 정책 불필요)

-- lookbooks
DROP POLICY IF EXISTS "Anyone can read published lookbooks" ON public.lookbooks;
DROP POLICY IF EXISTS "Admins can manage lookbooks" ON public.lookbooks;

CREATE POLICY "Public can read published lookbooks"
ON public.lookbooks FOR SELECT
TO public
USING (status = 'published');

-- florists
DROP POLICY IF EXISTS "Anyone can read active florists" ON public.florists;
DROP POLICY IF EXISTS "Admins can manage florists" ON public.florists;

CREATE POLICY "Public can read active florists"
ON public.florists FOR SELECT
TO public
USING (is_active = TRUE);

-- popups
DROP POLICY IF EXISTS "Anyone can read active popups" ON public.popups;
DROP POLICY IF EXISTS "Admins can manage popups" ON public.popups;

CREATE POLICY "Public can read active popups"
ON public.popups FOR SELECT
TO public
USING (is_active = TRUE);

-- site_menus
DROP POLICY IF EXISTS "Anyone can read active menus" ON public.site_menus;
DROP POLICY IF EXISTS "Admins can manage menus" ON public.site_menus;

CREATE POLICY "Public can read active menus"
ON public.site_menus FOR SELECT
TO public
USING (is_active = TRUE);

-- reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;

CREATE POLICY "Public can read approved reviews"
ON public.reviews FOR SELECT
TO public
USING (is_approved = TRUE);

CREATE POLICY "Users can insert own reviews"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- orders
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Users read own orders"
ON public.orders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
TO public
WITH CHECK (true);

-- project_inquiries
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.project_inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.project_inquiries;

CREATE POLICY "Anyone can insert inquiries"
ON public.project_inquiries FOR INSERT
TO public
WITH CHECK (true);

-- settings (모두 읽기 가능)
DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

CREATE POLICY "Public can read settings"
ON public.settings FOR SELECT
TO public
USING (true);

-- page_views
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;

CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
TO public
WITH CHECK (true);

-- ============================================================
-- ✅ 완료!
-- admin 작업은 모두 서버에서 SERVICE_ROLE 키로 처리하므로
-- 정책에서 admin 체크를 제거해도 보안에 문제 없음
-- ============================================================

-- 확인 쿼리
SELECT polname, polrelid::regclass AS table_name, polcmd
FROM pg_policy
WHERE polrelid::regclass::text LIKE 'public.%'
ORDER BY table_name, polname;
