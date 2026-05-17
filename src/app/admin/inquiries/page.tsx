import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InquiriesClient } from '@/components/admin/InquiriesClient';

export default async function AdminInquiriesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: inquiries } = await supabase
    .from('project_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-serif text-5xl font-light italic mb-2">Inquiries</h1>
        <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
          {inquiries?.length || 0} total · {inquiries?.filter((i) => i.status === 'new').length || 0} new
        </p>
      </div>

      <InquiriesClient initialInquiries={inquiries || []} />
    </div>
  );
}
