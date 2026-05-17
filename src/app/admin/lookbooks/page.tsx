import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LookbookListClient } from '@/components/admin/LookbookListClient';

export default async function AdminLookbooksPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  // 모든 룩북 조회 (Featured 먼저, 그 다음 최신순)
  const { data: lookbooks } = await supabase
    .from('lookbooks')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('featured_order', { ascending: true, nullsFirst: false })
    .order('publish_date', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <h1 className="text-serif text-5xl font-light italic mb-2">Lookbooks</h1>
          <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
            {lookbooks?.length || 0} stories
          </p>
        </div>
        <a
          href="/admin/lookbooks/new"
          className="px-7 py-3 bg-ink-primary text-bg-primary hover:bg-accent-green text-mono text-[11px] tracking-[0.25em] uppercase transition-colors"
        >
          + New Lookbook
        </a>
      </div>

      <LookbookListClient initialLookbooks={lookbooks || []} />
    </div>
  );
}
