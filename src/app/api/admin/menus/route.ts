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
    .order('parent_id', { ascending: true, nullsFirst: true })
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

    // 2. 새로 삽입 - 모든 새 컬럼 포함
    const cleaned = menus.map((m: Record<string, unknown>) => {
      const { id, ...rest } = m;
      const item = {
        ...rest,
        // 기본값 처리
        style_color: rest.style_color || null,
        style_weight: rest.style_weight || null,
        style_italic: rest.style_italic || false,
        style_underline: rest.style_underline || false,
        style_size: rest.style_size || null,
        is_event: rest.is_event || false,
        event_format: rest.event_format || null,
        event_hero_image: rest.event_hero_image || null,
        event_hero_title_en: rest.event_hero_title_en || null,
        event_hero_title_ko: rest.event_hero_title_ko || null,
        event_hero_title_zh: rest.event_hero_title_zh || null,
        event_hero_subtitle_en: rest.event_hero_subtitle_en || null,
        event_hero_subtitle_ko: rest.event_hero_subtitle_ko || null,
        event_hero_subtitle_zh: rest.event_hero_subtitle_zh || null,
      };
      return typeof id === 'string' && id.startsWith('new-') ? item : { id, ...item };
    });

    const { error } = await supabase.from('menu_items').insert(cleaned);
    if (error) {
      console.error('[admin/menus] insert error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/menus] error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
