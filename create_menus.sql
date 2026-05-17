-- ============================================================
-- CHEZSUA · menu_items 테이블 생성 + 기본 메뉴
-- ============================================================

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 컬럼 추가 (이미 있으면 무시)
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS label_en TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS label_ko TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS href TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#1A1F1B';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS font_weight TEXT DEFAULT 'normal';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'text-4xl';
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_event BOOLEAN DEFAULT FALSE;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS event_badge TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS open_in_new_tab BOOLEAN DEFAULT FALSE;

-- RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active menus" ON public.menu_items;
DROP POLICY IF EXISTS "Anyone can read menus" ON public.menu_items;

CREATE POLICY "Public can read active menus"
ON public.menu_items FOR SELECT
TO public
USING (is_active = TRUE);

-- 기본 메뉴 5개 추가 (없을 때만)
INSERT INTO public.menu_items (label_en, label_ko, href, display_order, is_active, font_size, font_weight, color)
SELECT * FROM (VALUES
  ('Home', 'Home', '/', 1, true, 'text-4xl', 'normal', '#1A1F1B'),
  ('Shop', 'Shop', '/shop', 2, true, 'text-4xl', 'normal', '#1A1F1B'),
  ('Lookbooks', 'Lookbooks', '/lookbooks', 3, true, 'text-4xl', 'normal', '#1A1F1B'),
  ('About', 'About', '/about', 4, true, 'text-4xl', 'normal', '#1A1F1B'),
  ('Project', 'Project', '/project', 5, true, 'text-4xl', 'normal', '#1A1F1B')
) AS v(label_en, label_ko, href, display_order, is_active, font_size, font_weight, color)
WHERE NOT EXISTS (SELECT 1 FROM public.menu_items);

-- 확인
SELECT id, label_en, label_ko, href, color, font_weight, font_size, is_event, event_badge, is_active, display_order
FROM public.menu_items
ORDER BY display_order;
