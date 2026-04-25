const { withApi } = require("../_lib/handler");
const {
  listProjects,
  uploadProject,
} = require("../../server/controllers/projectsController");

module.exports = withApi(async function handler(req, res) {
  if (req.method === "GET") {
    return listProjects(req, res);
  }

  if (req.method === "POST") {
    return uploadProject(req, res);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({
    error: `Method ${req.method} Not Allowed`,
  });
}, { allowedMethods: ["GET", "POST"] });
