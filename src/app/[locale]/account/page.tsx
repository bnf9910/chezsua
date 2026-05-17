import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AccountClient } from '@/components/account/AccountClient';
import type { Locale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AccountPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  // 프로필 조회
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // 주문 내역 조회 (선택 - orders 테이블이 있으면)
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <main className="pt-32 pb-20 px-12 max-md:px-6 max-md:pt-24 max-w-[1000px] mx-auto">
      <AccountClient
        locale={locale}
        user={{
          id: user.id,
          email: user.email || '',
          name: profile?.name || '',
          phone: profile?.phone || '',
          marketing_agreed: profile?.marketing_agreed || false,
          role: profile?.role || 'user',
        }}
        orders={orders || []}
      />
    </main>
  );
}
