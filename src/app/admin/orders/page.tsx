import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-12 max-md:p-6 max-w-[1400px] mx-auto">
      <h1 className="text-serif text-5xl font-light italic mb-2">Orders</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-10">
        {orders?.length || 0} orders
      </p>

      {!orders || orders.length === 0 ? (
        <div className="p-10 bg-bg-soft text-center">
          <p className="text-serif text-lg text-ink-secondary italic">아직 주문이 없습니다</p>
          <p className="text-mono text-[10px] text-ink-muted mt-2">
            결제 시스템(PortOne) 연결 후 주문이 들어옵니다
          </p>
        </div>
      ) : (
        <div className="bg-bg-primary border border-line overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-soft border-b border-line">
              <tr>
                <Th>주문번호</Th>
                <Th>고객</Th>
                <Th>금액</Th>
                <Th>상태</Th>
                <Th>주문일</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-line hover:bg-bg-soft">
                  <Td>
                    <span className="font-mono text-xs">
                      #{order.order_number || order.id.substring(0, 8)}
                    </span>
                  </Td>
                  <Td>
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-ink-muted">{order.customer_phone}</div>
                  </Td>
                  <Td>{formatPrice(order.total || 0, 'KRW')}</Td>
                  <Td>
                    <span className={`text-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1 ${
                      order.status === 'paid' ? 'bg-accent-green/10 text-accent-green' :
                      order.status === 'shipping' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'delivered' ? 'bg-bg-soft text-ink-primary' :
                      order.status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </Td>
                  <Td>{new Date(order.created_at).toLocaleDateString('ko-KR')}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}
