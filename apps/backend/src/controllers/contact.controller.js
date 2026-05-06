import { sendResponse } from '../utils/response.js';
import { sendContactMail } from '../services/mail.service.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;
  console.log(`[contact] Received inquiry from ${name} (${email})`);

  try {
    await sendContactMail({ senderName: name, senderEmail: email, message });
    sendResponse(res, 200, true, 'Message sent successfully');
  } catch (err) {
    console.error('[contact] critical failure:', err);
    
    // Return a slightly more helpful message if SMTP is the bottleneck
    let userMsg = 'Failed to send message. Our team has been notified in logs.';
    if (err.message?.includes('auth') || err.message?.includes('SMTP')) {
      userMsg = 'Service is currently unable to send emails. Please contact us at support@resolver.local';
    }

    sendResponse(res, 500, false,
      process.env.NODE_ENV === 'development'
        ? `Mail error: ${err.message}`
        : userMsg
    );
  }
};
