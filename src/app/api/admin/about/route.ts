import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized - 로그인 필요' }, { status: 401 });
    }

    const cookieStore = await cookies();
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: profile } = await serviceClient
      .from('users').select('role').eq('id', user.id).single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Forbidden - 관리자 권한 필요' }, { status: 403 });
    }

    const body = await req.json();
    const { brand, florists } = body;

    // 1. brand 저장 (settings 테이블)
    if (brand) {
      const { error: brandError } = await serviceClient
        .from('settings')
        .upsert(
          { key: 'about_brand', value: brand, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (brandError) {
        console.error('[about POST] brand error:', brandError);
        return NextResponse.json({ ok: false, error: 'Brand 저장 실패: ' + brandError.message }, { status: 500 });
      }
    }

    // 2. florists 저장 (florists 테이블)
    if (florists && Array.isArray(florists)) {
      for (const florist of florists) {
        if (florist.id && !florist.id.startsWith('new-')) {
          // 기존 → UPDATE
          const { id, ...updateData } = florist;
          const { error } = await serviceClient
            .from('florists')
            .update(updateData)
            .eq('id', id);
          if (error) {
            console.error('[about POST] florist update error:', error);
            return NextResponse.json({ ok: false, error: 'Florist 수정 실패: ' + error.message }, { status: 500 });
          }
        } else {
          // 새 → INSERT
          const { id, ...insertData } = florist;
          const { error } = await serviceClient
            .from('florists')
            .insert(insertData);
          if (error) {
            console.error('[about POST] florist insert error:', error);
            return NextResponse.json({ ok: false, error: 'Florist 추가 실패: ' + error.message }, { status: 500 });
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[about POST] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
