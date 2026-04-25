const express = require("express");
const {
  getResumeConfig,
  updateResumeConfig,
} = require("../controllers/resumeController");

const router = express.Router();

router.get("/", getResumeConfig);
router.put("/", updateResumeConfig);

module.exports = router;
