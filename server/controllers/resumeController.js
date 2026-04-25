const { env } = require("../config/env");

async function getResumeConfig(req, res) {
  res.json({
    source: "placeholder",
    resumeFilePath: env.resumeFilePath,
    message: "Resume API scaffold is ready for future admin editing.",
  });
}

async function updateResumeConfig(req, res) {
  res.status(501).json({
    error: "Resume update is not implemented yet",
    nextStep: "Wire file upload or metadata update in server/controllers/resumeController.js",
  });
}

module.exports = {
  getResumeConfig,
  updateResumeConfig,
};
