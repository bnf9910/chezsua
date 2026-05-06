import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 통계 조회
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [pageViewsToday, ordersToday, ordersTotal, inquiries] = await Promise.all([
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', yesterday.toISOString()),
    supabase.from('orders').select('total', { count: 'exact' }).gte('created_at', yesterday.toISOString()),
    supabase.from('orders').select('total').gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('project_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const todayRevenue = (ordersToday.data || []).reduce(
    (sum: number, o: { total?: number }) => sum + (o.total || 0),
    0
  );
  const monthlyRevenue = (ordersTotal.data || []).reduce(
    (sum: number, o: { total?: number }) => sum + (o.total || 0),
    0
  );

  return (
    <div className="p-12 max-md:p-7">
      <h1 className="text-serif text-5xl font-light italic mb-3">Dashboard</h1>
      <p className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-12">
        Today · {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="grid grid-cols-4 gap-5 mb-12 max-lg:grid-cols-2 max-md:grid-cols-1">
        <StatCard
          label="Page Views (24h)"
          value={(pageViewsToday.count || 0).toLocaleString()}
          accent="green"
        />
        <StatCard
          label="Orders Today"
          value={String(ordersToday.count || 0)}
          subValue={formatPrice(todayRevenue, 'KRW')}
          accent="blush"
        />
        <StatCard
          label="Revenue (30d)"
          value={formatPrice(monthlyRevenue, 'KRW')}
          accent="cream"
        />
        <StatCard
          label="New Inquiries"
          value={String(inquiries.count || 0)}
          accent="sage"
        />
      </div>

      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        <QuickAction href="/admin/lookbooks/new" title="New Lookbook" desc="Publish a new editorial story" />
        <QuickAction href="/admin/products/new" title="New Product" desc="Add a new flower arrangement" />
        <QuickAction href="/admin/popups" title="Manage Popups" desc="Schedule events & announcements" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subValue,
  accent,
}: {
  label: string;
  value: string;
  subValue?: string;
  accent: 'green' | 'blush' | 'cream' | 'sage';
}) {
  const colors = {
    green: 'border-l-accent-green',
    blush: 'border-l-accent-blush',
    cream: 'border-l-accent-cream',
    sage: 'border-l-accent-sage',
  };
  return (
    <div className={`bg-bg-primary border border-line border-l-4 ${colors[accent]} p-6`}>
      <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted mb-3">
        {label}
      </div>
      <div className="text-serif text-4xl font-light text-ink-primary">{value}</div>
      {subValue && (
        <div className="text-mono text-[11px] tracking-[0.1em] text-ink-secondary mt-2">
          {subValue}
        </div>
      )}
    </div>
  );
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block bg-bg-primary border border-line p-7 hover:border-ink-primary transition-colors group"
    >
      <div className="text-serif text-2xl mb-2 group-hover:italic transition-all">{title}</div>
      <div className="text-sm text-ink-secondary mb-4">{desc}</div>
      <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green">
        Create →
      </div>
    </Link>
  );
}
