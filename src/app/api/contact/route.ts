import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  formType: z.enum(['kontakt', 'aterforsaljare']).default('kontakt'),
  name: z.string().trim().min(1, 'Namn krävs').max(150),
  email: z.string().trim().email('Ogiltig e-postadress').max(200),
  phone: z.string().trim().min(1, 'Telefonnummer krävs').max(60),
  company: z.string().trim().max(150).optional().default(''),
  orgnr: z.string().trim().max(60).optional().default(''),
  address: z.string().trim().max(200).optional().default(''),
  zip: z.string().trim().max(30).optional().default(''),
  city: z.string().trim().max(100).optional().default(''),
  businessType: z.string().trim().max(100).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  website: z.string().optional().default(''), // Honeypot field
});

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  butik: 'Dagligvaruhandel / Butik',
  restaurang: 'Restaurang / Café',
  grossist: 'Grossist',
  annat: 'Annat',
};

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildRow(label: string, value?: string): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 170px; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeHtml(value)}</td>
    </tr>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalize "contact" field from aterforsaljare form to "name"
    const normalizedInput = {
      formType: body.formType === 'aterforsaljare' ? 'aterforsaljare' : 'kontakt',
      name: body.name || body.contact || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      orgnr: body.orgnr || '',
      address: body.address || '',
      zip: body.zip || '',
      city: body.city || '',
      businessType: body.businessType || body.type || '',
      message: body.message || '',
      website: body.website || '',
    };

    // Silently accept honeypot submissions from bots
    if (normalizedInput.website && normalizedInput.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const parsed = contactSchema.safeParse(normalizedInput);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Ogiltiga fält i formuläret';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'E-posttjänsten är inte konfigurerad ännu.' },
        { status: 500 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'info@mathornet.se';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Mathörnet <noreply@mathornet.se>';

    const isReseller = data.formType === 'aterforsaljare';
    const heading = isReseller ? 'Ny återförsäljarförfrågan' : 'Ny kontaktförfrågan';
    const subject = isReseller
      ? `Ny återförsäljarförfrågan: ${data.company || data.name}`
      : `Ny kontaktförfrågan från ${data.name}${data.company ? ` (${data.company})` : ''}`;

    const fullAddress = [data.address, [data.zip, data.city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ');

    const businessTypeLabel = data.businessType
      ? BUSINESS_TYPE_LABELS[data.businessType] || data.businessType
      : '';

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #64b000; padding: 24px 28px; color: #ffffff;">
          <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.9;">Mathörnet.se</p>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700;">${escapeHtml(heading)}</h1>
        </div>
        <div style="padding: 24px 28px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            ${buildRow('Kontaktperson', data.name)}
            ${buildRow('Företag', data.company)}
            ${buildRow('Org.nummer', data.orgnr)}
            ${buildRow('E-post', data.email)}
            ${buildRow('Telefon', data.phone)}
            ${buildRow('Verksamhetstyp', businessTypeLabel)}
            ${buildRow('Adress', fullAddress)}
          </table>
          ${
            data.message
              ? `
          <div style="margin-top: 22px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px; color: #374151;">Meddelande:</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; white-space: pre-wrap; line-height: 1.6; font-size: 15px; color: #111827;">${escapeHtml(data.message)}</div>
          </div>`
              : ''
          }
          <p style="margin: 24px 0 0 0; font-size: 12px; color: #6b7280;">
            Tips: Klicka på "Svara" i ditt mejlprogram för att svara direkt till ${escapeHtml(data.email)}.
          </p>
        </div>
      </div>
    `;

    const textLines = [
      heading,
      '------------------------',
      `Kontaktperson: ${data.name}`,
      data.company ? `Företag: ${data.company}` : '',
      data.orgnr ? `Org.nummer: ${data.orgnr}` : '',
      `E-post: ${data.email}`,
      `Telefon: ${data.phone}`,
      businessTypeLabel ? `Verksamhetstyp: ${businessTypeLabel}` : '',
      fullAddress ? `Adress: ${fullAddress}` : '',
      data.message ? `\nMeddelande:\n${data.message}` : '',
    ].filter(Boolean);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject,
        html,
        text: textLines.join('\n'),
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error('Resend API error:', resendRes.status, errBody);
      return NextResponse.json(
        { error: 'Kunde inte skicka meddelandet just nu. Försök igen senare.' },
        { status: 502 }
      );
    }

    const result = await resendRes.json();
    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod. Försök igen senare.' },
      { status: 500 }
    );
  }
}
