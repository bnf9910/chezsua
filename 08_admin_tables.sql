-- ============================================================
-- CHEZSUA · 패치 8 SQL
-- Orders, Reviews, Popups, Site Menus 등 모든 테이블
-- ============================================================

-- 1. orders 테이블
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT,
  shipping_address_detail TEXT,
  shipping_date DATE,
  shipping_time TEXT,
  delivery_message TEXT,
  card_message TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending',
  portone_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all orders" ON public.orders FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id, created_at DESC);

-- 2. reviews 테이블
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  title TEXT,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;

CREATE POLICY "Anyone can read approved reviews" ON public.reviews FOR SELECT TO public USING (is_approved = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved, created_at DESC);

-- 3. popups 테이블 (이벤트 팝업)
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

ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read active popups" ON public.popups;
DROP POLICY IF EXISTS "Admins can manage popups" ON public.popups;

CREATE POLICY "Anyone can read active popups" ON public.popups FOR SELECT TO public USING (is_active = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage popups" ON public.popups FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 4. site_menus 테이블 (사이트 메뉴 관리)
CREATE TABLE IF NOT EXISTS public.site_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL, -- 'header', 'footer', 'shop'
  label_en TEXT NOT NULL,
  label_ko TEXT,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES public.site_menus(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_menus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read active menus" ON public.site_menus;
DROP POLICY IF EXISTS "Admins can manage menus" ON public.site_menus;

CREATE POLICY "Anyone can read active menus" ON public.site_menus FOR SELECT TO public USING (is_active = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage menus" ON public.site_menus FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. page_views 테이블 (Analytics)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can read page views" ON public.page_views;

CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at DESC);

-- 완료!
