const { withApi } = require("./_lib/handler");

module.exports = withApi(async function handler(req, res) {
  res.json({
    ok: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});
