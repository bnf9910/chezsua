import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { MenuForm } from '@/components/admin/MenuForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const cookieStore = await cookies();
  const serviceClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: profile } = await serviceClient
    .from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: menu } = await serviceClient
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (!menu) notFound();

  return (
    <div className="p-12 max-md:p-6 max-w-[1200px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Edit Menu</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        메뉴 수정
      </p>

      <MenuForm mode="edit" initialData={menu} />
    </div>
  );
}
