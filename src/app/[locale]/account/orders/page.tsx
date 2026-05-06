import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import { routing } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Order } from '@/lib/types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LABELS = {
  en: {
    title: 'Orders',
    empty: 'No orders yet',
    emptyDesc: 'When you place an order, it will appear here.',
    browseShop: 'Browse Shop',
    orderNumber: 'Order',
    placed: 'Placed',
    status: 'Status',
    total: 'Total',
    delivery: 'Delivery',
    pickup: 'Pick Up',
    statusReceived: 'Received',
    statusPreparing: 'Preparing',
    statusShipped: 'Shipped',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    paymentPending: 'Payment Pending',
    paymentPaid: 'Paid',
    paymentFailed: 'Failed',
    paymentRefunded: 'Refunded',
    viewDetails: 'View Details',
    deliveryDate: 'Delivery Date',
    recipient: 'Recipient',
  },
  ko: {
    title: '주문 내역',
    empty: '아직 주문이 없습니다',
    emptyDesc: '주문하시면 여기에 표시됩니다.',
    browseShop: '상품 둘러보기',
    orderNumber: '주문번호',
    placed: '주문일',
    status: '상태',
    total: '결제 금액',
    delivery: '배송',
    pickup: '픽업',
    statusReceived: '접수됨',
    statusPreparing: '준비 중',
    statusShipped: '배송 중',
    statusCompleted: '완료',
    statusCancelled: '취소됨',
    paymentPending: '결제 대기',
    paymentPaid: '결제 완료',
    paymentFailed: '결제 실패',
    paymentRefunded: '환불됨',
    viewDetails: '상세 보기',
    deliveryDate: '수령일',
    recipient: '수령인',
  },
  zh: {
    title: '订单记录',
    empty: '暂无订单',
    emptyDesc: '下单后将在此显示。',
    browseShop: '浏览商店',
    orderNumber: '订单号',
    placed: '下单日期',
    status: '状态',
    total: '总额',
    delivery: '配送',
    pickup: '自取',
    statusReceived: '已接收',
    statusPreparing: '准备中',
    statusShipped: '配送中',
    statusCompleted: '已完成',
    statusCancelled: '已取消',
    paymentPending: '待付款',
    paymentPaid: '已付款',
    paymentFailed: '付款失败',
    paymentRefunded: '已退款',
    viewDetails: '查看详情',
    deliveryDate: '配送日期',
    recipient: '收件人',
  },
};

const STATUS_COLORS = {
  received: 'bg-accent-cream text-accent-green',
  preparing: 'bg-accent-blush text-ink-primary',
  shipped: 'bg-accent-sage text-ink-primary',
  completed: 'bg-accent-green text-bg-primary',
  cancelled: 'bg-line text-ink-muted',
};

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = LABELS[locale as Locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // 주문 조회
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const ordersList: Order[] = (orders as Order[]) || [];

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-12 py-16 max-md:px-7 max-md:py-10">
        {/* Breadcrumb */}
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/account" className="hover:text-ink-primary">
            Account
          </Link>{' '}
          / <span className="text-ink-primary">{t.title}</span>
        </div>

        <h1 className="text-serif text-[clamp(40px,5vw,64px)] font-light italic mb-12">
          {t.title}
        </h1>

        {ordersList.length === 0 ? (
          <div className="text-center py-20 border-t border-line">
            <p className="text-serif text-3xl italic mb-3">{t.empty}</p>
            <p className="text-ink-secondary mb-8">{t.emptyDesc}</p>
            <Link
              href="/shop"
              className="inline-block bg-ink-primary text-bg-primary py-3.5 px-10 text-mono text-[11px] tracking-[0.3em] uppercase hover:bg-accent-green transition-colors"
            >
              {t.browseShop} →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersList.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                locale={locale as Locale}
                labels={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({
  order,
  locale,
  labels,
}: {
  order: Order;
  locale: Locale;
  labels: (typeof LABELS)['en'];
}) {
  const statusKey = `status${order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}` as
    | 'statusReceived'
    | 'statusPreparing'
    | 'statusShipped'
    | 'statusCompleted'
    | 'statusCancelled';
  const statusLabel = labels[statusKey];
  const statusColor = STATUS_COLORS[order.order_status as keyof typeof STATUS_COLORS] || STATUS_COLORS.received;

  return (
    <Link
      href={`/account/orders/${order.order_number}`}
      className="block p-7 bg-bg-soft border border-line hover:border-ink-primary transition-colors max-md:p-5"
    >
      <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-mono text-xs tracking-[0.15em] text-ink-primary font-medium">
              #{order.order_number}
            </span>
            <span
              className={`text-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          <div className="text-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted leading-loose">
            <span className="inline-block mr-5">
              {labels.placed}: {formatDate(order.created_at, locale)}
            </span>
            <span className="inline-block mr-5">
              {labels.deliveryDate}: {formatDate(order.delivery_date, locale)} (
              {order.delivery_type === 'delivery' ? labels.delivery : labels.pickup})
            </span>
          </div>
          <div className="text-serif text-lg mt-3 text-ink-secondary">
            {labels.recipient}: {order.recipient_first_name} {order.recipient_last_name}
          </div>
        </div>
        <div className="text-right">
          <div className="text-serif text-2xl font-light">
            {formatPrice(order.total, order.currency)}
          </div>
          <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mt-2">
            {labels.viewDetails} →
          </div>
        </div>
      </div>
    </Link>
  );
}
