import { Resend } from 'resend';
import { env } from '../config/env.js';

/**
 * Transactional email service. Uses Resend when RESEND_API_KEY is set;
 * otherwise logs the message to the console so local dev works without
 * an email provider.
 */

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function send({ to, subject, html, text }) {
  if (!resend) {
    console.log('\n────── [email:dev-console] ──────');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log('─────────────────────────────────\n');
    return { simulated: true };
  }

  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error('[email] Resend send failed:', error);
    throw new Error(error.message || 'Failed to send email');
  }
  return data;
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = 'Reset your Xavier password';
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'We received a request to reset your Xavier password.',
    'Click the link below to choose a new one. This link expires in 1 hour.',
    '',
    resetUrl,
    '',
    "If you didn't request this, you can safely ignore this email — your password won't change.",
    '',
    '— The Xavier team',
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#111;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;background:#4f46e5;border-radius:8px;display:inline-block;"></div>
          <span style="font-size:20px;font-weight:700;">Xavier</span>
        </div>
      </div>
      <h1 style="font-size:20px;margin:0 0 12px;">Reset your password</h1>
      <p style="color:#555;line-height:1.55;font-size:14px;margin:0 0 20px;">
        Hi ${escapeHtml(name || 'there')}, we received a request to reset your Xavier password.
        Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
      </p>
      <p style="margin:24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Reset password
        </a>
      </p>
      <p style="color:#888;font-size:12px;line-height:1.55;">
        Or copy this link into your browser:<br>
        <span style="word-break:break-all;color:#4f46e5;">${resetUrl}</span>
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px;">
      <p style="color:#888;font-size:12px;line-height:1.55;">
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>
    </div>
  `;

  return send({ to, subject, html, text });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
