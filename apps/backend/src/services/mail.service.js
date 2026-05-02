import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

let _transport = null;

function getTransport() {
  if (!config.SMTP_USER?.trim() || !config.SMTP_PASS?.trim()) {
    return null;
  }
  if (_transport) return _transport;

  _transport = nodemailer.createTransport({
    host: config.SMTP_HOST || 'smtp.gmail.com',
    port: Number(config.SMTP_PORT) || 587,
    secure: false,          // STARTTLS on 587
    auth: {
      user: config.SMTP_USER.trim(),
      pass: config.SMTP_PASS.trim(),
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10_000,
    greetingTimeout:   8_000,
    socketTimeout:     10_000,
  });

  return _transport;
}

export async function sendContactMail({ senderName, senderEmail, message }) {
  const transport = getTransport();

  if (!transport) {
    console.warn('[mail] SMTP not configured — logging contact to console');
    console.log({ senderName, senderEmail, message });
    return;
  }

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
      <div style="background:#4f46e5;border-radius:12px 12px 0 0;padding:20px 24px">
        <h2 style="margin:0;color:#fff;font-size:18px;font-weight:700">📬 New Contact Form Message</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px">via Resolver Website</p>
      </div>

      <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px;background:#fff">
        <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:20px">
          <tr>
            <td style="padding:8px 0;font-weight:600;width:110px;color:#64748b;vertical-align:top">Name</td>
            <td style="padding:8px 0;color:#0f172a">${senderName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:600;color:#64748b;vertical-align:top">From</td>
            <td style="padding:8px 0">
              <a href="mailto:${senderEmail}" style="color:#4f46e5;text-decoration:none">${senderEmail}</a>
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #f1f5f9;margin:0 0 20px"/>

        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Message</p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#1e293b">${message}</div>

        <p style="margin:24px 0 0;font-size:11px;color:#94a3b8;text-align:center">
          Resolver Contact Form · <a href="mailto:${senderEmail}" style="color:#6366f1">Reply directly to ${senderEmail}</a>
        </p>
      </div>
    </div>
  `;

  const info = await transport.sendMail({
    from: `"Resolver Contact" <${config.SMTP_USER.trim()}>`,
    to: config.CONTACT_RECEIVER,
    replyTo: senderEmail,
    subject: `[Resolver] New message from ${senderName}`,
    html,
    text: `Name: ${senderName}\nFrom: ${senderEmail}\n\n${message}`,
  });

  console.log(`[mail] Sent to ${config.CONTACT_RECEIVER} — id: ${info.messageId} response: ${info.response}`);
}
