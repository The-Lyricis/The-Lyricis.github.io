const { withApi } = require("./_lib/handler");
const {
  getResumeConfig,
  updateResumeConfig,
} = require("../server/controllers/resumeController");

module.exports = withApi(async function handler(req, res) {
  if (req.method === "GET") {
    return getResumeConfig(req, res);
  }

  if (req.method === "PUT") {
    return updateResumeConfig(req, res);
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({
    error: `Method ${req.method} Not Allowed`,
  });
}, { allowedMethods: ["GET", "PUT"] });
