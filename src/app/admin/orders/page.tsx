import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="p-12 max-md:p-7">
      <div className="mb-12">
        <h1 className="text-serif text-5xl font-light italic mb-2">Orders</h1>
        <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
          {orders?.length || 0} recent orders
        </p>
      </div>

      <div className="bg-bg-primary border border-line overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-line bg-bg-soft">
              <Th>Order #</Th>
              <Th>Recipient</Th>
              <Th>Type</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Payment</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order) => (
              <tr key={order.id} className="border-b border-line-soft last:border-0 hover:bg-bg-soft">
                <Td><span className="font-mono text-xs">{order.order_number}</span></Td>
                <Td>{order.recipient_first_name} {order.recipient_last_name}</Td>
                <Td className="capitalize">{order.delivery_type}</Td>
                <Td>{formatDate(order.delivery_date)}</Td>
                <Td>{formatPrice(order.total, order.currency)}</Td>
                <Td>
                  <span className={`text-mono text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                    order.payment_status === 'paid' ? 'bg-accent-green text-bg-primary' : 'bg-line'
                  }`}>
                    {order.payment_status}
                  </span>
                </Td>
                <Td className="capitalize">{order.order_status}</Td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-ink-muted italic">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted px-5 py-3 font-medium">{children}</th>;
}
function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 text-sm ${className}`}>{children}</td>;
}
