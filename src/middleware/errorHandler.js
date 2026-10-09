function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "That value already exists" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID" });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : err.message
  });
}
module.exports = errorHandler;