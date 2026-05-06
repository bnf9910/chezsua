import { createClient } from '@/lib/supabase/server';
import { MenuManager } from '@/components/admin/MenuManager';

export default async function AdminMenusPage() {
  const supabase = await createClient();
  const { data: menus } = await supabase
    .from('menu_items')
    .select('*')
    .order('parent_id', { ascending: true })
    .order('sort_order', { ascending: true });

  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-3">Menus</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-12">
        Site navigation · drag to reorder · click to edit
      </p>

      <MenuManager initialMenus={menus || []} />
    </div>
  );
}
