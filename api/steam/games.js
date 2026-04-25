const { withApi } = require("../_lib/handler");
const { getSteamGames } = require("../../server/controllers/steamController");

module.exports = withApi(getSteamGames);
