import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SettingsClient } from '@/components/admin/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/auth/login');
    }

    // SERVICE_ROLE로 admin 권한 + settings 조회 (RLS 우회)
    const cookieStore = await cookies();
    const serviceClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      redirect('/');
    }

    // settings 조회
    const { data: settingsRows } = await serviceClient.from('settings').select('*');

    const settings: Record<string, Record<string, string>> = {
      site: { name: 'CHEZSUA', tagline: 'Editorial Floristry · Seoul', description: '' },
      contact: { phone: '', email: 'chezsuaflower@gmail.com', address: 'Seoul · Gangnam', hours: 'Mon — Sat · 11:00 AM — 7:00 PM' },
      social: { instagram: '', naver_blog: '', youtube: '' },
      seo: { default_title: 'CHEZSUA', default_description: '', og_image: '' },
    };

    (settingsRows || []).forEach((row) => {
      if (row.key && row.value && typeof row.value === 'object') {
        settings[row.key] = { ...(settings[row.key] || {}), ...(row.value as Record<string, string>) };
      }
    });

    return (
      <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
        <h1 className="text-serif text-5xl font-light italic mb-2">Settings</h1>
        <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
          사이트 정보 · 연락처 · SNS · SEO
        </p>

        <SettingsClient initialSettings={settings} />
      </div>
    );
  } catch (err) {
    console.error('[admin/settings] error:', err);
    return (
      <div className="p-12 max-w-[800px] mx-auto">
        <h1 className="text-serif text-4xl font-light italic mb-4">Settings</h1>
        <div className="p-8 bg-rose-50 border border-rose-200">
          <p className="text-rose-700 mb-4">설정 페이지 로드 중 오류가 발생했습니다.</p>
          <pre className="text-xs bg-white p-3 rounded overflow-auto">{String(err)}</pre>
        </div>
      </div>
    );
  }
}
