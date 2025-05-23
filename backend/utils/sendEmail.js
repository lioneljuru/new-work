// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // e.g. example@gmail.com
      pass: process.env.MAIL_PASS, // App password
    },
  });

  await transporter.sendMail({
    from: `"UNICEF Admin" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}
