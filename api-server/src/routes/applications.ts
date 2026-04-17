import { Router } from "express";
import { db } from "@workspace/db";
import { staffApplicationsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const statusFilter = req.query.status as string | undefined;

  const apps = statusFilter
    ? await db.select().from(staffApplicationsTable).where(eq(staffApplicationsTable.status, statusFilter)).orderBy(desc(staffApplicationsTable.createdAt))
    : await db.select().from(staffApplicationsTable).orderBy(desc(staffApplicationsTable.createdAt));

  const [totalRes] = await db.select({ cnt: count() }).from(staffApplicationsTable);

  res.json({
    applications: apps.map(a => ({ ...a, createdAt: a.createdAt?.toISOString() })),
    total: Number(totalRes?.cnt || 0),
  });
});

router.post("/", async (req: any, res: any) => {
  const { applicantName, position, age, experience, whyJoin, availability } = req.body;
  const [app] = await db.insert(staffApplicationsTable).values({ applicantName, position, age, experience, whyJoin, availability }).returning();
  res.status(201).json({ ...app, createdAt: app.createdAt?.toISOString() });
});

router.post("/:applicationId/review", async (req: any, res: any) => {
  const id = Number(req.params.applicationId);
  const { status, adminNote } = req.body;
  const [updated] = await db.update(staffApplicationsTable).set({ status, adminNote }).where(eq(staffApplicationsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ...updated, createdAt: updated.createdAt?.toISOString() });
});

export default router;
