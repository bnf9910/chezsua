import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Vercel 무료 플랜의 body size 제한: 4.5MB
// 안전하게 4MB로 제한
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const maxDuration = 60;

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
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: '파일이 너무 큽니다. 4MB 이하로 압축해주세요.' },
        { status: 413 }
      );
    }

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'lookbooks';

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: `파일이 너무 큽니다 (${(file.size / 1024 / 1024).toFixed(1)}MB). 4MB 이하로 압축해주세요.`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: '이미지 형식만 가능합니다 (JPG, PNG, WebP)' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${folder}/${timestamp}-${random}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

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
    return NextResponse.json(
      { ok: false, error: '업로드 실패: ' + String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

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
