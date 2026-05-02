import { sendResponse } from '../utils/response.js';
import { sendContactMail } from '../services/mail.service.js';

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendContactMail({ senderName: name, senderEmail: email, message });
    sendResponse(res, 200, true, 'Message sent successfully');
  } catch (err) {
    console.error('[contact] sendMail failed:', err.message);
    // Return the real error in dev so we can debug
    sendResponse(res, 500, false,
      process.env.NODE_ENV === 'development'
        ? `Mail error: ${err.message}`
        : 'Failed to send message. Please try again.'
    );
  }
};
