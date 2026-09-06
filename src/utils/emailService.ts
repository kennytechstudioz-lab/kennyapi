import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { emailConfig } from '../config/emailConfig';

let transporter: Transporter | null = null;

export const getMailTransporter = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass,
      },
    });
  }
  return transporter;
};

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  bcc?: string | string[];
}

export const sendMail = async (options: SendMailOptions) => {
  const mailer = getMailTransporter();
  const mailOptions = {
    from: emailConfig.smtp.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo || emailConfig.smtp.replyTo,
    bcc: options.bcc,
  };

  return await mailer.sendMail(mailOptions);
};

export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    const mailer = getMailTransporter();
    await mailer.verify();
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
};
