import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // 1. 인증
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized - 로그인이 필요합니다' },
        { status: 401 }
      );
    }

    // 2. SERVICE_ROLE
    const cookieStore = await cookies();
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    // 3. admin 확인 (.single() 대신 maybeSingle)
    const { data: profile } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { ok: false, error: 'Forbidden - 관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    // 4. 요청 데이터
    const body = await req.json();
    const { brand, florists } = body;

    // 5. brand 저장 (about_brand) - 중복 행 자동 정리 후 upsert
    if (brand) {
      // 먼저 기존 about_brand 중복 행 모두 삭제
      const { error: delError } = await serviceClient
        .from('settings')
        .delete()
        .eq('key', 'about_brand');

      if (delError) {
        console.error('[about POST] delete error:', delError);
      }

      // 그 다음 새로 insert (PRIMARY KEY가 key라서 1개만 유지됨)
      const { error: insError } = await serviceClient
        .from('settings')
        .insert({
          key: 'about_brand',
          value: brand,
          updated_at: new Date().toISOString(),
        });

      if (insError) {
        console.error('[about POST] insert error:', insError);
        return NextResponse.json(
          { ok: false, error: 'Brand 저장 실패: ' + insError.message },
          { status: 500 }
        );
      }
    }

    // 6. florists 저장
    if (florists && Array.isArray(florists)) {
      for (const florist of florists) {
        // id가 임시 ID(new- 시작)면 INSERT, 진짜 UUID면 UPDATE
        if (florist.id && !String(florist.id).startsWith('new-')) {
          const { id, created_at, ...updateData } = florist;
          const { error } = await serviceClient
            .from('florists')
            .update({
              ...updateData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);

          if (error) {
            console.error('[about POST] florist update error:', error);
            return NextResponse.json(
              { ok: false, error: `Florist 수정 실패 (${florist.name_en}): ${error.message}` },
              { status: 500 }
            );
          }
        } else {
          // 새 florist - id, created_at 제거 후 insert
          const { id, created_at, ...insertData } = florist;
          const { error } = await serviceClient
            .from('florists')
            .insert({
              ...insertData,
              is_active: insertData.is_active !== false,
              display_order: insertData.display_order || 0,
            });

          if (error) {
            console.error('[about POST] florist insert error:', error);
            return NextResponse.json(
              { ok: false, error: `Florist 추가 실패: ${error.message}` },
              { status: 500 }
            );
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
