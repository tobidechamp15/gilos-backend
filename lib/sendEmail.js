// lib/sendEmail.js
import nodemailer from "nodemailer";

export default async function sendActivationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const html = `
    <div
      style="
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        background: #ffffff;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
    >
    <img src="../public/splash-icon.png" alt="Logo" style="width: 100px; margin: 0 auto;">
      <p style="margin: 0 0 12px 0; font-size: 15px; color: #718096;">
        Please use the following code to activate your account:
      </p>

      <div
        style="
          background: #edf2f7;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          font-family: 'Roboto Mono', monospace;
          font-size: 22px;
          font-weight: bold;
          color: #2d3748;
          letter-spacing: 4px;"
      >
        ${code}
      </div>

      <p style="margin: 12px 0 0 0; font-size: 13px; color: #a0aec0;">
        This code will expire in 15 minutes.
      </p>
    </div>`;
  await transporter.sendMail({
    from: '"Gilos" <no-reply@gilos.com>',
    to: email,
    subject: "Activate Your Account",
    html,
    text: `Your activation code is ${code}`,

    //     html: (
    //       <div
    //         style="
    //   border: 1px solid #e2e8f0;
    //   border-radius: 12px;
    //   padding: 20px;
    //   background: #ffffff;
    //   max-width: 400px;
    //   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
    //       >
    //         <p style="margin: 0 0 12px 0; font-size: 15px; color: #718096;">
    //           Please use the following code to activate your account:
    //         </p>
    //         <div
    //           style="
    //     background: #edf2f7;
    //     padding: 16px;
    //     border-radius: 8px;
    //     text-align: center;
    //     font-family: 'Roboto Mono', monospace;
    //     font-size: 22px;
    //     font-weight: bold;
    //     color: #2d3748;
    //     letter-spacing: 4px;"
    //         >
    //           ${code}
    //         </div>
    //         <p style="margin: 12px 0 0 0; font-size: 13px; color: #a0aec0;">
    //           This code will expire in 15 minutes.
    //         </p>
    //       </div>
    //     ),
  });
}
