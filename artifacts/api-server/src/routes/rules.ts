import { Router } from "express";
import { db } from "@workspace/db";
import { rulesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: any, res: any) => {
  const rules = await db.select().from(rulesTable).orderBy(asc(rulesTable.order), asc(rulesTable.id));
  res.json(rules);
});

router.post("/", async (req: any, res: any) => {
  const { category, title, description, severity, order } = req.body;
  const [rule] = await db.insert(rulesTable).values({ category, title, description, severity, order: order || 0 }).returning();
  res.status(201).json(rule);
});

router.put("/:ruleId", async (req: any, res: any) => {
  const id = Number(req.params.ruleId);
  const { category, title, description, severity, order } = req.body;
  const [updated] = await db.update(rulesTable).set({ category, title, description, severity, order }).where(eq(rulesTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

router.delete("/:ruleId", async (req: any, res: any) => {
  const id = Number(req.params.ruleId);
  await db.delete(rulesTable).where(eq(rulesTable.id, id));
  res.json({ success: true, message: "Deleted" });
});

export default router;
