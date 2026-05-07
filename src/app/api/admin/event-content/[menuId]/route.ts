import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return supabase;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ menuId: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { menuId } = await params;
    const { lookbookIds, productIds } = await req.json();

    if (!Array.isArray(lookbookIds) || !Array.isArray(productIds)) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    // 1. 기존 연결 삭제
    await supabase.from('event_lookbook_links').delete().eq('menu_id', menuId);
    await supabase.from('event_product_links').delete().eq('menu_id', menuId);

    // 2. 새 연결 추가
    if (lookbookIds.length > 0) {
      const lookbookRows = lookbookIds.map((id: string, idx: number) => ({
        menu_id: menuId,
        lookbook_id: id,
        sort_order: idx,
      }));
      const { error: lbError } = await supabase.from('event_lookbook_links').insert(lookbookRows);
      if (lbError) throw lbError;
    }

    if (productIds.length > 0) {
      const productRows = productIds.map((id: string, idx: number) => ({
        menu_id: menuId,
        product_id: id,
        sort_order: idx,
      }));
      const { error: prError } = await supabase.from('event_product_links').insert(productRows);
      if (prError) throw prError;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[event-content] error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
