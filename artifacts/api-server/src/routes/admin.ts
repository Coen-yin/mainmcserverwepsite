import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, bansTable, appealsTable, staffApplicationsTable, ticketsTable, forumPostsTable, announcementsTable } from "@workspace/db";
import { eq, count, gte } from "drizzle-orm";

const ADMIN_PASSWORD = "Carronshore93";

const router = Router();

router.post("/verify", (req: any, res: any) => {
  const { password } = req.body;
  res.json({ valid: password === ADMIN_PASSWORD });
});

router.get("/dashboard", async (_req: any, res: any) => {
  const [usersRes] = await db.select({ cnt: count() }).from(usersTable);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [newUsersRes] = await db.select({ cnt: count() }).from(usersTable).where(gte(usersTable.joinedAt, today));
  const [bansRes] = await db.select({ cnt: count() }).from(bansTable).where(eq(bansTable.isActive, true));
  const [appealsRes] = await db.select({ cnt: count() }).from(appealsTable).where(eq(appealsTable.status, "pending"));
  const [appsRes] = await db.select({ cnt: count() }).from(staffApplicationsTable).where(eq(staffApplicationsTable.status, "pending"));
  const [ticketsRes] = await db.select({ cnt: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));
  const [postsRes] = await db.select({ cnt: count() }).from(forumPostsTable);
  const [annRes] = await db.select({ cnt: count() }).from(announcementsTable);

  res.json({
    totalUsers: Number(usersRes?.cnt || 0),
    newUsersToday: Number(newUsersRes?.cnt || 0),
    activeBans: Number(bansRes?.cnt || 0),
    pendingAppeals: Number(appealsRes?.cnt || 0),
    pendingApplications: Number(appsRes?.cnt || 0),
    openTickets: Number(ticketsRes?.cnt || 0),
    totalForumPosts: Number(postsRes?.cnt || 0),
    serverOnline: true,
    currentPlayers: Math.floor(Math.random() * 30) + 5,
    totalVotesToday: Math.floor(Math.random() * 50),
    recentActivity: [
      { type: "user", description: "New player joined the server", timestamp: new Date().toISOString() },
      { type: "ban", description: "Player banned for griefing", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: "announcement", description: "New announcement posted", timestamp: new Date(Date.now() - 7200000).toISOString() },
    ],
  });
});

export default router;
