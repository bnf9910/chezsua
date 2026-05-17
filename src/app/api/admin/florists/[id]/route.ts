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

  // maybeSingle - 0개여도 에러 안 남
  const { data: profile } = await serviceClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || profile.role !== 'admin') return null;
  return { serviceClient };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH/PUT - florist 수정
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // id, created_at 등 시스템 필드는 제외
    const { id: _id, created_at, ...updateData } = body;

    // .single() 없이 update만
    const { error } = await auth.serviceClient
      .from('florists')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[florists PATCH] error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[florists PATCH] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// PUT도 같이 (혹시 클라이언트가 PUT 쓸 경우)
export async function PUT(req: NextRequest, ctx: RouteParams) {
  return PATCH(req, ctx);
}

// DELETE - florist 삭제
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await auth.serviceClient
      .from('florists')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
