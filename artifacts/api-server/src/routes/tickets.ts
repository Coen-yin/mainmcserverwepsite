import { Router } from "express";
import { db } from "@workspace/db";
import { ticketsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req: any, res: any) => {
  const statusFilter = req.query.status as string | undefined;

  const tickets = statusFilter
    ? await db.select().from(ticketsTable).where(eq(ticketsTable.status, statusFilter)).orderBy(desc(ticketsTable.createdAt))
    : await db.select().from(ticketsTable).orderBy(desc(ticketsTable.createdAt));

  const [totalRes] = await db.select({ cnt: count() }).from(ticketsTable);

  res.json({
    tickets: tickets.map(t => ({ ...t, createdAt: t.createdAt?.toISOString() })),
    total: Number(totalRes?.cnt || 0),
  });
});

router.post("/", async (req: any, res: any) => {
  const { subject, category, message, submitterName } = req.body;
  const [ticket] = await db.insert(ticketsTable).values({ subject, category, message, submitterName }).returning();
  res.status(201).json({ ...ticket, createdAt: ticket.createdAt?.toISOString() });
});

router.get("/:ticketId", async (req: any, res: any) => {
  const id = Number(req.params.ticketId);
  const ticket = await db.query.ticketsTable.findFirst({ where: eq(ticketsTable.id, id) });
  if (!ticket) return res.status(404).json({ error: "Not found" });
  res.json({ ...ticket, createdAt: ticket.createdAt?.toISOString() });
});

router.post("/:ticketId/close", async (req: any, res: any) => {
  const id = Number(req.params.ticketId);
  const [updated] = await db.update(ticketsTable).set({ status: "closed" }).where(eq(ticketsTable.id, id)).returning();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ ...updated, createdAt: updated.createdAt?.toISOString() });
});

export default router;
