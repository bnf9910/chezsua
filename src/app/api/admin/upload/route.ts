import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 최대 파일 크기: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'lookbooks';

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    // 파일 크기 체크
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: 'File too large. Maximum 10MB.' },
        { status: 400 }
      );
    }

    // 파일 타입 체크
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid file type. Only JPG, PNG, WebP allowed.' },
        { status: 400 }
      );
    }

    // 파일명 만들기: lookbooks/{timestamp}-{random}.jpg
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${folder}/${timestamp}-${random}.${ext}`;

    // ArrayBuffer 로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storage에 업로드
    const { data, error } = await auth.supabase.storage
      .from('chezsua-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('[upload] storage error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Public URL 가져오기
    const { data: publicUrlData } = auth.supabase.storage
      .from('chezsua-images')
      .getPublicUrl(data.path);

    return NextResponse.json({
      ok: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (err) {
    console.error('[upload] exception:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// 삭제
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { path } = await req.json();
    if (!path) {
      return NextResponse.json({ ok: false, error: 'No path provided' }, { status: 400 });
    }

    const { error } = await auth.supabase.storage
      .from('chezsua-images')
      .remove([path]);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
