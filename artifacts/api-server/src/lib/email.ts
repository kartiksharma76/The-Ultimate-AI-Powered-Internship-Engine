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
      text: `Dear ${studentName},\n\nThank you for applying for the ${title} position at ${company}.\nWe have received your application and our team will review it shortly.\n\nWe will get back to you regarding the next steps.\n\nRegards,\nHR Team\nInternship Engine`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1a202c;">
          <h2 style="color: #4f46e5; margin-bottom: 24px; font-weight: 800;">Application Received!</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Dear <strong>${studentName}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
            Thank you for applying for the <strong>${title}</strong> position at <strong>${company}</strong>. 
            We have received your application and our team will review it shortly.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            We will get back to you regarding the next steps in the recruitment process.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #4f46e5;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Application Token</p>
            <p style="margin: 8px 0 0; font-family: monospace; font-size: 24px; font-weight: 900; color: #4f46e5;">${token || "SYNC-OK"}</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px;">Regards,</p>
          <p style="font-size: 16px; font-weight: 800; color: #4f46e5; margin: 0;">HR Team</p>
          <p style="font-size: 14px; font-weight: 600; color: #64748b; margin: 4px 0 0;">Internship Engine</p>
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; font-style: italic;">
            This is a simulated application receipt for your profile. 
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
