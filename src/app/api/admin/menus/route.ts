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

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('parent_id', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, menus: data });
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { menus } = await req.json();
    if (!Array.isArray(menus)) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    // 1. 모두 삭제
    await supabase.from('menu_items').delete().neq('id', '__never__');

    // 2. 새로 삽입
    const cleaned = menus.map((m: { id: string }) => {
      const { id, ...rest } = m;
      // id가 'new-'로 시작하면 DB가 새로 생성하도록 제외
      return id.startsWith('new-') ? rest : { id, ...rest };
    });
    const { error } = await supabase.from('menu_items').insert(cleaned);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
