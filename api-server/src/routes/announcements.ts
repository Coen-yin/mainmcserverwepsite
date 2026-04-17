import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const announcements = await db.select().from(announcementsTable)
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt))
    .limit(limit).offset(offset);

  const [totalRes] = await db.select({ cnt: count() }).from(announcementsTable);
  const total = Number(totalRes?.cnt || 0);

  res.json({
    announcements: announcements.map(a => ({ ...a, createdAt: a.createdAt?.toISOString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.post("/", async (req: any, res: any) => {
  const { title, content, type, pinned } = req.body;
  const [ann] = await db.insert(announcementsTable).values({ title, content, type, pinned: pinned || false }).returning();
  res.status(201).json({ ...ann, createdAt: ann.createdAt?.toISOString() });
});

router.get("/:announcementId", async (req: any, res: any) => {
  const id = Number(req.params.announcementId);
  const ann = await db.query.announcementsTable.findFirst({ where: eq(announcementsTable.id, id) });
  if (!ann) return res.status(404).json({ error: "Not found" });
  res.json({ ...ann, createdAt: ann.createdAt?.toISOString() });
});

router.put("/:announcementId", async (req: any, res: any) => {
  const id = Number(req.params.announcementId);
  const { title, content, type, pinned } = req.body;
  const [updated] = await db.update(announcementsTable).set({ title, content, type, pinned }).where(eq(announcementsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ...updated, createdAt: updated.createdAt?.toISOString() });
});

router.delete("/:announcementId", async (req: any, res: any) => {
  const id = Number(req.params.announcementId);
  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));
  res.json({ success: true, message: "Deleted" });
});

export default router;
