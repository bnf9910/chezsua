import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return null;
  return { supabase, user };
}

// 모든 설정 조회
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('*');
  
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // key를 기준으로 객체로 변환
  const settings: Record<string, unknown> = {};
  (data || []).forEach((row) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json({ ok: true, settings });
}

// 설정 업데이트 (개별 key 또는 다중 key)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    // body 형태: { site: {...}, contact: {...}, ... }

    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
      updated_by: auth.user.id,
    }));

    if (updates.length === 0) {
      return NextResponse.json({ ok: false, error: 'No settings provided' }, { status: 400 });
    }

    const { error } = await auth.supabase
      .from('settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      console.error('[settings] upsert error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, updated: updates.length });
  } catch (err) {
    console.error('[settings] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
