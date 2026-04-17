import { Router } from "express";
import { db } from "@workspace/db";
import { bansTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const bans = await db.select().from(bansTable)
    .where(eq(bansTable.isActive, true))
    .orderBy(desc(bansTable.createdAt))
    .limit(limit).offset(offset);

  const [totalRes] = await db.select({ cnt: count() }).from(bansTable).where(eq(bansTable.isActive, true));
  const total = Number(totalRes?.cnt || 0);

  res.json({
    bans: bans.map(b => ({
      ...b,
      expiresAt: b.expiresAt?.toISOString(),
      createdAt: b.createdAt?.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/", async (req: any, res: any) => {
  const { playerName, reason, duration, isPermanent } = req.body;
  const [ban] = await db.insert(bansTable).values({ playerName, reason, duration, isPermanent: isPermanent || false }).returning();
  res.status(201).json({ ...ban, createdAt: ban.createdAt?.toISOString() });
});

router.post("/:banId/unban", async (req: any, res: any) => {
  const id = Number(req.params.banId);
  await db.update(bansTable).set({ isActive: false }).where(eq(bansTable.id, id));
  res.json({ success: true, message: "Player unbanned" });
});

export default router;
