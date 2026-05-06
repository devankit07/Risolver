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
  const receiver = config.CONTACT_RECEIVER || 'ankit.dev600@gmail.com';

  if (!transport) {
    console.warn(`[mail] SMTP not configured — logging contact message to console for ${receiver}`);
    console.log({ senderName, senderEmail, message });
    return;
  }

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;background-color:#f9fafb;border-radius:16px;border:1px solid #f1f5f9">
      <div style="background:#4f46e5;border-radius:12px 12px 12px 12px;padding:20px 24px;margin-bottom:20px;box-shadow:0 4px 6px -1px rgba(79, 70, 229, 0.1)">
        <h2 style="margin:0;color:#fff;font-size:20px;font-weight:800">📬 New Inquiry</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">via Resolver Support Portal</p>
      </div>

      <div style="border:1px solid #e2e8f0;border-radius:12px;padding:24px;background:#fff;box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.05)">
        <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Sender Details</p>
        <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:24px">
          <tr>
            <td style="padding:4px 0;font-weight:600;width:80px;color:#64748b">Name</td>
            <td style="padding:4px 0;color:#0f172a;font-weight:700">${senderName}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-weight:600;color:#64748b">Email</td>
            <td style="padding:4px 0">
              <a href="mailto:${senderEmail}" style="color:#4f46e5;text-decoration:none;font-weight:600">${senderEmail}</a>
            </td>
          </tr>
        </table>

        <div style="height:1px;background:#f1f5f9;margin-bottom:24px"></div>

        <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Problem Description</p>
        <div style="background:#f8fafc;border-radius:12px;padding:20px;font-size:15px;line-height:1.6;white-space:pre-wrap;color:#1e293b;border:1px solid #f1f5f9">${message}</div>

        <p style="margin:32px 0 0;font-size:12px;color:#94a3b8;text-align:center;font-style:italic">
          Resolver Contact Engine · Reply directly to this email to contact the user.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transport.sendMail({
      from: `"Resolver Support" <${config.SMTP_USER.trim()}>`,
      to: receiver,
      replyTo: senderEmail,
      subject: `[Support] ${senderName} needs help`,
      html,
      text: `Name: ${senderName}\nFrom: ${senderEmail}\n\n${message}`,
    });

    console.log(`[mail] Success! Sent to ${receiver} — id: ${info.messageId}`);
  } catch (err) {
    console.error(`[mail] Failed to send email to ${receiver}:`, err.message);
    throw err;
  }
}

