import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EventContentEditor } from '@/components/admin/EventContentEditor';
import type { SiteMenuItem } from '@/lib/site-menus';
import type { Lookbook, Product } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEventContentPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 이벤트 메뉴 조회
  const { data: menu } = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .eq('is_event', true)
    .single();

  if (!menu) notFound();

  const eventMenu = menu as SiteMenuItem;

  // 2. 현재 연결된 룩북/상품
  const [{ data: linkedLookbooks }, { data: linkedProducts }, { data: allLookbooks }, { data: allProducts }] = await Promise.all([
    supabase
      .from('event_lookbook_links')
      .select('lookbook_id, sort_order')
      .eq('menu_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('event_product_links')
      .select('product_id, sort_order')
      .eq('menu_id', id)
      .order('sort_order', { ascending: true }),
    supabase.from('lookbooks').select('id, slug, title_en, cover_image, category, publish_date').eq('status', 'published').order('publish_date', { ascending: false }),
    supabase.from('products').select('id, slug, name_en, images, price_krw, category').eq('status', 'active').order('created_at', { ascending: false }),
  ]);

  return (
    <div className="p-12 max-md:p-7">
      <Link
        href="/admin/menus"
        className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink-primary mb-3 inline-block"
      >
        ← Menus
      </Link>
      <h1 className="text-serif text-5xl font-light italic mb-2">
        {eventMenu.label_en} <span className="text-accent-green">— Event Content</span>
      </h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        Format: <strong>{eventMenu.event_format?.toUpperCase()}</strong> · Page:{' '}
        <code className="font-mono">{eventMenu.href}</code>
      </p>

      <EventContentEditor
        menuId={id}
        eventFormat={eventMenu.event_format || 'shop'}
        initialLookbookIds={(linkedLookbooks || []).map((l) => l.lookbook_id)}
        initialProductIds={(linkedProducts || []).map((p) => p.product_id)}
        allLookbooks={(allLookbooks as Pick<Lookbook, 'id' | 'slug' | 'title_en' | 'cover_image' | 'category' | 'publish_date'>[]) || []}
        allProducts={(allProducts as Pick<Product, 'id' | 'slug' | 'name_en' | 'images' | 'price_krw' | 'category'>[]) || []}
      />
    </div>
  );
}
