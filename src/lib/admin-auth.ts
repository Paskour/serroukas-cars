import { createServerFn, getGlobalStartContext } from "@tanstack/react-start";
import nodemailer from "nodemailer";

// ============================================================================
// GLOBAL IP RATE LIMITER CONFIGURATION
// ============================================================================
interface IpRateLimitRecord {
  passwordAttempts: number;
  otpAttempts: number;
  firstAttemptTime: number;
  lockedUntil: number;
}

const ipRateLimits = new Map<string, IpRateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minute sliding window
const MAX_PASSWORD_ATTEMPTS = 5;   // Max 5 password attempts per IP per 15 mins
const MAX_OTP_ATTEMPTS = 10;        // Max 10 2FA OTP attempts per IP per 15 mins

// Clean up old rate-limiting records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRateLimits.entries()) {
    if (now - record.firstAttemptTime > WINDOW_MS && record.lockedUntil < now) {
      ipRateLimits.delete(ip);
    }
  }
}, 600000);

/**
 * Extracts client IP from global Start context headers
 */
function getClientIp(): string {
  try {
    const ctx = getGlobalStartContext() as any;
    if (ctx?.request?.headers) {
      const headers = ctx.request.headers;
      const cfIp = headers.get("cf-connecting-ip");
      if (cfIp) return cfIp.trim();

      const xForwardedFor = headers.get("x-forwarded-for");
      if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

      const xRealIp = headers.get("x-real-ip");
      if (xRealIp) return xRealIp.trim();
    }
  } catch {}
  return "127.0.0.1";
}

/**
 * Checks if the client IP is allowed or rate-limited
 */
function checkIpRateLimit(ip: string, type: "password" | "otp"): { allowed: boolean; retryAfterMins?: number; remainingAttempts?: number } {
  const now = Date.now();
  let record = ipRateLimits.get(ip);

  if (!record) {
    record = { passwordAttempts: 0, otpAttempts: 0, firstAttemptTime: now, lockedUntil: 0 };
    ipRateLimits.set(ip, record);
  }

  // Reset window if 15 minutes have passed
  if (now - record.firstAttemptTime > WINDOW_MS) {
    record.passwordAttempts = 0;
    record.otpAttempts = 0;
    record.firstAttemptTime = now;
    record.lockedUntil = 0;
  }

  // Check if IP is currently locked out
  if (record.lockedUntil > now) {
    const remainingMins = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, retryAfterMins: remainingMins };
  }

  const maxAttempts = type === "password" ? MAX_PASSWORD_ATTEMPTS : MAX_OTP_ATTEMPTS;
  const currentAttempts = type === "password" ? record.passwordAttempts : record.otpAttempts;

  if (currentAttempts >= maxAttempts) {
    record.lockedUntil = now + WINDOW_MS;
    const remainingMins = Math.ceil(WINDOW_MS / 60000);
    return { allowed: false, retryAfterMins: remainingMins };
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - currentAttempts,
  };
}

/**
 * Increments failed attempts for an IP
 */
function recordIpFailure(ip: string, type: "password" | "otp") {
  const record = ipRateLimits.get(ip);
  if (record) {
    if (type === "password") record.passwordAttempts += 1;
    if (type === "otp") record.otpAttempts += 1;
  }
}

// ============================================================================
// 2FA CHALLENGE STORE & CLEANUP
// ============================================================================
interface ChallengeRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  ip: string;
}

const activeChallenges = new Map<string, ChallengeRecord>();

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
 * Helper to create nodemailer transporter for Gmail
 */
function createGmailTransporter(user: string, pass: string, port = 465) {
  const cleanPass = pass.replace(/\s+/g, "");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: port,
    secure: port === 465,
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

/**
 * Step 1: Validates admin credentials with IP Rate Limiting & Gmail 2FA
 */
export const verifyAdminPasswordFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as AdminLoginPayload)
  .handler(async ({ data }) => {
    const clientIp = getClientIp();
    console.log(`[Admin Login Attempt] IP: ${clientIp}, Username: "${data.username || ""}"`);

    // Enforce IP Rate Limiting
    const limitCheck = checkIpRateLimit(clientIp, "password");
    if (!limitCheck.allowed) {
      console.warn(`[IP RATE LIMIT EXCEEDED] IP ${clientIp} is locked out.`);
      return {
        success: false,
        error: `Too many failed login attempts from IP (${clientIp}). Access locked for ${limitCheck.retryAfterMins} minutes.`,
      };
    }

    const inputUsername = (data.username || "").trim();
    const inputPassword = data.password || "";

    const envUser = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.replace(/^["']|["']$/g, "").trim() : "";
    const envPass = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.replace(/^["']|["']$/g, "").trim() : "";

    const expectedUsername = envUser || "ser_admin_cars";
    const expectedPassword = envPass || "password!A@WS#";

    // Verify credentials
    if (inputUsername !== expectedUsername || inputPassword !== expectedPassword) {
      recordIpFailure(clientIp, "password");
      const remaining = (limitCheck.remainingAttempts ?? 5) - 1;
      return {
        success: false,
        error: `Invalid username or password. (${remaining} attempts remaining before IP lockout)`,
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
      ip: clientIp,
    });

    const rawSmtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || "whatdoesthejimsay.jj@gmail.com";
    const rawSmtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "sfuw shtb dcah ttti";
    
    const smtpUser = rawSmtpUser.replace(/^["']|["']$/g, "").trim();
    const smtpPass = rawSmtpPass.replace(/^["']|["']$/g, "").trim();
    const recipientEmail = (process.env.CONTACT_RECIPIENT_EMAIL || smtpUser).replace(/^["']|["']$/g, "").trim();

    console.log(`\n======================================================`);
    console.log(`🔑 [SERROUKAS ADMIN 2FA CODE]: ${otpCode}`);
    console.log(`📩 Recipient Inbox: ${recipientEmail}`);
    console.log(`🌐 Authorized Client IP: ${clientIp}`);
    console.log(`======================================================\n`);

    let emailSent = false;
    let emailError = "";

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
            IP Address Requesting Access: <code>${clientIp}</code>
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8;">Serroukas Cars · Security Alert System</p>
        </div>
      </div>
    `;

    // Attempt Port 465 then 587
    try {
      const transporter = createGmailTransporter(smtpUser, smtpPass, 465);
      await transporter.sendMail({
        from: `"Serroukas Admin Security" <${smtpUser}>`,
        to: recipientEmail,
        subject: `🔒 [Serroukas Admin 2FA] ${otpCode} is your verification code`,
        html: htmlBody,
      });
      emailSent = true;
    } catch (err1: any) {
      try {
        const transporter587 = createGmailTransporter(smtpUser, smtpPass, 587);
        await transporter587.sendMail({
          from: `"Serroukas Admin Security" <${smtpUser}>`,
          to: recipientEmail,
          subject: `🔒 [Serroukas Admin 2FA] ${otpCode} is your verification code`,
          html: htmlBody,
        });
        emailSent = true;
      } catch (err2: any) {
        console.error("[Admin 2FA Email Error]", err2);
        emailError = err2.message || "Failed to connect to Gmail SMTP";
      }
    }

    const maskedEmail = recipientEmail.replace(/^(.)(.*)(@.*)$/, (_, p1, p2, p3) => `${p1}***${p3}`);

    return {
      success: true,
      challengeId,
      emailSent,
      emailError,
      recipient: maskedEmail,
      rawEmail: recipientEmail,
      clientIp,
    };
  });

/**
 * Step 2: Validates the 6-digit 2FA OTP code with IP Rate Limiting
 */
export const verifyAdmin2FAFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Admin2FAPayload)
  .handler(async ({ data }) => {
    const clientIp = getClientIp();

    // Check IP rate limit for 2FA OTP attempts
    const limitCheck = checkIpRateLimit(clientIp, "otp");
    if (!limitCheck.allowed) {
      return {
        success: false,
        error: `Too many failed 2FA attempts from IP (${clientIp}). Access locked for ${limitCheck.retryAfterMins} minutes.`,
      };
    }

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
      recordIpFailure(clientIp, "otp");

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
