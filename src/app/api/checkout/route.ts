import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

const CheckoutSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fulfillment: z.enum(['delivery', 'pickup']),
  phone: z.string().min(1),
  deliveryDate: z.string().min(1),
  occasion: z.string().optional(),
  cardMessage: z.string().optional(),
  orderNotes: z.string().optional(),
  postcode: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  paymentMethod: z.enum(['card', 'naverpay', 'kakaopay', 'paypal', 'alipay', 'transfer']),
  locale: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CheckoutSchema.parse(body);

    const orderNumber = generateOrderNumber();

    // 1. DB에 주문 생성 (status: pending)
    try {
      const supabase = await createClient();
      await supabase.from('orders').insert({
        order_number: orderNumber,
        recipient_first_name: data.firstName,
        recipient_last_name: data.lastName,
        recipient_phone: data.phone,
        delivery_type: data.fulfillment,
        delivery_date: data.deliveryDate,
        occasion: data.occasion || null,
        card_message: data.cardMessage || null,
        order_notes: data.orderNotes || null,
        shipping_address:
          data.fulfillment === 'delivery'
            ? {
                postcode: data.postcode,
                address: data.address,
                detail: data.addressDetail,
              }
            : null,
        items: [], // TODO: 카트 상태에서 가져오기
        total: 0,
        currency: data.locale === 'ko' ? 'KRW' : 'USD',
        payment_method: data.paymentMethod,
        payment_status: 'pending',
        order_status: 'received',
      });
    } catch (dbErr) {
      console.error('[checkout] DB save failed:', dbErr);
    }

    // 2. 포트원 v2 결제 정보 반환 (실제 결제는 클라이언트 SDK가 처리)
    return NextResponse.json({
      ok: true,
      orderNumber,
      portoneConfig: {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
        paymentId: orderNumber,
        orderName: 'Chezsua Order',
      },
      message: '주문이 생성되었습니다. 결제를 진행해주세요.',
    });
  } catch (err) {
    console.error('[checkout] error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
