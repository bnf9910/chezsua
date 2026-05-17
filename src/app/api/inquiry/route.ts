import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company,
      name,
      email,
      phone,
      type,
      budget,
      message,
    } = body;

    // 필수 필드 체크
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 1. DB에 문의 저장
    const supabase = await createClient();
    const { error: dbError } = await supabase.from('project_inquiries').insert({
      company: company || null,
      name,
      email,
      phone: phone || null,
      type: type || null,
      budget: budget || null,
      message,
      status: 'new',
    });

    if (dbError) {
      console.error('[inquiry] db error:', dbError);
      // DB 저장 실패해도 이메일은 보내기 시도
    }

    // 2. Resend로 이메일 발송
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.INQUIRY_TO_EMAIL || 'chezsuaflower@gmail.com';
    const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'onboarding@resend.dev';

    if (!resendApiKey) {
      console.error('[inquiry] RESEND_API_KEY not set');
      return NextResponse.json({
        ok: true,
        warning: 'Inquiry saved but email not sent (Resend not configured)',
      });
    }

    // 이메일 본문 HTML
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Georgia', serif; background: #F1F5EF; color: #1A1F1B; padding: 40px 20px; }
  .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
  .header { text-align: center; border-bottom: 2px solid #2D3F2E; padding-bottom: 20px; margin-bottom: 30px; }
  .logo { font-size: 24px; letter-spacing: 0.3em; color: #2D3F2E; }
  .label { font-family: monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7068; margin-top: 20px; }
  .value { font-size: 15px; color: #1A1F1B; margin-top: 4px; }
  .message { background: #F1F5EF; padding: 20px; margin-top: 24px; border-left: 3px solid #2D3F2E; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #D2DCCE; font-size: 12px; color: #6B7068; text-align: center; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CHEZSUA</div>
      <div style="font-family: monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #6B7068; margin-top: 8px;">
        New Project Inquiry
      </div>
    </div>

    ${company ? `<div class="label">Company</div><div class="value">${escapeHtml(company)}</div>` : ''}
    
    <div class="label">Name</div>
    <div class="value">${escapeHtml(name)}</div>

    <div class="label">Email</div>
    <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>

    ${phone ? `<div class="label">Phone</div><div class="value">${escapeHtml(phone)}</div>` : ''}
    
    ${type ? `<div class="label">Type</div><div class="value">${escapeHtml(type)}</div>` : ''}
    
    ${budget ? `<div class="label">Budget</div><div class="value">${escapeHtml(budget)}</div>` : ''}

    <div class="label">Message</div>
    <div class="message">${escapeHtml(message).replace(/\n/g, '<br>')}</div>

    <div class="footer">
      이 메일은 CHEZSUA 웹사이트의 Project Inquiry 폼을 통해 전송되었습니다.<br>
      답신은 ${escapeHtml(email)} 로 보내주세요.
    </div>
  </div>
</body>
</html>
    `.trim();

    // 텍스트 버전
    const textBody = `
New Project Inquiry — CHEZSUA

${company ? `Company: ${company}\n` : ''}Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}${type ? `Type: ${type}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}

Message:
${message}

---
Sent from chezsua.com Project Inquiry form
Reply to: ${email}
    `.trim();

    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `[CHEZSUA Inquiry] ${name}${company ? ` · ${company}` : ''}`,
          html: htmlBody,
          text: textBody,
        }),
      });

      if (!resendRes.ok) {
        const errData = await resendRes.json().catch(() => ({}));
        console.error('[inquiry] resend error:', errData);
        return NextResponse.json({
          ok: true,
          warning: 'Inquiry saved but email failed',
          details: errData,
        });
      }

      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error('[inquiry] resend exception:', err);
      return NextResponse.json({
        ok: true,
        warning: 'Inquiry saved but email failed',
      });
    }
  } catch (err) {
    console.error('[inquiry] exception:', err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
