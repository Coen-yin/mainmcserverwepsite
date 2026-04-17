import { Router } from "express";
import { db } from "@workspace/db";
import { galleryImagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: any, res: any) => {
  const images = await db.select().from(galleryImagesTable).orderBy(desc(galleryImagesTable.createdAt));
  res.json(images.map(i => ({ ...i, createdAt: i.createdAt?.toISOString() })));
});

router.post("/", async (req: any, res: any) => {
  const { title, description, imageUrl } = req.body;
  const [img] = await db.insert(galleryImagesTable).values({ title, description, imageUrl }).returning();
  res.status(201).json({ ...img, createdAt: img.createdAt?.toISOString() });
});

router.delete("/:imageId", async (req: any, res: any) => {
  const id = Number(req.params.imageId);
  await db.delete(galleryImagesTable).where(eq(galleryImagesTable.id, id));
  res.json({ success: true, message: "Deleted" });
});

export default router;
