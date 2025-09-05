const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const logger = require("./middlewares/logger");
const response = require("./middlewares/response");
const emailRoutes = require("./routes/email");

// Try to load .env.local for development, but don't fail if it doesn't exist
try {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
} catch (error) {
  console.log("No .env.local file found, using environment variables");
}

const app = express();

app.use(express.json());
app.use(logger);
app.use(response);

// Register welcomeAdmin route
const welcomeAdminRouter = require("./routes/welcomeAdmin");
app.use("/email", welcomeAdminRouter);
app.use("/api", emailRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Atmosfair Node Service is running.",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// cPanel provides PORT through environment variable - don't use fallback
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
