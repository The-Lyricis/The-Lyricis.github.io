const express = require("express");
const steamRoutes = require("./steam");
const projectRoutes = require("./projects");
const resumeRoutes = require("./resume");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/steam", steamRoutes);
router.use("/projects", projectRoutes);
router.use("/resume", resumeRoutes);

module.exports = router;
