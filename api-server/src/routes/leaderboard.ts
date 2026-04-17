import { Router } from "express";
import { db } from "@workspace/db";
import { playerStatsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const type = (req.query.type as string) || "kills";
  const limit = Number(req.query.limit) || 10;

  let orderCol: any;
  if (type === "kills") orderCol = playerStatsTable.kills;
  else if (type === "deaths") orderCol = playerStatsTable.deaths;
  else if (type === "playtime") orderCol = playerStatsTable.playtime;
  else if (type === "votes") orderCol = playerStatsTable.votes;
  else if (type === "money") orderCol = playerStatsTable.money;
  else orderCol = playerStatsTable.kills;

  const stats = await db.select().from(playerStatsTable).orderBy(desc(orderCol)).limit(limit);

  const entries = stats.map((s, i) => {
    let value = 0;
    let displayValue = "";
    if (type === "kills") { value = s.kills; displayValue = `${s.kills} kills`; }
    else if (type === "deaths") { value = s.deaths; displayValue = `${s.deaths} deaths`; }
    else if (type === "playtime") { value = s.playtime; displayValue = `${Math.floor(s.playtime / 60)}h ${s.playtime % 60}m`; }
    else if (type === "votes") { value = s.votes; displayValue = `${s.votes} votes`; }
    else if (type === "money") { value = s.money; displayValue = `$${s.money.toLocaleString()}`; }

    return { rank: i + 1, playerName: s.playerName, value, displayValue };
  });

  res.json(entries);
});

export default router;
