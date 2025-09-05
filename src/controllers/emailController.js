const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") }); // For testing, revert to .env.local

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: true, // false for 587, true for 465
  // requireTLS: true, // Force TLS encryption
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // For local development - bypass SSL certificate issues
  // tls: {
  //   rejectUnauthorized: false,
  //   minVersion: "TLSv1.2",
  // },
});

const waitlistHtmlPath = path.resolve(__dirname, "../../emails/waitlist.html");
let waitlistHtml = "";
try {
  waitlistHtml = fs.readFileSync(waitlistHtmlPath, "utf8");
} catch (err) {
  console.error("Could not load waitlist.html:", err.message);
}

exports.sendEmail = async (req, res) => {
  const { email } = req.body;
  console.log(`[DEBUG] Attempting to send email to: ${email}`);

  if (!email) {
    return res.error("Email is required", 400);
  }
  if (!waitlistHtml) {
    return res.error("Email template not found", 500);
  }

  try {
    console.log(
      `[DEBUG] Using transporter config: host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT}`
    );

    const info = await transporter.sendMail({
      from: `"Atmosfair" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank you for joining our waitlist! | Atmosfair",
      html: waitlistHtml,
    });

    console.log(`[DEBUG] Email sent successfully: ${info.messageId}`);
    console.log(`[DEBUG] About to send success response`);

    return res.success(
      {
        messageId: info.messageId,
        timestamp: new Date().toISOString(),
      },
      "Email sent successfully"
    );
  } catch (error) {
    console.error("[DEBUG] Error in catch block:", error);
    return res.error("Failed to send email", 500, error.message);
  }
};
