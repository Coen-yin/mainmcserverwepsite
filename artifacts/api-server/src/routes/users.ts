import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, ilike, or, desc } from "drizzle-orm";

const OWNER_EMAIL = "coenyim@gmail.com";

const router = Router();

async function ensureUser(clerkUserId: string, email?: string) {
  let user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkUserId, clerkUserId) });
  const isOwner = email === OWNER_EMAIL;

  if (!user) {
    const username = email?.split("@")[0] || `player_${clerkUserId.slice(-6)}`;
    [user] = await db.insert(usersTable).values({
      clerkUserId,
      username,
      isAdmin: isOwner,
      rank: isOwner ? "owner" : "player",
    }).returning();
  } else if (isOwner && (!user.isAdmin || user.rank !== "owner")) {
    [user] = await db.update(usersTable)
      .set({ isAdmin: true, rank: "owner" })
      .where(eq(usersTable.id, user.id))
      .returning();
  }

  return user;
}

router.get("/profile", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

  const sessionClaims = auth?.sessionClaims as any;
  const email = sessionClaims?.email as string | undefined;
  const user = await ensureUser(clerkUserId, email);

  res.json({
    id: user.id,
    clerkUserId: user.clerkUserId,
    username: user.username,
    displayName: user.displayName,
    minecraftUsername: user.minecraftUsername,
    bio: user.bio,
    rank: user.rank,
    isAdmin: user.isAdmin,
    isBanned: user.isBanned,
    postCount: user.postCount,
    joinedAt: user.joinedAt?.toISOString(),
    avatarUrl: user.avatarUrl,
  });
});

router.put("/profile", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

  const user = await ensureUser(clerkUserId);
  const { displayName, minecraftUsername, bio } = req.body;

  const [updated] = await db.update(usersTable)
    .set({ displayName, minecraftUsername, bio })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json({
    id: updated.id,
    clerkUserId: updated.clerkUserId,
    username: updated.username,
    displayName: updated.displayName,
    minecraftUsername: updated.minecraftUsername,
    bio: updated.bio,
    rank: updated.rank,
    isAdmin: updated.isAdmin,
    isBanned: updated.isBanned,
    postCount: updated.postCount,
    joinedAt: updated.joinedAt?.toISOString(),
    avatarUrl: updated.avatarUrl,
  });
});

router.get("/", async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const search = req.query.search as string | undefined;
  const offset = (page - 1) * limit;

  const allUsers = await db.select().from(usersTable)
    .where(search ? or(ilike(usersTable.username, `%${search}%`), ilike(usersTable.minecraftUsername, `%${search}%`)) : undefined)
    .orderBy(desc(usersTable.joinedAt))
    .limit(limit)
    .offset(offset);

  const total = allUsers.length;
  const totalPages = Math.ceil(total / limit);

  res.json({
    users: allUsers.map(u => ({
      id: u.id,
      clerkUserId: u.clerkUserId,
      username: u.username,
      displayName: u.displayName,
      minecraftUsername: u.minecraftUsername,
      bio: u.bio,
      rank: u.rank,
      isAdmin: u.isAdmin,
      isBanned: u.isBanned,
      postCount: u.postCount,
      joinedAt: u.joinedAt?.toISOString(),
      avatarUrl: u.avatarUrl,
    })),
    total,
    page,
    totalPages,
  });
});

router.get("/:userId", async (req: any, res: any) => {
  const userId = Number(req.params.userId);
  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user.id,
    clerkUserId: user.clerkUserId,
    username: user.username,
    displayName: user.displayName,
    minecraftUsername: user.minecraftUsername,
    bio: user.bio,
    rank: user.rank,
    isAdmin: user.isAdmin,
    isBanned: user.isBanned,
    postCount: user.postCount,
    joinedAt: user.joinedAt?.toISOString(),
    avatarUrl: user.avatarUrl,
  });
});

router.post("/:userId/promote", async (req: any, res: any) => {
  const userId = Number(req.params.userId);
  const { rank } = req.body;
  const isAdmin = rank === "admin" || rank === "moderator" || rank === "owner";

  const [updated] = await db.update(usersTable)
    .set({ rank, isAdmin })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updated) return res.status(404).json({ error: "User not found" });

  res.json({
    id: updated.id,
    clerkUserId: updated.clerkUserId,
    username: updated.username,
    rank: updated.rank,
    isAdmin: updated.isAdmin,
    isBanned: updated.isBanned,
    postCount: updated.postCount,
    joinedAt: updated.joinedAt?.toISOString(),
  });
});

router.post("/:userId/ban", async (req: any, res: any) => {
  const userId = Number(req.params.userId);
  const [updated] = await db.update(usersTable)
    .set({ isBanned: true })
    .where(eq(usersTable.id, userId))
    .returning();
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json({ success: true });
});

router.post("/:userId/unban", async (req: any, res: any) => {
  const userId = Number(req.params.userId);
  const [updated] = await db.update(usersTable)
    .set({ isBanned: false })
    .where(eq(usersTable.id, userId))
    .returning();
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json({ success: true });
});

export default router;
