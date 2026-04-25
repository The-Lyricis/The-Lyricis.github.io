const { getOwnedGames } = require("../services/steamService");
const { env, parseBoolean } = require("../config/env");

function applySteamGamesCacheHeaders(res) {
  // Short browser cache with a longer CDN cache keeps the page responsive
  // without hammering Steam on every visit.
  res.setHeader(
    "Cache-Control",
    "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
  );
}

async function getSteamGames(req, res) {
  const count = req.query.count;
  const filterLibrary =
    typeof req.query.filter === "string"
      ? parseBoolean(req.query.filter, env.steamFilterLibrary)
      : env.steamFilterLibrary;
  const games = await getOwnedGames({ count, filterLibrary });

  applySteamGamesCacheHeaders(res);
  res.json({
    source: "steam",
    filterLibrary,
    count: games.length,
    games,
  });
}

module.exports = { getSteamGames };
