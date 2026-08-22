import nodemailer from 'nodemailer';

const DEFAULT_RECIPIENT_EMAIL = 'appalachiangrowth@gmail.com';

function getEmailConfig() {
  const user = process.env.SMTP_USER?.trim() || DEFAULT_RECIPIENT_EMAIL;
  const recipient = process.env.CONTACT_EMAIL?.trim() || DEFAULT_RECIPIENT_EMAIL;
  const pass = process.env.SMTP_PASS?.trim() || '';

  return { user, recipient, pass };
}

function getTransporter(user: string, pass: string) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character] ?? character;
  });
}

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

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const { user, recipient, pass } = getEmailConfig();

  if (!pass) {
    console.warn('[Email] SMTP_PASS not configured — skipping email notification');
    return false;
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : '';
  const safeService = escapeHtml(serviceLabel(data.service));
  const safePlatform = escapeHtml(platformLabel(data.platform));
  const safeMessage = escapeHtml(data.message);
  const subjectName = data.name.replace(/[\r\n]+/g, ' ').trim();
  const subject = `New Contact Form Submission from ${subjectName}`;

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
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Email</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;"><a href="mailto:${safeEmail}" style="color: #B6FF00; text-decoration: none;">${safeEmail}</a></td>
          </tr>
          ${data.phone ? `<tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Phone</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${safePhone}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Service</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${safeService}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">Platform</td>
            <td style="padding: 12px 0; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: 500;">${safePlatform}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #ddd; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 24px; background: #0a0a0a; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="color: #555; font-size: 12px; margin: 0;">This email was sent from the Appalachian Growth Solutions contact form.</p>
      </div>
    </div>
  `;

  try {
    await getTransporter(user, pass).sendMail({
      from: `"Appalachian Growth Solutions" <${user}>`,
      to: recipient,
      replyTo: data.email,
      subject,
      html: htmlBody,
    });
    console.log('[Email] Contact notification sent to', recipient);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send notification:', error);
    return false;
  }
}
