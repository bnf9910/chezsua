import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AdminBanner } from '@/components/account/AdminBanner';
import type { Locale } from '@/lib/i18n';

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // 사용자 프로필 가져오기
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // 최근 주문 5개
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, status, total_amount, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const isAdmin = profile?.role === 'admin';
  const userName = profile?.name || profile?.email?.split('@')[0] || 'User';

  return (
    <div className="pt-24 pb-20 max-w-[1200px] mx-auto px-12 max-md:px-6">
      {/* 인사말 */}
      <div className="mb-10">
        <div className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-3">
          My Account
        </div>
        <h1 className="text-serif text-5xl font-light italic max-md:text-4xl">
          안녕하세요, {userName}님
        </h1>
      </div>

      {/* 관리자 배너 (admin만) */}
      <AdminBanner />

      <div className="grid grid-cols-3 gap-6 mb-12 max-md:grid-cols-1">
        {/* 주문 내역 */}
        <Link
          href={`/${locale}/account/orders`}
          className="block bg-bg-primary border border-line p-7 hover:border-accent-green transition-colors group"
        >
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-2">
            Orders
          </div>
          <div className="text-serif text-2xl font-light mb-2">주문 내역</div>
          <div className="text-mono text-[11px] tracking-[0.15em] text-ink-muted">
            {recentOrders?.length || 0}건의 주문
          </div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-secondary mt-4 group-hover:text-ink-primary">
            보기 →
          </div>
        </Link>

        {/* 프로필 */}
        <Link
          href={`/${locale}/account/profile`}
          className="block bg-bg-primary border border-line p-7 hover:border-accent-green transition-colors group"
        >
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-2">
            Profile
          </div>
          <div className="text-serif text-2xl font-light mb-2">내 정보</div>
          <div className="text-mono text-[11px] tracking-[0.15em] text-ink-muted">
            {profile?.email}
          </div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-secondary mt-4 group-hover:text-ink-primary">
            관리 →
          </div>
        </Link>

        {/* 로그아웃 */}
        <Link
          href={`/${locale}/auth/signout`}
          className="block bg-bg-primary border border-line p-7 hover:border-accent-green transition-colors group"
        >
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-2">
            Logout
          </div>
          <div className="text-serif text-2xl font-light mb-2">로그아웃</div>
          <div className="text-mono text-[11px] tracking-[0.15em] text-ink-muted">
            안전하게 종료
          </div>
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-ink-secondary mt-4 group-hover:text-ink-primary">
            로그아웃 →
          </div>
        </Link>
      </div>

      {/* 최근 주문 */}
      {recentOrders && recentOrders.length > 0 && (
        <section>
          <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-4 pb-3 border-b border-line">
            최근 주문
          </h2>
          <div className="divide-y divide-line">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/account/orders/${order.order_number}`}
                className="flex justify-between items-center py-4 hover:bg-bg-secondary px-3 -mx-3 transition-colors max-md:flex-col max-md:items-start max-md:gap-2"
              >
                <div>
                  <div className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                    #{order.order_number}
                  </div>
                  <div className="text-serif text-lg mt-1">
                    ₩{order.total_amount?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-secondary">
                    {translateStatus(order.status)}
                  </span>
                  <span className="text-mono text-[10px] tracking-[0.15em] text-ink-muted">
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <span className="text-mono text-[10px] text-ink-muted">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    pending: '결제 대기',
    paid: '결제 완료',
    preparing: '준비 중',
    shipping: '배송 중',
    delivered: '배송 완료',
    cancelled: '취소됨',
  };
  return map[status] || status;
}
