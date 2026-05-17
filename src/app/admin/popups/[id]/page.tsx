import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PopupForm } from '@/components/admin/PopupForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPopupPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: popup } = await supabase
    .from('popups')
    .select('*')
    .eq('id', id)
    .single();

  if (!popup) notFound();

  return (
    <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Edit Popup</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        팝업 수정
      </p>

      <PopupForm mode="edit" initialData={popup} />
    </div>
  );
}
