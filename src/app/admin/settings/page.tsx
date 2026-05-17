import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/admin/SettingsClient';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // 권한 체크
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  // 모든 설정 가져오기
  const { data: settingsRows } = await supabase.from('settings').select('*');
  
  const settings: Record<string, Record<string, string>> = {
    site: { name: '', tagline: '', description: '' },
    contact: { phone: '', email: '', address: '', hours: '' },
    social: { instagram: '', naver_blog: '', youtube: '' },
    seo: { default_title: '', default_description: '', default_keywords: '' },
  };

  (settingsRows || []).forEach((row) => {
    if (settings[row.key]) {
      settings[row.key] = { ...settings[row.key], ...(row.value as Record<string, string>) };
    }
  });

  return (
    <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Settings</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        Site Configuration · SEO · Contact
      </p>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
