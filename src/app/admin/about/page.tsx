import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AboutAdminClient } from '@/components/admin/AboutAdminClient';

export default async function AdminAboutPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single();

  if (profile?.role !== 'admin') redirect('/');

  // 브랜드 정보
  const { data: brandRow } = await supabase
    .from('settings').select('value').eq('key', 'about_brand').single();

  // 플로리스트 목록
  const { data: florists } = await supabase
    .from('florists').select('*').order('display_order', { ascending: true });

  const defaultBrand = {
    label_en: 'About — The Atelier',
    label_ko: 'ABOUT — 아틀리에',
    headline_en: 'The Language of *Flowers*',
    headline_ko: '*꽃*의 언어',
    subtitle_en: 'Editorial Floristry · Seoul',
    subtitle_ko: '에디토리얼 플로리스트 · 서울',
    intro_en: '',
    intro_ko: '',
    philosophy_en: '',
    philosophy_ko: '',
    studio_text_en: '',
    studio_text_ko: '',
    cover_image: '',
  };

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">About 페이지 관리</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        Brand Story · Florists · Philosophy · Studio
      </p>

      <AboutAdminClient
        initialBrand={{ ...defaultBrand, ...(brandRow?.value as object || {}) }}
        initialFlorists={florists || []}
      />
    </div>
  );
}
