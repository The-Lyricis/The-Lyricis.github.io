const { env } = require("../../server/config/env");

function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", env.corsAllowedOrigin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }

  return false;
}

module.exports = { applyCors, handlePreflight };
