const fs = require("fs/promises");
const path = require("path");
const { getOwnedGames } = require("../server/services/steamService");

async function main() {
  const games = await getOwnedGames({ count: 50 });
  const outputPath = path.resolve(process.cwd(), "public", "steam-games.json");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(
      {
        source: "steam-static-sync",
        syncedAt: new Date().toISOString(),
        count: games.length,
        games,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Synced ${games.length} Steam games.`);
}

main().catch((error) => {
  console.error("Failed to sync Steam games:", error.message);
  process.exitCode = 1;
});

