import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, votesTable, playerStatsTable } from "@workspace/db";
import { count, sum } from "drizzle-orm";

const router = Router();

router.get("/status", async (_req: any, res: any) => {
  res.json({
    online: true,
    playerCount: Math.floor(Math.random() * 30) + 5,
    maxPlayers: 100,
    motd: "Welcome to techy - The Ultimate Minecraft Experience!",
    version: "1.21.4",
    onlinePlayers: ["Steve123", "CreeperKing", "DiamondMiner", "RedstoneWiz", "BuilderPro"].slice(0, Math.floor(Math.random() * 5) + 1),
  });
});

router.get("/stats", async (_req: any, res: any) => {
  const [usersRes] = await db.select({ cnt: count() }).from(usersTable);
  const [votesRes] = await db.select({ cnt: count() }).from(votesTable);
  const [playtimeRes] = await db.select({ total: sum(playerStatsTable.playtime) }).from(playerStatsTable);

  res.json({
    totalPlayers: Number(usersRes?.cnt || 0),
    totalPlaytime: Number(playtimeRes?.total || 0),
    totalVotes: Number(votesRes?.cnt || 0),
    uptime: "99.9%",
    peakPlayers: 87,
    lastWipe: "2024-01-01",
  });
});

export default router;
