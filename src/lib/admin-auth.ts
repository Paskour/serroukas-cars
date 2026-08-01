import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";

// In-memory challenge store for 2FA OTP verification codes (5 minute expiration)
interface ChallengeRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const activeChallenges = new Map<string, ChallengeRecord>();

// Clean up expired challenges periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, record] of activeChallenges.entries()) {
    if (now > record.expiresAt) {
      activeChallenges.delete(id);
    }
  }
}, 60000);

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface Admin2FAPayload {
  challengeId: string;
  code: string;
}

/**
 * Step 1: Validates admin credentials and sends 6-digit 2FA OTP via Gmail SMTP
 */
export const verifyAdminPasswordFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as AdminLoginPayload)
  .handler(async ({ data }) => {
    const { username, password } = data;

    const expectedUsername = process.env.ADMIN_USERNAME || "ser_admin_cars";
    const expectedPassword = process.env.ADMIN_PASSWORD || "password!A@WS#";

    if (username.trim() !== expectedUsername || password !== expectedPassword) {
      return {
        success: false,
        error: "Invalid username or password.",
      };
    }

    // Credentials valid -> Generate 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const challengeId = `ch_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

    // Store in-memory with 5 minute expiration
    activeChallenges.set(challengeId, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    // Gmail SMTP credentials
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || "whatdoesthejimsay.jj@gmail.com";
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "sfuw shtb dcah ttti";
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || smtpUser;

    console.log(`[Admin 2FA] Generated OTP code ${otpCode} for challenge ${challengeId}`);

    let emailSent = false;
    let emailError = "";

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #ffffff;">
          <div style="background: #0f172a; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 22px; font-weight: bold; color: #f59e0b;">SERROUKAS CARS</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Admin Panel Two-Factor Authentication</p>
          </div>
          <div style="padding: 32px 24px; text-align: center; color: #1e293b;">
            <p style="font-size: 15px; margin-bottom: 24px;">Your 6-digit verification code to access the Admin Control Center is:</p>
            <div style="background: #f8fafc; border: 2px dashed #cbd5e1; padding: 16px 24px; border-radius: 12px; display: inline-block; margin-bottom: 24px;">
              <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${otpCode}</span>
            </div>
            <p style="font-size: 13px; color: #64748b; margin-top: 0;">
              This verification code will expire in <strong>5 minutes</strong>.<br />
              If you did not request this login, please change your admin password immediately.
            </p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8;">Serroukas Cars · Security Alert System</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Serroukas Admin Security" <${smtpUser}>`,
        to: recipientEmail,
        subject: `🔒 [Serroukas Admin 2FA] ${otpCode} is your verification code`,
        html: htmlBody,
      });

      emailSent = true;
      console.log(`[Admin 2FA Email] Successfully sent 2FA code to ${recipientEmail}`);
    } catch (err: any) {
      console.error("[Admin 2FA Email Error]", err);
      emailError = err.message;
    }

    // Mask email for UI display (e.g. w***j@gmail.com)
    const maskedEmail = recipientEmail.replace(/^(.)(.*)(@.*)$/, (_, p1, p2, p3) => `${p1}***${p3}`);

    return {
      success: true,
      challengeId,
      emailSent,
      emailError,
      recipient: maskedEmail,
      rawEmail: recipientEmail,
    };
  });

/**
 * Step 2: Validates the 6-digit 2FA OTP code
 */
export const verifyAdmin2FAFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Admin2FAPayload)
  .handler(async ({ data }) => {
    const { challengeId, code } = data;

    const record = activeChallenges.get(challengeId);

    if (!record) {
      return {
        success: false,
        error: "Verification session expired or invalid. Please sign in again.",
      };
    }

    if (Date.now() > record.expiresAt) {
      activeChallenges.delete(challengeId);
      return {
        success: false,
        error: "Verification code expired (valid for 5 mins). Please sign in again.",
      };
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        activeChallenges.delete(challengeId);
        return {
          success: false,
          error: "Too many failed attempts. Security session invalidated.",
        };
      }
      return {
        success: false,
        error: `Incorrect 6-digit code. (${5 - record.attempts} attempts remaining)`,
      };
    }

    // Success! Consume challenge
    activeChallenges.delete(challengeId);

    return {
      success: true,
      token: `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    };
  });
