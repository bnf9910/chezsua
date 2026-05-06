import { setRequestLocale } from 'next-intl/server';
import { redirect, notFound } from 'next/navigation';
import { Link } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Order, CartItem } from '@/lib/types';

const LABELS = {
  en: {
    title: 'Order Details',
    backToOrders: 'Back to orders',
    orderNumber: 'Order Number',
    placed: 'Placed',
    items: 'Items',
    recipient: 'Recipient',
    fulfillment: 'Fulfillment',
    deliveryDate: 'Delivery Date',
    address: 'Delivery Address',
    occasion: 'Occasion',
    cardMessage: 'Card Message',
    notes: 'Order Notes',
    payment: 'Payment',
    total: 'Total',
    delivery: 'Delivery',
    pickup: 'Pick Up',
    contactSupport: 'Need help? Contact us',
    progress: {
      received: 'Order Received',
      preparing: 'Preparing',
      shipped: 'On the Way',
      completed: 'Completed',
    },
  },
  ko: {
    title: '주문 상세',
    backToOrders: '주문 내역으로',
    orderNumber: '주문번호',
    placed: '주문일',
    items: '주문 상품',
    recipient: '수령인',
    fulfillment: '수령 방식',
    deliveryDate: '수령일',
    address: '배송지',
    occasion: '용도',
    cardMessage: '카드 메시지',
    notes: '주문 메모',
    payment: '결제 정보',
    total: '결제 금액',
    delivery: '배송',
    pickup: '픽업',
    contactSupport: '문의가 있으신가요?',
    progress: {
      received: '주문 접수',
      preparing: '준비 중',
      shipped: '배송 중',
      completed: '완료',
    },
  },
  zh: {
    title: '订单详情',
    backToOrders: '返回订单列表',
    orderNumber: '订单号',
    placed: '下单日期',
    items: '订购商品',
    recipient: '收件人',
    fulfillment: '配送方式',
    deliveryDate: '配送日期',
    address: '配送地址',
    occasion: '用途',
    cardMessage: '卡片留言',
    notes: '订单备注',
    payment: '支付信息',
    total: '总额',
    delivery: '配送',
    pickup: '自取',
    contactSupport: '需要帮助?',
    progress: {
      received: '订单接收',
      preparing: '准备中',
      shipped: '配送中',
      completed: '完成',
    },
  },
};

const PROGRESS_STEPS = ['received', 'preparing', 'shipped', 'completed'] as const;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  setRequestLocale(locale);
  const t = LABELS[locale as Locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single();

  if (!order) notFound();

  const typedOrder = order as Order;
  const items = (typedOrder.items || []) as CartItem[];
  const currentStepIdx = PROGRESS_STEPS.indexOf(typedOrder.order_status as typeof PROGRESS_STEPS[number]);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-12 py-16 max-md:px-7 max-md:py-10">
        {/* Breadcrumb */}
        <div className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-7">
          <Link href="/account" className="hover:text-ink-primary">
            Account
          </Link>{' '}
          /{' '}
          <Link href="/account/orders" className="hover:text-ink-primary">
            Orders
          </Link>{' '}
          / <span className="text-ink-primary">#{typedOrder.order_number}</span>
        </div>

        {/* Header */}
        <div className="border-b border-line pb-8 mb-12">
          <div className="text-mono text-[10px] tracking-[0.3em] uppercase text-accent-green mb-3">
            — {t.title}
          </div>
          <h1 className="text-serif text-5xl font-light italic mb-4 max-md:text-4xl">
            #{typedOrder.order_number}
          </h1>
          <div className="text-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            {t.placed}: {formatDate(typedOrder.created_at, locale as Locale)}
          </div>
        </div>

        {/* Progress timeline */}
        {typedOrder.order_status !== 'cancelled' && (
          <div className="mb-14">
            <div className="grid grid-cols-4 gap-2 max-md:grid-cols-2 max-md:gap-4">
              {PROGRESS_STEPS.map((step, idx) => {
                const completed = idx <= currentStepIdx;
                const current = idx === currentStepIdx;
                return (
                  <div key={step} className="relative">
                    <div className="flex items-center gap-3 mb-2 max-md:flex-col max-md:items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-mono text-[11px] flex-shrink-0 ${
                          completed
                            ? 'bg-accent-green text-bg-primary'
                            : 'bg-bg-secondary text-ink-muted'
                        }`}
                      >
                        {completed ? '✓' : idx + 1}
                      </div>
                      {idx < PROGRESS_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-px max-md:hidden ${
                            idx < currentStepIdx ? 'bg-accent-green' : 'bg-line'
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-mono text-[10px] tracking-[0.15em] uppercase ${
                        current
                          ? 'text-ink-primary font-medium'
                          : completed
                            ? 'text-ink-secondary'
                            : 'text-ink-muted'
                      }`}
                    >
                      {t.progress[step]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-[1fr_320px] gap-12 max-lg:grid-cols-1 max-lg:gap-8">
          {/* Left: order info */}
          <div className="space-y-10">
            {/* Items */}
            <Section title={t.items}>
              {items.length === 0 ? (
                <p className="text-ink-muted text-sm italic">—</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start gap-4 pb-4 border-b border-line-soft last:border-0"
                    >
                      <div>
                        <div className="text-serif text-lg">{item.name}</div>
                        {Object.entries(item.options || {}).length > 0 && (
                          <div className="text-mono text-[11px] text-ink-muted mt-1">
                            {Object.entries(item.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' · ')}
                          </div>
                        )}
                        <div className="text-mono text-[11px] text-ink-secondary mt-1">
                          ×{item.quantity}
                        </div>
                      </div>
                      <div className="text-mono text-sm whitespace-nowrap">
                        {formatPrice(item.price * item.quantity, typedOrder.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Recipient */}
            <Section title={t.recipient}>
              <InfoRow label={t.recipient}>
                {typedOrder.recipient_first_name} {typedOrder.recipient_last_name}
              </InfoRow>
              <InfoRow label="Phone">{typedOrder.recipient_phone}</InfoRow>
              <InfoRow label={t.fulfillment}>
                {typedOrder.delivery_type === 'delivery' ? t.delivery : t.pickup}
              </InfoRow>
              <InfoRow label={t.deliveryDate}>
                {formatDate(typedOrder.delivery_date, locale as Locale)}
              </InfoRow>
              {typedOrder.delivery_type === 'delivery' && typedOrder.shipping_address && (
                <InfoRow label={t.address}>
                  {typedOrder.shipping_address.address} {typedOrder.shipping_address.detail}
                  <br />
                  <span className="text-ink-muted text-sm">
                    {typedOrder.shipping_address.postcode}
                  </span>
                </InfoRow>
              )}
              {typedOrder.occasion && <InfoRow label={t.occasion}>{typedOrder.occasion}</InfoRow>}
              {typedOrder.card_message && (
                <InfoRow label={t.cardMessage}>
                  <em className="text-serif">{typedOrder.card_message}</em>
                </InfoRow>
              )}
              {typedOrder.order_notes && (
                <InfoRow label={t.notes}>{typedOrder.order_notes}</InfoRow>
              )}
            </Section>
          </div>

          {/* Right: payment summary */}
          <aside className="bg-bg-soft border border-line p-7 h-fit sticky top-28 max-lg:static">
            <div className="text-mono text-[10px] tracking-[0.25em] uppercase text-accent-green mb-4">
              {t.payment}
            </div>
            <div className="space-y-2 mb-6 pb-6 border-b border-line">
              <InfoRow label="Method" small>
                {typedOrder.payment_method.toUpperCase()}
              </InfoRow>
              <InfoRow label="Status" small>
                <span
                  className={`text-mono text-[11px] uppercase tracking-[0.1em] ${
                    typedOrder.payment_status === 'paid'
                      ? 'text-accent-green'
                      : typedOrder.payment_status === 'failed'
                        ? 'text-red-700'
                        : 'text-ink-muted'
                  }`}
                >
                  {typedOrder.payment_status}
                </span>
              </InfoRow>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
                {t.total}
              </span>
              <span className="text-serif text-3xl font-light">
                {formatPrice(typedOrder.total, typedOrder.currency)}
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-line">
              <Link
                href="/contact"
                className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary border-b border-line hover:text-ink-primary hover:border-ink-primary transition-colors pb-1"
              >
                {t.contactSupport} →
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-14">
          <Link
            href="/account/orders"
            className="text-mono text-[11px] tracking-[0.25em] uppercase text-ink-secondary border-b border-line hover:text-ink-primary hover:border-ink-primary transition-colors pb-1"
          >
            ← {t.backToOrders}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-mono text-[11px] tracking-[0.3em] uppercase text-accent-green mb-5 pb-3 border-b border-line">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  small,
  children,
}: {
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid ${small ? 'grid-cols-[80px_1fr]' : 'grid-cols-[140px_1fr]'} gap-3 py-2`}>
      <span className="text-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted">
        {label}
      </span>
      <span className="text-ink-primary">{children}</span>
    </div>
  );
}
