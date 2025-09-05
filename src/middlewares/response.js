// Centralized response middleware
module.exports = (req, res, next) => {
  res.success = (data, message = "Success", status = 200) => {
    res.status(status).json({ success: true, message, data });
  };
  res.error = (message = "Error", status = 500, details = null) => {
    const response = { success: false, message };
    if (details) response.details = details;
    res.status(status).json(response);
  };
  next();
};
