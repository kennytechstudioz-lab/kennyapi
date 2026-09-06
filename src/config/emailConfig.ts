export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
    replyTo: string;
  };
  imap: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

// Use getters so process.env is read at call time (not at import/module-init time)
// This ensures dotenv has already populated process.env before values are accessed.
export const emailConfig = {
  get smtp() {
    const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/^"|"$/g, '');
    const user = process.env.SMTP_USER || process.env.EMAIL_USER || '';
    return {
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'mail.privateemail.com',
      port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465', 10),
      secure: (process.env.SMTP_SECURE || process.env.EMAIL_SECURE || 'true').toLowerCase() === 'true',
      auth: { user, pass },
      from: process.env.EMAIL_FROM || `"Kenny Tech Studios" <${user}>`,
      replyTo: process.env.EMAIL_REPLY_TO || user,
    };
  },
  get imap() {
    const pass = (process.env.IMAP_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/^"|"$/g, '');
    const user = process.env.IMAP_USER || process.env.SMTP_USER || process.env.EMAIL_USER || '';
    return {
      host: process.env.IMAP_HOST || 'mail.privateemail.com',
      port: parseInt(process.env.IMAP_PORT || '993', 10),
      secure: (process.env.IMAP_SECURE || 'true').toLowerCase() === 'true',
      auth: { user, pass },
    };
  },
};

export default emailConfig;
