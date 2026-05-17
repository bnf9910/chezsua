import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 모든 settings 키를 받아서 upsert
export async function POST(req: NextRequest) {
  try {
    // 1. 인증 확인
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. admin 권한 확인 (SERVICE_ROLE로 RLS 우회)
    const cookieStore = await cookies();
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: profile } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    // 3. body 파싱
    const body = await req.json();

    // 4. 각 key를 settings 테이블에 upsert
    const upserts = Object.entries(body).map(([key, value]) => ({
      key,
      value: value as object,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await serviceClient
      .from('settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) {
      console.error('[settings POST] error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[settings POST] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// GET: 모든 settings 조회
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('*');

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const settings: Record<string, unknown> = {};
    (data || []).forEach((row) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
