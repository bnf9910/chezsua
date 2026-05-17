import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const cookieStore = await cookies();
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: profile } = await serviceClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') return null;
  return { serviceClient };
}

// POST - 새 florist 추가
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, created_at, ...insertData } = body;

    const { data, error } = await auth.serviceClient
      .from('florists')
      .insert({
        ...insertData,
        is_active: insertData.is_active !== false,
        display_order: insertData.display_order || 0,
      })
      .select();

    if (error) {
      console.error('[florists POST] error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, florist: data?.[0] });
  } catch (err) {
    console.error('[florists POST] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// GET - 모든 florists 조회
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('florists')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, florists: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
