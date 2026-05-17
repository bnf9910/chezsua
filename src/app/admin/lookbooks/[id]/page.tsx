import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LookbookForm } from '@/components/admin/LookbookForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLookbookPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('id', id)
    .single();

  if (!lookbook) notFound();

  return (
    <LookbookForm
      initialData={lookbook}
      isEditMode={true}
      lookbookId={id}
    />
  );
}
