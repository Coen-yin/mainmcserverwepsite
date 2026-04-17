import { Router } from "express";
import { db } from "@workspace/db";
import { storeItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/items", async (_req: any, res: any) => {
  const items = await db.select().from(storeItemsTable);
  res.json(items.map(i => ({
    ...i,
    price: Number(i.price),
    features: (i.features as string[]) || [],
  })));
});

router.post("/items", async (req: any, res: any) => {
  const { name, description, price, category, featured, imageUrl, features } = req.body;
  const [item] = await db.insert(storeItemsTable).values({ name, description, price: price.toString(), category, featured: featured || false, imageUrl, features: features || [] }).returning();
  res.status(201).json({ ...item, price: Number(item.price), features: (item.features as string[]) || [] });
});

export default router;
