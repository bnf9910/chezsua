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
  return { supabase };
}

// 룩북 생성
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 첫 번째 이미지를 cover_image로 자동
    if (!body.cover_image && body.images && body.images.length > 0) {
      body.cover_image = body.images[0];
    }

    // 비디오 자동 감지
    if (body.video_url && !body.is_video) {
      body.is_video = true;
    }

    // 빈 문자열 null로 변환
    if (body.featured_order === '') body.featured_order = null;
    if (body.featured_order && typeof body.featured_order === 'string') {
      body.featured_order = parseInt(body.featured_order);
    }

    const { data, error } = await auth.supabase
      .from('lookbooks')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[lookbooks POST] error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lookbook: data });
  } catch (err) {
    console.error('[lookbooks POST] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// 룩북 목록
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lookbooks')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, lookbooks: data });
}
