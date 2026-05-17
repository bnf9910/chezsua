import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LookbookForm } from '@/components/admin/LookbookForm';

export default async function NewLookbookPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  return <LookbookForm />;
}
