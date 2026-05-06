/**
 * 카카오 알림톡 발송 (솔라피/알리고/네이버클라우드 등 호환)
 *
 * 알림톡 템플릿은 카카오 비즈니스 채널에 사전 등록 후 승인되어야 함.
 * 환경변수:
 *   KAKAO_BIZ_PROVIDER (solapi | aligo | ncloud_sens)
 *   KAKAO_BIZ_API_KEY
 *   KAKAO_BIZ_API_SECRET
 *   KAKAO_BIZ_PFID  (카카오 비즈니스 채널 ID)
 *   KAKAO_BIZ_TEMPLATE_NEW_ORDER  (템플릿 코드)
 *   ADMIN_PHONE_NUMBER (관리자 휴대폰 번호 - "01012345678" 형식)
 */

interface KakaoAlimtalkPayload {
  to: string;
  templateCode: string;
  variables: Record<string, string>;
  failoverSms?: string;
}

export async function sendKakaoAlimtalk(payload: KakaoAlimtalkPayload): Promise<boolean> {
  const provider = process.env.KAKAO_BIZ_PROVIDER || 'solapi';

  if (!process.env.KAKAO_BIZ_API_KEY || !process.env.KAKAO_BIZ_API_SECRET) {
    console.warn('[kakao-alimtalk] credentials not set, skipping');
    return false;
  }

  try {
    if (provider === 'solapi') return await sendViaSolapi(payload);
    if (provider === 'aligo') return await sendViaAligo(payload);
    if (provider === 'ncloud_sens') return await sendViaSens(payload);
    console.error(`[kakao-alimtalk] unknown provider: ${provider}`);
    return false;
  } catch (err) {
    console.error('[kakao-alimtalk] send failed:', err);
    return false;
  }
}

/**
 * 솔라피 (https://solapi.com)
 */
async function sendViaSolapi(payload: KakaoAlimtalkPayload): Promise<boolean> {
  const apiKey = process.env.KAKAO_BIZ_API_KEY!;
  const apiSecret = process.env.KAKAO_BIZ_API_SECRET!;
  const pfId = process.env.KAKAO_BIZ_PFID!;

  const date = new Date().toISOString();
  const salt = Math.random().toString(36).slice(2, 14);
  // HMAC-SHA256 signature - 실제 운영시 crypto 모듈로 대체
  const signature = `${date}${salt}`;

  const body = {
    message: {
      to: payload.to,
      from: process.env.KAKAO_BIZ_SENDER_PHONE,
      kakaoOptions: {
        pfId,
        templateId: payload.templateCode,
        variables: payload.variables,
      },
      ...(payload.failoverSms ? { autoTypeDetect: false, type: 'ATA' } : {}),
    },
  };

  const res = await fetch('https://api.solapi.com/messages/v4/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

/**
 * 알리고 (https://smartsms.aligo.in)
 */
async function sendViaAligo(payload: KakaoAlimtalkPayload): Promise<boolean> {
  const params = new URLSearchParams({
    apikey: process.env.KAKAO_BIZ_API_KEY!,
    userid: process.env.KAKAO_BIZ_API_SECRET!,
    senderkey: process.env.KAKAO_BIZ_PFID!,
    tpl_code: payload.templateCode,
    sender: process.env.KAKAO_BIZ_SENDER_PHONE || '',
    receiver_1: payload.to,
    subject_1: 'Chezsua',
    message_1: substituteTemplate(payload.variables),
    failover: payload.failoverSms ? 'Y' : 'N',
    fsubject_1: 'Chezsua',
    fmessage_1: payload.failoverSms || '',
  });

  const res = await fetch('https://kakaoapi.aligo.in/akv10/alimtalk/send/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return res.ok;
}

/**
 * 네이버 클라우드 SENS Biz Message (https://www.ncloud.com)
 */
async function sendViaSens(payload: KakaoAlimtalkPayload): Promise<boolean> {
  const serviceId = process.env.KAKAO_BIZ_API_KEY!;
  const accessKey = process.env.KAKAO_BIZ_API_SECRET!;

  const body = {
    plusFriendId: process.env.KAKAO_BIZ_PFID,
    templateCode: payload.templateCode,
    messages: [
      {
        to: payload.to,
        content: substituteTemplate(payload.variables),
      },
    ],
  };

  const res = await fetch(
    `https://sens.apigw.ntruss.com/alimtalk/v2/services/${serviceId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-apigw-timestamp': String(Date.now()),
        'x-ncp-iam-access-key': accessKey,
      },
      body: JSON.stringify(body),
    }
  );
  return res.ok;
}

function substituteTemplate(vars: Record<string, string>): string {
  let template = `[Chezsua] 새 주문이 접수되었습니다.

주문번호: #{order_number}
수령인: #{recipient}
방식: #{fulfillment}
일시: #{date}
금액: #{amount}원

관리자 페이지에서 확인하세요.`;
  for (const [k, v] of Object.entries(vars)) {
    template = template.replaceAll(`#{${k}}`, v);
  }
  return template;
}

/**
 * 새 주문 알림 발송 (high-level helper)
 */
export async function notifyNewOrder(order: {
  order_number: string;
  recipient: string;
  fulfillment: 'delivery' | 'pickup';
  delivery_date: string;
  total: number;
}) {
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  if (!adminPhone) {
    console.warn('[notifyNewOrder] ADMIN_PHONE_NUMBER not set');
    return false;
  }

  return sendKakaoAlimtalk({
    to: adminPhone,
    templateCode: process.env.KAKAO_BIZ_TEMPLATE_NEW_ORDER || 'NEW_ORDER',
    variables: {
      order_number: order.order_number,
      recipient: order.recipient,
      fulfillment: order.fulfillment === 'delivery' ? '배송' : '픽업',
      date: order.delivery_date,
      amount: order.total.toLocaleString('ko-KR'),
    },
    failoverSms: `[Chezsua] 새 주문 #${order.order_number} (${order.recipient}, ${order.total.toLocaleString('ko-KR')}원)`,
  });
}
