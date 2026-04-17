import { Router } from "express";
import { db } from "@workspace/db";
import { changelogsTable } from "@workspace/db";
import { desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const logs = await db.select().from(changelogsTable).orderBy(desc(changelogsTable.createdAt)).limit(limit).offset(offset);
  const [totalRes] = await db.select({ cnt: count() }).from(changelogsTable);

  res.json({
    changelogs: logs.map(l => ({ ...l, createdAt: l.createdAt?.toISOString() })),
    total: Number(totalRes?.cnt || 0),
    page,
  });
});

router.post("/", async (req: any, res: any) => {
  const { version, title, changes } = req.body;
  const [log] = await db.insert(changelogsTable).values({ version, title, changes }).returning();
  res.status(201).json({ ...log, createdAt: log.createdAt?.toISOString() });
});

export default router;
