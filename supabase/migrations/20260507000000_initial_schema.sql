-- =========================================================
-- CHEZSUA · Initial Schema
-- Supabase / PostgreSQL
-- =========================================================

-- 1. Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  provider TEXT DEFAULT 'email',
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Trigger: auth.users 생성 시 public.users에도 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Lookbooks
CREATE TABLE IF NOT EXISTS public.lookbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  title_ko TEXT,
  title_en TEXT NOT NULL,
  title_zh TEXT,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  magazine TEXT,
  client TEXT,
  main_florist TEXT,
  sub_florist TEXT,
  cover_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  article_ko TEXT,
  article_en TEXT,
  article_zh TEXT,
  excerpt_ko TEXT,
  excerpt_en TEXT,
  excerpt_zh TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lookbooks_status ON public.lookbooks(status);
CREATE INDEX IF NOT EXISTS idx_lookbooks_category ON public.lookbooks(category);
CREATE INDEX IF NOT EXISTS idx_lookbooks_publish_date ON public.lookbooks(publish_date DESC);

-- 3. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  name_ko TEXT,
  name_en TEXT NOT NULL,
  name_zh TEXT,
  description_ko TEXT,
  description_en TEXT,
  description_zh TEXT,
  care_ko TEXT,
  care_en TEXT,
  care_zh TEXT,
  price_krw INTEGER NOT NULL,
  price_usd NUMERIC(10, 2),
  images JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  pickup_available BOOLEAN DEFAULT TRUE,
  delivery_available BOOLEAN DEFAULT TRUE,
  stock INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  is_new BOOLEAN DEFAULT FALSE,
  is_best BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_first_name TEXT NOT NULL,
  recipient_last_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  occasion TEXT,
  card_message TEXT,
  order_notes TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KRW',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. Project Inquiries
CREATE TABLE IF NOT EXISTS public.project_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  project_type TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.project_inquiries(status);

-- 6. Popups
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  position TEXT DEFAULT 'center',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_popups_active ON public.popups(active, start_date, end_date);

-- 7. Page Views (자체 분석)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  ref_source TEXT,
  country TEXT,
  device TEXT,
  screen TEXT,
  locale TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_ref_source ON public.page_views(ref_source);

-- 8. Menu Items (Admin이 관리하는 사이트 메뉴)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  label_en TEXT NOT NULL,
  label_ko TEXT,
  label_zh TEXT,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent ON public.menu_items(parent_id, sort_order);

-- 9. Site Settings (key-value)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Users: 본인만 자기 행 조회/수정
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Lookbooks: 누구나 published 조회 / admin만 수정
CREATE POLICY "lookbooks_public_read" ON public.lookbooks FOR SELECT
  USING (status = 'published' OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "lookbooks_admin_write" ON public.lookbooks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Products: active만 공개
CREATE POLICY "products_public_read" ON public.products FOR SELECT
  USING (status = 'active' OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "products_admin_write" ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Orders: 본인 주문만 / admin은 전체
CREATE POLICY "orders_own_or_admin" ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "orders_insert_anon" ON public.orders FOR INSERT WITH CHECK (TRUE);  -- 비회원 주문 허용
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Inquiries: 누구나 추가 / admin만 조회
CREATE POLICY "inquiries_insert_anon" ON public.project_inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "inquiries_read_admin" ON public.project_inquiries FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Popups: 누구나 active 조회 / admin만 수정
CREATE POLICY "popups_public_read" ON public.popups FOR SELECT
  USING (active = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "popups_admin_write" ON public.popups FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Page Views: 누구나 추가, admin만 조회
CREATE POLICY "page_views_insert_anon" ON public.page_views FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "page_views_read_admin" ON public.page_views FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Menu Items: 누구나 visible 조회, admin만 수정
CREATE POLICY "menu_items_public_read" ON public.menu_items FOR SELECT
  USING (visible = TRUE OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "menu_items_admin_write" ON public.menu_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Site Settings: 누구나 조회, admin만 수정
CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "site_settings_admin_write" ON public.site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- =========================================================
-- Default Menu Items (초기값)
-- =========================================================
INSERT INTO public.menu_items (label_en, label_ko, label_zh, href, sort_order, visible) VALUES
  ('Home', '홈', '首页', '/', 1, TRUE),
  ('Shop', '상품', '商店', '/shop', 2, TRUE),
  ('Lookbooks', '룩북', '作品集', '/lookbooks', 3, TRUE),
  ('About', '소개', '关于', '/about', 4, TRUE),
  ('Project', '프로젝트', '合作', '/project', 5, TRUE),
  ('Contact', '연락처', '联系', '/contact', 6, TRUE)
ON CONFLICT DO NOTHING;
