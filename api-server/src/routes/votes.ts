import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { voteSitesTable, votesTable, usersTable } from "@workspace/db";
import { eq, and, gte, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  const sites = await db.select().from(voteSitesTable);

  let userVotes: any[] = [];
  if (clerkUserId) {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkUserId, clerkUserId) });
    if (user) {
      userVotes = await db.select().from(votesTable).where(eq(votesTable.userId, user.id));
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [todayRes] = await db.select({ cnt: count() }).from(votesTable).where(gte(votesTable.votedAt, today));

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const result = sites.map(site => {
    const lastVote = userVotes.find(v => v.siteId === site.id);
    const canVote = !lastVote || (Date.now() - new Date(lastVote.votedAt).getTime()) > site.cooldownHours * 3600000;
    return {
      id: site.id,
      name: site.name,
      url: site.url,
      reward: site.reward,
      cooldownHours: site.cooldownHours,
      lastVoted: lastVote?.votedAt?.toISOString(),
      canVote,
    };
  });

  res.json({
    sites: result,
    totalVotesToday: Number(todayRes?.cnt || 0),
    myVotesThisMonth: userVotes.filter(v => new Date(v.votedAt) >= monthStart).length,
  });
});

router.post("/record", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkUserId, clerkUserId) });
  if (!user) return res.status(401).json({ error: "User not found" });

  const { siteId } = req.body;
  await db.insert(votesTable).values({ siteId, userId: user.id });
  res.status(201).json({ success: true, message: "Vote recorded" });
});

export default router;
