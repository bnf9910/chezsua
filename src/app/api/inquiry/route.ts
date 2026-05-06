import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getResend } from '@/lib/resend';
import { createClient } from '@/lib/supabase/server';

const InquirySchema = z.object({
  company: z.string().optional(),
  name: z.string().min(1).max(100),
  type: z.string().min(1),
  budget: z.string().optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = InquirySchema.parse(body);

    // 1. DB에 저장
    try {
      const supabase = await createClient();
      await supabase.from('project_inquiries').insert({
        company_name: data.company || null,
        contact_name: data.name,
        contact_email: null,
        project_type: data.type,
        budget: data.budget || null,
        message: data.message,
        status: 'new',
      });
    } catch (dbErr) {
      console.error('[inquiry] DB save failed:', dbErr);
      // DB 실패해도 이메일은 시도
    }

    // 2. 이메일 발송
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = getResend();
        await resend.emails.send({
          from: process.env.INQUIRY_FROM_EMAIL || 'noreply@chezsua.com',
          to: process.env.INQUIRY_TO_EMAIL || 'chezsuaflower@gmail.com',
          subject: `[Chezsua] New Inquiry — ${data.type} from ${data.name}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2D3F2E; border-bottom: 1px solid #C4D0C0; padding-bottom: 16px;">New Project Inquiry</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6B7068; width: 120px;">Company</td><td style="color: #1A1F1B;">${data.company || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B7068;">Name</td><td style="color: #1A1F1B;">${data.name}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B7068;">Type</td><td style="color: #1A1F1B;">${data.type}</td></tr>
                <tr><td style="padding: 8px 0; color: #6B7068;">Budget</td><td style="color: #1A1F1B;">${data.budget || '—'}</td></tr>
              </table>
              <h3 style="color: #2D3F2E; margin-top: 32px;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #3A3F3A;">${data.message}</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error('[inquiry] email send failed:', mailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[inquiry] error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
