// Vercel root API handler
module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      message: "Atmosphere Node Service API",
      endpoints: ["/api/email-send"],
      status: "ok",
    })
  );
};
