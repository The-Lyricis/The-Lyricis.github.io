const express = require("express");
const { getSteamGames } = require("../controllers/steamController");

const router = express.Router();

router.get("/games", getSteamGames);

module.exports = router;
