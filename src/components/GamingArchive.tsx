import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Clock, ExternalLink, Trophy } from "lucide-react";

interface Game {
  id: number;
  name: string;
  hours: number;
  favorite?: boolean;
  icon?: string;
  appId?: number;
  achievements?: {
    unlocked: number;
    total: number;
    platinum?: boolean;
  };
}

interface LayoutCell {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  gameIndex: number;
}

interface SteamGameResponse {
  source: string;
  count: number;
  games: Array<{
    id: number;
    appId: number;
    name: string;
    hours: number;
    recentHours?: number;
    icon?: string | null;
    storeUrl?: string | null;
  }>;
}

const GAMES: Game[] = [
  { id: 1, name: "Terraria", hours: 320, favorite: true, appId: 105600, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg" },
  { id: 2, name: "Elden Ring", hours: 280, favorite: true, appId: 1245620, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg" },
  { id: 3, name: "The Witcher 3", hours: 245, favorite: true, appId: 292030, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg" },
  { id: 4, name: "Monster Hunter: World", hours: 234, appId: 582010, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg" },
  { id: 5, name: "Dark Souls III", hours: 210, appId: 374320, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg" },
  { id: 6, name: "Stardew Valley", hours: 198, appId: 413150, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg" },
  { id: 7, name: "Persona 5 Royal", hours: 189, favorite: true, appId: 1687950, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg" },
  { id: 8, name: "Sekiro", hours: 185, favorite: true, appId: 814380, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg" },
  { id: 9, name: "Hollow Knight", hours: 165, appId: 367520, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg" },
  { id: 10, name: "Bloodborne", hours: 156, appId: 2101520, icon: "https://cdn.akamai.steamstatic.com/steam/apps/2101520/header.jpg" },
  { id: 11, name: "Hades", hours: 145, appId: 1145360, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg" },
  { id: 12, name: "Dead Cells", hours: 127, appId: 588650, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg" },
  { id: 13, name: "NieR: Automata", hours: 112, appId: 524220, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg" },
  { id: 14, name: "Returnal", hours: 103, appId: 1649240, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1649240/header.jpg" },
  { id: 15, name: "Ghost of Tsushima", hours: 94, appId: 2215430, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg" },
  { id: 16, name: "Celeste", hours: 89, appId: 504230, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg" },
  { id: 17, name: "God of War", hours: 78, appId: 1593500, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg" },
  { id: 18, name: "Ori and the Blind Forest", hours: 76, appId: 261570, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/261570/header.jpg" },
  { id: 19, name: "Death Stranding", hours: 72, appId: 1190460, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg" },
  { id: 20, name: "The Last of Us Part II", hours: 67, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg" },
  { id: 21, name: "Control", hours: 58, appId: 870780, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg" },
  { id: 22, name: "Cuphead", hours: 45, appId: 268910, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg" },
  { id: 23, name: "Resident Evil Village", hours: 41, appId: 1196590, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg" },
  { id: 24, name: "It Takes Two", hours: 38, appId: 1426210, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg" },
  { id: 25, name: "A Plague Tale", hours: 35, appId: 752590, icon: "https://cdn.cloudflare.steamstatic.com/steam/apps/752590/header.jpg" },
];

const MOSAIC_LAYOUT: LayoutCell[] = [
  { col: 1, row: 1, colSpan: 5, rowSpan: 3, gameIndex: 0 },
  { col: 6, row: 1, colSpan: 3, rowSpan: 2, gameIndex: 1 },
  { col: 9, row: 1, colSpan: 4, rowSpan: 2, gameIndex: 2 },
  { col: 6, row: 3, colSpan: 2, rowSpan: 3, gameIndex: 3 },
  { col: 8, row: 3, colSpan: 3, rowSpan: 1, gameIndex: 4 },
  { col: 11, row: 3, colSpan: 2, rowSpan: 2, gameIndex: 5 },
  { col: 1, row: 4, colSpan: 3, rowSpan: 2, gameIndex: 6 },
  { col: 4, row: 4, colSpan: 2, rowSpan: 3, gameIndex: 7 },
  { col: 8, row: 4, colSpan: 3, rowSpan: 2, gameIndex: 8 },
  { col: 11, row: 5, colSpan: 2, rowSpan: 3, gameIndex: 9 },
  { col: 1, row: 6, colSpan: 3, rowSpan: 2, gameIndex: 10 },
  { col: 4, row: 7, colSpan: 4, rowSpan: 1, gameIndex: 11 },
  { col: 6, row: 6, colSpan: 2, rowSpan: 1, gameIndex: 12 },
  { col: 8, row: 6, colSpan: 3, rowSpan: 2, gameIndex: 13 },
];

export function GamingArchive() {
  const [games, setGames] = useState<Game[]>(GAMES);

  const sortedGames = useMemo(
    () => [...games].sort((a, b) => b.hours - a.hours),
    [games],
  );

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
    const count = MOSAIC_LAYOUT.length;
    const endpoint = `${apiBaseUrl}/api/steam/games?count=${count}`;

    async function loadSteamGames() {
      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Steam games: ${response.status}`);
        }

        const payload = (await response.json()) as SteamGameResponse;
        if (!Array.isArray(payload.games) || payload.games.length === 0) {
          return;
        }

        setGames(
          payload.games.map((game) => ({
            id: game.id,
            name: game.name,
            hours: game.hours,
            appId: game.appId,
            icon: game.icon || undefined,
          })),
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.warn("[GamingArchive] Falling back to local games data.", error);
      }
    }

    loadSteamGames();

    return () => controller.abort();
  }, []);

  return (
    <div className="relative flex h-full min-h-screen items-center justify-center px-8 py-12">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#233554] to-transparent opacity-50" />

      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-[#E6F1FF] md:text-5xl">
              GAMING <span className="text-[#64FFDA]">ARCHIVE</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "60px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto h-1 rounded-full bg-[#64FFDA]"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl text-lg text-[#8892B0]"
          >
            A curated archive of the games, worlds, and combat systems that shaped my taste.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="mosaic-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gridTemplateRows: "repeat(9, 68px)",
              gap: "8px",
              width: "100%",
            }}
          >
            <style>{`
              @media (max-width: 768px) {
                .mosaic-grid {
                  grid-template-columns: repeat(6, 1fr) !important;
                  grid-template-rows: repeat(16, 56px) !important;
                  gap: 4px !important;
                }
              }
            `}</style>
            {MOSAIC_LAYOUT.map((cell, idx) => {
              const game = sortedGames[cell.gameIndex % sortedGames.length];
              if (!game) return null;

              return (
                <GameCard
                  key={idx}
                  game={game}
                  layout={cell}
                  rank={cell.gameIndex + 1}
                  index={idx}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
  layout: LayoutCell;
  rank: number;
  index: number;
}

function GameCard({ game, layout, rank, index }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (game.appId) {
      window.open(`https://store.steampowered.com/app/${game.appId}`, "_blank");
    }
  };

  const getRankColor = () => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#64FFDA";
  };

  const rankColor = getRankColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="group relative cursor-pointer overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        backgroundColor: "rgba(17, 34, 64, 0.5)",
        gridColumn: `${layout.col} / span ${layout.colSpan}`,
        gridRow: `${layout.row} / span ${layout.rowSpan}`,
      }}
    >
      {game.icon && !imageError ? (
        <img
          src={game.icon}
          alt={game.name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
          style={{
            filter: isHovered ? "brightness(0.4)" : "brightness(0.7)",
          }}
        />
      ) : (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112240]">
          <span className="text-4xl text-[#64FFDA] opacity-30">
            {game.name.charAt(0)}
          </span>
        </div>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.95 : 0.6,
        }}
      />

      {game.achievements?.platinum && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className="flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-[#E5E4E2] to-[#BCC6CC] px-2 py-1">
            <Trophy className="h-3 w-3 text-[#0A192F]" />
            <span className="text-[8px] font-bold text-[#0A192F]">P</span>
          </div>
        </div>
      )}

      <motion.div
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4"
      >
        <div className="space-y-2">
          <h4 className="line-clamp-2 text-sm font-bold leading-tight text-[#E6F1FF]">
            {game.name}
          </h4>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#64FFDA]" />
            <span className="text-lg font-bold text-[#64FFDA]">
              {game.hours}
            </span>
            <span className="font-mono text-sm text-[#8892B0]">hours</span>
          </div>

          {game.appId && (
            <div className="flex items-center gap-1 text-xs text-[#8892B0]">
              <ExternalLink className="h-3 w-3" />
              <span>View on Steam</span>
            </div>
          )}
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 rounded-lg transition-all duration-300"
        style={{
          border: isHovered ? `2px solid ${rankColor}` : "2px solid transparent",
          boxShadow: isHovered ? `0 0 20px ${rankColor}40` : "none",
        }}
      />
    </motion.div>
  );
}
