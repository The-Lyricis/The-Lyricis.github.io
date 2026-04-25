const { withApi } = require("../_lib/handler");
const { deleteProject } = require("../../server/controllers/projectsController");

module.exports = withApi(deleteProject, { allowedMethods: ["DELETE"] });
