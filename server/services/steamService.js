const { env } = require("../config/env");
const { createHttpError } = require("../utils/httpError");

function getExcludedKeywords() {
  return env.steamExcludedKeywords
    .split(",")
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
}

function shouldExcludeGame(game, excludedKeywords) {
  const normalizedName = String(game.name || "").toLowerCase();
  return excludedKeywords.some((keyword) => normalizedName.includes(keyword));
}

function mapOwnedGame(game) {
  const hours = Math.round((game.playtime_forever || 0) / 60);

  return {
    id: Number(game.appid),
    appId: Number(game.appid),
    name: game.name || `App ${game.appid}`,
    hours,
    recentHours: Math.round((game.playtime_2weeks || 0) / 60),
    icon: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    logoUrl: game.img_logo_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
      : null,
    storeUrl: `https://store.steampowered.com/app/${game.appid}/`,
  };
}

async function getOwnedGames({ count = 24, filterLibrary = env.steamFilterLibrary } = {}) {
  if (!env.steamApiKey || !env.steamId) {
    throw createHttpError(500, "Steam API is not configured", {
      required: ["STEAM_API_KEY", "STEAM_ID"],
    });
  }

  const safeCount = Math.min(Math.max(Number(count) || 24, 1), 50);
  const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/");
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamid", env.steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("include_played_free_games", "true");
  url.searchParams.set("include_free_sub", "true");

  const response = await fetch(url);
  if (!response.ok) {
    throw createHttpError(502, "Failed to fetch Steam owned games", {
      upstreamStatus: response.status,
    });
  }

  const data = await response.json();
  const games = data?.response?.games || [];
  const excludedKeywords = getExcludedKeywords();

  return games
    .filter((game) => (game.playtime_forever || 0) > 0)
    .filter((game) => {
      if (!filterLibrary) {
        return true;
      }

      return !shouldExcludeGame(game, excludedKeywords);
    })
    .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
    .slice(0, safeCount)
    .map(mapOwnedGame);
}

module.exports = { getOwnedGames };
