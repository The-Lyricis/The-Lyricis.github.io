function errorHandler(error, req, res, next) {
  const status = Number(error.status) || 500;

  if (status >= 500) {
    console.error("[server]", error);
  }

  res.status(status).json({
    error: error.message || "Internal Server Error",
    details: error.details || null,
  });
}

module.exports = { errorHandler };
