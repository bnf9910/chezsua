import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import NextLink from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminMenusPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const cookieStore = await cookies();
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
    }
  );

  const { data: profile } = await serviceClient
    .from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: menus } = await serviceClient
    .from('menu_items')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-end mb-10 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Menus</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            메뉴 관리 · 색상 · 굵기 · 폰트사이즈
          </p>
        </div>
        <NextLink
          href="/admin/menus/new"
          className="px-5 py-2.5 bg-accent-green text-bg-primary hover:bg-ink-primary text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          + New Menu
        </NextLink>
      </div>

      {/* 목록 */}
      <div className="bg-bg-soft border border-line">
        <div className="grid grid-cols-[60px_1fr_1fr_120px_120px_100px_120px] gap-4 px-6 py-3 border-b border-line text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted max-md:hidden">
          <div>순서</div>
          <div>라벨 (EN)</div>
          <div>라벨 (KO)</div>
          <div>링크</div>
          <div>색상</div>
          <div>활성</div>
          <div>관리</div>
        </div>

        {(menus || []).length === 0 ? (
          <div className="p-10 text-center text-ink-muted">
            메뉴가 없습니다. + New Menu를 눌러 추가하세요.
          </div>
        ) : (
          (menus || []).map((menu) => (
            <div
              key={menu.id}
              className="grid grid-cols-[60px_1fr_1fr_120px_120px_100px_120px] gap-4 px-6 py-4 border-b border-line/50 items-center hover:bg-bg-primary/30 transition-colors max-md:grid-cols-1 max-md:gap-2"
            >
              <div className="text-mono text-sm text-ink-muted">#{menu.display_order}</div>
              <div className="text-serif text-lg font-medium" style={{ color: menu.color || '#1A1F1B' }}>
                {menu.label_en}
                {menu.is_event && (
                  <span className="ml-2 text-mono text-[9px] tracking-[0.2em] uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5">
                    EVENT
                  </span>
                )}
              </div>
              <div className="text-serif text-base text-ink-secondary">{menu.label_ko}</div>
              <div className="text-mono text-xs text-ink-muted">{menu.href}</div>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 border border-line"
                  style={{ background: menu.color || '#1A1F1B' }}
                />
                <span className="text-mono text-[10px] text-ink-muted uppercase">
                  {menu.color}
                </span>
              </div>
              <div>
                <span
                  className={`inline-block px-2 py-0.5 text-mono text-[9px] tracking-[0.15em] uppercase ${
                    menu.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {menu.is_active ? 'Active' : 'Off'}
                </span>
              </div>
              <NextLink
                href={`/admin/menus/${menu.id}`}
                className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-primary hover:text-accent-green border-b border-ink-primary hover:border-accent-green pb-0.5 self-center"
              >
                Edit →
              </NextLink>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
