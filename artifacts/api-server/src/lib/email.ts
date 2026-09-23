import nodemailer from "nodemailer";
import { logger } from "./logger";

// Email service that supports real SMTP and automatic test fallback
export async function sendApplicationEmail(to: string, company: string, title: string, studentName: string = "Applicant", smtpUser?: string, smtpPass?: string, token?: string) {
  let transporter;
  let testAccount;

  try {
    if (smtpUser && smtpPass && smtpPass !== "random") {
      // Use User-provided SMTP (Real mode)
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });
    } else {
      // Use Ethereal (Test mode) - "Random Password" mode
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      logger.info({ testUser: testAccount.user }, "Using Ethereal test account for simulation");
    }

    const fromAddress = smtpUser || process.env.SMTP_USER || "noreply@internshipengine.com";

    const info = await transporter.sendMail({
      from: `"Internship Engine HR" <${fromAddress}>`,
      to,
      subject: `Application Confirmation: ${title} at ${company}`,
      text: `Dear ${studentName},\n\nCongratulations! Your application for the ${title} position at ${company} has been successfully received by the InternAI Engine.\n\nOur intelligent recruitment systems are now processing your profile. You will be notified of your application status shortly.\n\nYour Unique Application Token:\n${token || "SYNC-OK"}\n\nKeep pushing forward!\n\nBest Regards,\nThe Intelligence Team\nInternship Engine`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border-radius: 20px; background: linear-gradient(145deg, #0f172a, #1e293b); color: #f8fafc; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px 24px; background: rgba(99, 102, 241, 0.1); border-radius: 50px; border: 1px solid rgba(99, 102, 241, 0.2);">
              <h2 style="color: #818cf8; margin: 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Application Secured</h2>
            </div>
          </div>
          
          <h1 style="font-size: 28px; margin-bottom: 24px; font-weight: 800; text-align: center; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">You're One Step Closer!</h1>
          
          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #cbd5e1;">Hello <strong style="color: #f8fafc;">${studentName}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #cbd5e1;">
            Fantastic news! Your application for the <strong style="color: #818cf8;">${title}</strong> position at <strong style="color: #f8fafc;">${company}</strong> has been successfully ingested into our AI-driven recruitment engine. 
          </p>
          <p style="font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #cbd5e1;">
            Our intelligence suite is currently analyzing your profile against the role requirements. We will notify you the moment your status is updated.
          </p>
          
          <div style="background: rgba(15, 23, 42, 0.6); padding: 24px; border-radius: 16px; margin-bottom: 30px; border: 1px solid rgba(129, 140, 248, 0.2); box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);">
            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; text-align: center;">Secure Tracking Token</p>
            <p style="margin: 12px 0 0; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 28px; font-weight: 900; color: #c084fc; text-align: center; letter-spacing: 4px;">${token || "SYNC-OK"}</p>
          </div>

          <div style="margin-top: 40px;">
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 4px; color: #94a3b8;">Onward & Upward,</p>
            <p style="font-size: 18px; font-weight: 800; color: #f8fafc; margin: 0;">The Intelligence Team</p>
            <p style="font-size: 14px; font-weight: 600; color: #818cf8; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">InternAI Engine</p>
          </div>
          
          <hr style="margin: 40px 0 20px; border: none; border-top: 1px solid rgba(255, 255, 255, 0.05);" />
          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
            This is an automated intelligence dispatch. Do not reply directly.
          </p>
        </div>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info({ previewUrl }, "Email preview available");
    }

    return { success: true, previewUrl };
  } catch (error) {
    logger.error({ error }, "Failed to send email");
    return { success: false };
  }
}
