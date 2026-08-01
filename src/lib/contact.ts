import { createServerFn } from "@tanstack/react-start";
import nodemailer from "nodemailer";

export interface ContactPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  interest: "buy" | "rent" | "service";
  notes?: string;
  vehicleName?: string;
}

export const submitAppointmentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as ContactPayload)
  .handler(async ({ data }) => {
    const { firstName, lastName, phone, email, interest, notes, vehicleName } = data;

    // Get environment variables from process.env (Server side in Nitro / Node)
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

    const resendApiKey = process.env.RESEND_API_KEY || (import.meta as any).env?.VITE_RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || smtpUser || "info@serroukas-cars.gr";
    const senderEmail = process.env.CONTACT_SENDER_EMAIL || smtpUser || "Serroukas Cars Leads <onboarding@resend.dev>";
    
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

    console.log("[Contact Submission Received]", {
      name: `${firstName} ${lastName}`,
      phone,
      email,
      interest,
      vehicleName,
      timestamp: new Date().toISOString(),
    });

    const results = {
      smtp: false,
      resend: false,
      telegram: false,
      webhook: false,
      fallbackSaved: true,
      messages: [] as string[],
    };

    const interestLabel = interest === "buy" ? "Αγορά Οχήματος" : interest === "rent" ? "Ενοικίαση" : "Service & After-Sales";

    const emailSubject = `[Νέο Αίτημα Serroukas Cars] ${interestLabel} - ${firstName} ${lastName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #d97706; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 20px;">Serroukas Cars — Νέο Αίτημα Ραντεβού</h2>
        </div>
        <div style="padding: 24px; color: #333; line-height: 1.6;">
          <p><strong>Όνομα:</strong> ${firstName} ${lastName}</p>
          <p><strong>Τηλέφωνο:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Ενδιαφέρον:</strong> ${interestLabel}</p>
          ${vehicleName ? `<p><strong>Επιλεγμένο Όχημα:</strong> ${vehicleName}</p>` : ""}
          <p><strong>Σημειώσεις / Μήνυμα:</strong></p>
          <div style="background: #f9f9f9; padding: 12px; border-left: 4px solid #d97706; margin-top: 8px;">
            ${notes || "Καμία επιπλέον σημείωση"}
          </div>
          <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">Ημερομηνία Αιτήματος: ${new Date().toLocaleString("el-GR")}</p>
        </div>
      </div>
    `;

    // 1. Delivery via SMTP / Gmail if SMTP_USER and SMTP_PASS are set
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for 587
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"${firstName} ${lastName} (via Serroukas Cars)" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: email,
          subject: emailSubject,
          html: emailHtml,
        });

        results.smtp = true;
        results.messages.push("Email sent successfully via Gmail SMTP.");
      } catch (err: any) {
        console.error("[SMTP Error]", err);
        results.messages.push(`SMTP Error: ${err.message}`);
      }
    }

    // 2. Delivery via Resend API if API Key is set
    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [recipientEmail],
            reply_to: email,
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (response.ok) {
          results.resend = true;
          results.messages.push("Email sent successfully via Resend API.");
        } else {
          const errText = await response.text();
          console.error("[Resend Error]", errText);
          results.messages.push(`Resend API Error: ${response.status}`);
        }
      } catch (err: any) {
        console.error("[Resend Exception]", err);
        results.messages.push(`Resend Exception: ${err.message}`);
      }
    }

    // 3. Delivery via Telegram Bot if token & chat_id are configured
    if (telegramBotToken && telegramChatId) {
      try {
        const telegramMessage = `🚘 *ΝΕΟ ΑΙΤΗΜΑ SERROUKAS CARS*\n\n` +
          `👤 *Όνομα:* ${firstName} ${lastName}\n` +
          `📞 *Τηλέφωνο:* \`${phone}\`\n` +
          `✉️ *Email:* ${email}\n` +
          `📌 *Κατηγορία:* ${interestLabel}\n` +
          (vehicleName ? `🚗 *Όχημα:* ${vehicleName}\n` : "") +
          `💬 *Μήνυμα:* ${notes || "-"}\n\n` +
          `📅 _${new Date().toLocaleString("el-GR")}_`;

        const tgRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        });

        if (tgRes.ok) {
          results.telegram = true;
          results.messages.push("Telegram notification sent successfully.");
        }
      } catch (err: any) {
        console.error("[Telegram Error]", err);
      }
    }

    // 4. Delivery via Webhook (Slack, Discord, Zapier, CRM)
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "new_contact_appointment",
            data,
            subject: emailSubject,
          }),
        });
        results.webhook = true;
        results.messages.push("Webhook notification dispatched.");
      } catch (err: any) {
        console.error("[Webhook Error]", err);
      }
    }

    // If no provider env variables were set, log notice
    if (!smtpUser && !resendApiKey && !telegramBotToken && !webhookUrl) {
      console.warn(
        "[Contact Service Warning] No email service or webhook configured. Set SMTP_USER and SMTP_PASS (or GMAIL_USER & GMAIL_APP_PASSWORD) to receive Gmail emails."
      );
      results.messages.push(
        "No email service provider configured in ENV. Submission saved locally."
      );
    }

    return {
      success: true,
      delivered: results.smtp || results.resend || results.telegram || results.webhook,
      results,
    };
  });
