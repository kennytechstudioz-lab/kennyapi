import { Request, Response } from 'express';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import EmailMessage, { IEmailMessage } from '../models/EmailMessage';
import emailConfig from '../config/emailConfig';
import { sendMail } from '../utils/emailService';

/**
 * Connects to Webmail IMAP server, downloads recent incoming emails,
 * parses them, and saves/updates them in the MongoDB database.
 */
export const syncIncomingEmails = async (req: Request, res: Response) => {
  const imapHost = emailConfig.imap.host;
  const imapUser = emailConfig.imap.auth.user;
  const imapPass = emailConfig.imap.auth.pass;

  // Check if credentials are missing or placeholder
  if (!imapPass || imapPass === 'your_webmail_password' || !imapUser || imapUser === 'info@yourdomain.com') {
    const unreadCount = await EmailMessage.countDocuments({ folder: 'inbox', isRead: false });
    const totalDocs = await EmailMessage.countDocuments({ folder: 'inbox' });
    return res.json({
      success: false,
      status: 'unconfigured',
      message: 'Webmail credentials not yet configured. Please enter your webmail password in api/.env (IMAP_PASS & SMTP_PASS).',
      unreadCount,
      totalDocs,
    });
  }
  const client = new ImapFlow({
    host: imapHost,
    port: emailConfig.imap.port,
    secure: emailConfig.imap.secure,
    auth: {
      user: imapUser,
      pass: imapPass,
    },
    logger: false,
  });

  let syncedCount = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');

    try {
      const status = await client.status('INBOX', { messages: true, unseen: true });
      const totalMessages = status.messages || 0;

      if (totalMessages > 0) {
        // Fetch the last 40 messages to keep sync fast and responsive
        const rangeStart = Math.max(1, totalMessages - 39);
        const fetchRange = `${rangeStart}:*`;

        for await (const message of client.fetch(fetchRange, {
          uid: true,
          flags: true,
          envelope: true,
          source: true,
        })) {
          try {
            if (!message.source) continue;
            const parsed: any = await simpleParser(message.source);
            const msgId = parsed.messageId || `msg_${message.uid}_${message.envelope?.date?.getTime() || Date.now()}`;
            
            const fromAddress = parsed.from?.value?.[0]?.address || message.envelope?.from?.[0]?.address || 'unknown@sender.com';
            const fromName = parsed.from?.value?.[0]?.name || message.envelope?.from?.[0]?.name || '';
            const toRaw = parsed.to ? (Array.isArray(parsed.to) ? parsed.to : [parsed.to]) : [];
            const toAddresses: string[] = toRaw.flatMap((t: any) =>
              Array.isArray(t.value)
                ? t.value.map((v: any) => v.address).filter(Boolean)
                : []
            );
            
            const subject = parsed.subject || message.envelope?.subject || '(No Subject)';
            const bodyText = parsed.text || '';
            const bodyHtml = (typeof parsed.html === 'string' ? parsed.html : parsed.textAsHtml) || bodyText;
            const msgDate = parsed.date || message.envelope?.date || new Date();
            const isSeen = message.flags ? message.flags.has('\\Seen') : false;

            // Upsert email into MongoDB
            await EmailMessage.findOneAndUpdate(
              { messageId: msgId },
              {
                messageId: msgId,
                uid: message.uid,
                from: fromAddress,
                fromName: fromName,
                to: toAddresses.length > 0 ? toAddresses : [imapUser],
                subject,
                bodyText,
                bodyHtml,
                date: msgDate,
                isRead: isSeen,
                folder: 'inbox',
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            syncedCount++;
          } catch (parseErr) {
            console.error('Error parsing single message stream:', parseErr);
          }
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();

    const unreadCount = await EmailMessage.countDocuments({ folder: 'inbox', isRead: false });
    const totalDocs = await EmailMessage.countDocuments({ folder: 'inbox' });

    res.json({
      success: true,
      status: 'connected',
      message: `Successfully synced ${syncedCount} incoming messages from Webmail`,
      syncedCount,
      unreadCount,
      totalDocs,
    });
  } catch (error: any) {
    console.error('IMAP synchronization error:', error?.message || error);
    try {
      await client.logout();
    } catch (_) {}

    const unreadCount = await EmailMessage.countDocuments({ folder: 'inbox', isRead: false });
    const totalDocs = await EmailMessage.countDocuments({ folder: 'inbox' });

    res.json({
      success: false,
      status: 'error',
      message: error?.message || 'Failed to connect to IMAP server',
      unreadCount,
      totalDocs,
    });
  }
};

/**
 * Get emails with filtering by folder, search, and pagination.
 */
export const getEmails = async (req: Request, res: Response) => {
  try {
    const { folder = 'inbox', search = '', page = '1', limit = '30', unreadOnly = 'false' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 30);
    const skip = (pageNum - 1) * limitNum;

    const query: any = { folder };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      query.$or = [
        { subject: { $regex: term, $options: 'i' } },
        { from: { $regex: term, $options: 'i' } },
        { fromName: { $regex: term, $options: 'i' } },
        { bodyText: { $regex: term, $options: 'i' } },
      ];
    }

    const [docs, totalDocs, unreadCount] = await Promise.all([
      EmailMessage.find(query).sort({ date: -1 }).skip(skip).limit(limitNum),
      EmailMessage.countDocuments(query),
      EmailMessage.countDocuments({ folder: 'inbox', isRead: false }),
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum) || 1;

    res.json({
      docs,
      totalDocs,
      totalPages,
      page: pageNum,
      limit: limitNum,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching emails' });
  }
};

/**
 * Get single email by ID and mark as read.
 */
export const getEmailById = async (req: Request, res: Response) => {
  try {
    const email = await EmailMessage.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (!email.isRead) {
      email.isRead = true;
      await email.save();
    }

    res.json(email);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching email' });
  }
};

/**
 * Send an email reply via SMTP and store the outgoing message in 'sent'.
 */
export const replyEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, body, inReplyTo, emailId } = req.body;

    if (!to || !body) {
      return res.status(400).json({ message: 'Recipient (to) and body are required' });
    }

    const replySubject = subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`;

    // Send via SMTP
    const mailResult = await sendMail({
      to,
      subject: replySubject,
      html: body,
      text: body.replace(/<[^>]*>?/gm, ''),
    });

    // Save outgoing email into database in 'sent' folder
    const sentEmail = new EmailMessage({
      messageId: mailResult?.messageId || `sent_${Date.now()}`,
      from: emailConfig.smtp.from,
      fromName: 'Kenny Tech Support',
      to: Array.isArray(to) ? to : [to],
      subject: replySubject,
      bodyHtml: body,
      bodyText: body.replace(/<[^>]*>?/gm, ''),
      date: new Date(),
      isRead: true,
      folder: 'sent',
      inReplyTo: inReplyTo || '',
    });

    await sentEmail.save();

    // Mark original email as read if emailId is passed
    if (emailId) {
      await EmailMessage.findByIdAndUpdate(emailId, { isRead: true });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully via webmail!',
      sentEmail,
    });
  } catch (error: any) {
    console.error('Error sending email reply:', error);
    res.status(500).json({ message: error.message || 'Failed to send reply' });
  }
};

/**
 * Send a brand new compose email via SMTP and save to 'sent'.
 */
export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, body, bcc } = req.body;

    if (!to || !body) {
      return res.status(400).json({ message: 'Recipient (to) and body are required' });
    }

    const mailResult = await sendMail({
      to,
      subject: subject || '(No Subject)',
      html: body,
      text: body.replace(/<[^>]*>?/gm, ''),
      bcc,
    });

    const sentEmail = new EmailMessage({
      messageId: mailResult?.messageId || `sent_${Date.now()}`,
      from: emailConfig.smtp.from,
      fromName: 'Kenny Tech Studios',
      to: Array.isArray(to) ? to : [to],
      subject: subject || '(No Subject)',
      bodyHtml: body,
      bodyText: body.replace(/<[^>]*>?/gm, ''),
      date: new Date(),
      isRead: true,
      folder: 'sent',
    });

    await sentEmail.save();

    res.json({
      success: true,
      message: 'Email sent successfully via webmail!',
      sentEmail,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: error.message || 'Failed to send email' });
  }
};

/**
 * Toggle read/unread status.
 */
export const toggleRead = async (req: Request, res: Response) => {
  try {
    const { isRead } = req.body;
    const email = await EmailMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );
    if (!email) return res.status(404).json({ message: 'Email not found' });
    res.json(email);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating status' });
  }
};

/**
 * Delete email (move to trash or permanently remove).
 */
export const deleteEmail = async (req: Request, res: Response) => {
  try {
    const email = await EmailMessage.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (email.folder === 'trash') {
      await EmailMessage.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Email permanently deleted' });
    } else {
      email.folder = 'trash';
      await email.save();
      return res.json({ success: true, message: 'Email moved to trash', email });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting email' });
  }
};
