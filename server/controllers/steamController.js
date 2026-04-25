const { getOwnedGames } = require("../services/steamService");

async function getSteamGames(req, res) {
  const count = req.query.count;
  const games = await getOwnedGames({ count });

  res.json({
    source: "steam",
    count: games.length,
    games,
  });
}

module.exports = { getSteamGames };
