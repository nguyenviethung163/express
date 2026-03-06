import nodemailer, { SentMessageInfo } from "nodemailer";
import env from "../../configs/env";
import { getTransporter } from "../configs/nodemailer";
import { logger } from "./pino-logger";

type SendMailOptions = {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Standard utility for sending emails using the configured SMTP transporter.
 * Supports HTML and plain text content with integrated logging.
 *
 * @param options - Configuration for the email (to, subject, html, text, from).
 * @returns {Promise<SentMessageInfo>} The nodemailer send info object.
 * @throws {Error} If the email fails to send.
 */
export async function sendEmail({
  from,
  to,
  subject,
  html,
  text
}: SendMailOptions): Promise<SentMessageInfo> {
  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: from || env.EMAIL_FROM || "noreply@dmstudio.com",
      to,
      subject,
      html,
      text
    });

    logger.info({ messageId: info.messageId, to }, "Email sent successfully");
    return info;
  } catch (error) {
    logger.error({ error, to, subject }, "Failed to send email");
    throw new Error("Failed to send email");
  }
}
