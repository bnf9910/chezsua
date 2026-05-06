import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * 페이지 방문 추적 (자체 분석)
 *
 * - 클라이언트가 페이지뷰마다 이 API에 비동기 POST
 * - 광고차단기 영향 적음 (자체 도메인)
 * - IP/UA에서 봇 필터링, 해시 익명화로 프라이버시 보호
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, screen, device, locale } = body;

    if (typeof path !== 'string' || path.length > 500) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // 봇 필터링 (간단)
    const ua = req.headers.get('user-agent') || '';
    if (/bot|crawler|spider|preview/i.test(ua)) {
      return NextResponse.json({ ok: true, ignored: 'bot' });
    }

    // IP는 익명화 (해시)
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ipHash = await sha256(ip + (process.env.IP_SALT || 'chezsua'));

    // Country - Vercel이 헤더로 제공
    const country = req.headers.get('x-vercel-ip-country') || null;

    // Referrer source 분류
    const refSource = classifyReferrer(referrer);

    try {
      const supabase = await createClient();
      await supabase.from('page_views').insert({
        path,
        referrer: referrer || null,
        ref_source: refSource,
        country,
        device: device || null,
        screen: screen || null,
        locale: locale || null,
        ip_hash: ipHash.slice(0, 16), // 일별 unique visitor 식별용
        user_agent: ua.slice(0, 500),
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error('[track] DB insert failed:', dbErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function classifyReferrer(ref: string | null | undefined): string {
  if (!ref) return 'direct';
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('naver.com')) return 'naver';
    if (host.includes('google.')) return 'google';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('xiaohongshu') || host.includes('xhscdn')) return 'xiaohongshu';
    if (host.includes('tiktok.com') || host.includes('douyin')) return 'tiktok';
    if (host.includes('weixin.qq') || host.includes('wechat')) return 'wechat';
    if (host.includes('kakao.com')) return 'kakao';
    if (host.includes('chezsua.com')) return 'internal';
    return host;
  } catch {
    return 'unknown';
  }
}
