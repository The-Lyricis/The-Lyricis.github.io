const express = require("express");
const {
  listProjects,
  uploadProject,
  deleteProject,
} = require("../controllers/projectsController");

const router = express.Router();

router.get("/", listProjects);
router.post("/upload", uploadProject);
router.delete("/:id", deleteProject);

module.exports = router;
