import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifyNewOrder } from '@/lib/kakao-alimtalk';

/**
 * 포트원 v2 결제 웹훅
 * https://developers.portone.io/docs/ko/v2-payment/webhook
 *
 * 헤더 'webhook-id', 'webhook-timestamp', 'webhook-signature' 검증 필요 (실제 운영시)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 포트원 웹훅 페이로드 형식
    // {
    //   type: 'Transaction.Paid',
    //   data: { paymentId: '...', transactionId: '...' }
    // }
    const eventType = body.type;
    const paymentId = body.data?.paymentId; // 우리가 보낸 order_number와 동일

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: 'Missing paymentId' }, { status: 400 });
    }

    const supabase = await createClient();

    if (eventType === 'Transaction.Paid') {
      // 1. 주문 상태 업데이트
      const { data: order, error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('order_number', paymentId)
        .select()
        .single();

      if (error) {
        console.error('[webhook] order update failed:', error);
        return NextResponse.json({ ok: false }, { status: 500 });
      }

      // 2. 카카오 알림톡 발송 (관리자에게 새 주문 알림)
      if (order) {
        await notifyNewOrder({
          order_number: order.order_number,
          recipient: `${order.recipient_first_name} ${order.recipient_last_name}`,
          fulfillment: order.delivery_type,
          delivery_date: order.delivery_date,
          total: order.total,
        });
      }

      return NextResponse.json({ ok: true });
    }

    if (eventType === 'Transaction.Failed' || eventType === 'Transaction.Cancelled') {
      await supabase
        .from('orders')
        .update({
          payment_status: eventType === 'Transaction.Failed' ? 'failed' : 'refunded',
        })
        .eq('order_number', paymentId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: true });
  } catch (err) {
    console.error('[webhook] error:', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
