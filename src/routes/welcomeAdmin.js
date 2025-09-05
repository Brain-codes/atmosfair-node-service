// welcomeAdmin.js
const express = require("express");
const router = express.Router();
const {
  sendWelcomeAdminEmail,
} = require("../controllers/welcomeAdminController");

// POST /email/send
router.post("/send", sendWelcomeAdminEmail);

module.exports = router;
