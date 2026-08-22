import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'appalachiangrowth@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || RECIPIENT_EMAIL,
    pass: process.env.SMTP_PASS || '',
  },
});

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  platform?: string | null;
  message: string;
}

function serviceLabel(value: string | null | undefined): string {
  if (!value) return 'Not specified';
  const map: Record<string, string> = {
    shopify: 'Shopify Store',
    wordpress: 'WordPress Store',
    redesign: 'Store Redesign',
    seo: 'SEO',
    marketing: 'Digital Marketing',
    other: 'Other',
  };
  return map[value] || value;
}

function platformLabel(value: string | null | undefined): string {
  if (!value) return 'Not specified';
  const map: Record<string, string> = {
    shopify: 'Shopify',
    wordpress: 'WordPress/WooCommerce',
    'not-sure': 'Not Sure',
  };
  return map[value] || value;
}

export async function sendContactNotification(data: ContactEmailData) {
  if (!process.env.SMTP_PASS) {
    console.warn('[Email] SMTP_PASS not configured — skipping email notification');
    return;
  }

  const subject = `New Contact Form Submission from ${data.name}`;

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 12px; overflow: hidden; border: 1px solid rgba(182,255,0,0.15);">
      <div style="background: linear-gradient(135deg, #0a0a0a 0%, #111 100%); padding: 32px 24px; border-bottom: 1px solid rgba(182,255,0,0.1);">
        <h1 style="color: #B6FF00; font-size: 22px; margin: 0 0 8px 0;">New Contact Form Submission</h1>
        <p style="color: #888; font-size: 14px; margin: 0;">Appalachian Growth Solutions — Website</p>
      </div>
      <div style="padding: 24px; background: #0f0f0f;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); width: 130px; vertical-align: top;">Name</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Email</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;"><a href="mailto:${data.email}" style="color: #B6FF00; text-decoration: none;">${data.email}</a></td>
          </tr>
          ${data.phone ? `<tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Phone</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${data.phone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Service</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${serviceLabel(data.service)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Platform</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${platformLabel(data.platform)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #ddd; line-height: 1.6; white-space: pre-wrap;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 24px; background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="color: #555; font-size: 12px; margin: 0;">This email was sent from the Appalachian Growth Solutions contact form.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Appalachian Growth Solutions" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
      to: RECIPIENT_EMAIL,
      replyTo: data.email,
      subject,
      html: htmlBody,
    });
    console.log('[Email] Contact notification sent to', RECIPIENT_EMAIL);
  } catch (error) {
    console.error('[Email] Failed to send notification:', error);
  }
}
