// welcomeAdminController.js
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });

// Centralized brand tokens
const BRAND = {
  name: "Atmosfair",
  primaryColor: "#051B52",
  background: "#F7F9FC",
  logoUrl: "https://atmosfair.com/logo.png", // Placeholder
  spacing: "24px",
};

// HTML template loader and renderer
const fs = require("fs");
const templatePath = path.resolve(__dirname, "../../emails/welcome-admin.html");
let welcomeAdminHtmlTemplate = "";
try {
  welcomeAdminHtmlTemplate = fs.readFileSync(templatePath, "utf8");
} catch (err) {
  console.error("Could not load welcome-admin.html:", err.message);
}

function renderWelcomeAdminHtml({
  email,
  user_name,
  organization_name,
  password,
}) {
  let html = welcomeAdminHtmlTemplate;
  html = html.replace(/\{\{email\}\}/g, email);
  html = html.replace(/\{\{user_name\}\}/g, user_name);
  html = html.replace(/\{\{organization_name\}\}/g, organization_name);
  html = html.replace(/\{\{password\}\}/g, password);
  html = html.replace(/\{\{LOGIN_URL\}\}/g, "https://atmosfair.com/login"); // Replace with actual login URL
  return html;
}

// Plain-text template function
function renderWelcomeAdminText({
  email,
  user_name,
  organization_name,
  password,
}) {
  return `Hi ${user_name}, welcome to ${BRAND.name}!

An account has been created for ${organization_name}.

Your login credentials:
Email: ${email}
Temporary Password: ${password}

Sign in: {{LOGIN_URL}}

For your security, please change your password after first login.

Need help? Contact support@atmosfair.com`;
}

// Validation helper
function validatePayload(body) {
  const required = [
    "email",
    "user_name",
    "organization_name",
    "password",
    "type",
  ];
  for (const key of required) {
    if (!body[key]) return `Missing required field: ${key}`;
  }
  if (body.type !== "welcome-admin") return `Unsupported type: ${body.type}`;
  return null;
}

exports.sendWelcomeAdminEmail = async (req, res) => {
  const error = validatePayload(req.body);
  if (error) return res.error(error, 400);

  const { email, user_name, organization_name, password } = req.body;

  const html = renderWelcomeAdminHtml({
    email,
    user_name,
    organization_name,
    password,
  });
  const text = renderWelcomeAdminText({
    email,
    user_name,
    organization_name,
    password,
  });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Atmosfair — Your Admin Access",
      html,
      text,
      headers: { "X-Entity-Ref": "welcome-admin" },
    });

    return res.success(
      {
        messageId: info.messageId,
        timestamp: new Date().toISOString(),
      },
      "Email sent successfully"
    );
  } catch (err) {
    return res.error("Failed to send email", 500, err.message);
  }
};

// Export template functions for testing
exports._renderWelcomeAdminHtml = renderWelcomeAdminHtml;
exports._renderWelcomeAdminText = renderWelcomeAdminText;
exports._validatePayload = validatePayload;
