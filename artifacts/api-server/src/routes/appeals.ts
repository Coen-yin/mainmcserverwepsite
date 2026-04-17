import { Router } from "express";
import { db } from "@workspace/db";
import { appealsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const statusFilter = req.query.status as string | undefined;
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const appeals = statusFilter
    ? await db.select().from(appealsTable).where(eq(appealsTable.status, statusFilter)).orderBy(desc(appealsTable.createdAt)).limit(limit).offset(offset)
    : await db.select().from(appealsTable).orderBy(desc(appealsTable.createdAt)).limit(limit).offset(offset);

  const [totalRes] = await db.select({ cnt: count() }).from(appealsTable);

  res.json({
    appeals: appeals.map(a => ({ ...a, createdAt: a.createdAt?.toISOString() })),
    total: Number(totalRes?.cnt || 0),
    page,
  });
});

router.post("/", async (req: any, res: any) => {
  const { playerName, reason, explanation } = req.body;
  const [appeal] = await db.insert(appealsTable).values({ playerName, reason, explanation }).returning();
  res.status(201).json({ ...appeal, createdAt: appeal.createdAt?.toISOString() });
});

router.get("/:appealId", async (req: any, res: any) => {
  const id = Number(req.params.appealId);
  const appeal = await db.query.appealsTable.findFirst({ where: eq(appealsTable.id, id) });
  if (!appeal) return res.status(404).json({ error: "Not found" });
  res.json({ ...appeal, createdAt: appeal.createdAt?.toISOString() });
});

router.post("/:appealId/review", async (req: any, res: any) => {
  const id = Number(req.params.appealId);
  const { status, adminNote } = req.body;
  const [updated] = await db.update(appealsTable).set({ status, adminNote }).where(eq(appealsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ...updated, createdAt: updated.createdAt?.toISOString() });
});

export default router;
