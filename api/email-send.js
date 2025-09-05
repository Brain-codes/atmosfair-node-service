// Vercel serverless function for /api/email-send
const {
  sendWelcomeAdminEmail,
} = require("../src/controllers/welcomeAdminController");

module.exports = async (req, res) => {
  // Vercel provides req/res in Node.js format
  // Wrap them to mimic Express for controller compatibility
  req.body = await getBody(req);

  // Minimal Express-like response helpers
  res.success = (data, message) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, data, message }));
  };
  res.error = (error, status = 500, details = null) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error, status, details }));
  };

  // Only allow POST
  if (req.method !== "POST") {
    return res.error("Method Not Allowed", 405);
  }

  // Call the controller
  await sendWelcomeAdminEmail(req, res);
};

// Helper to parse JSON body
async function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}
