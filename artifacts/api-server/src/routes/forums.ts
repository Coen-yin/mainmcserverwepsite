import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { forumCategoriesTable, forumThreadsTable, forumPostsTable, usersTable } from "@workspace/db";
import { eq, desc, asc, count } from "drizzle-orm";

const router = Router();

router.get("/categories", async (_req: any, res: any) => {
  const cats = await db.select().from(forumCategoriesTable).orderBy(asc(forumCategoriesTable.id));

  const result = await Promise.all(cats.map(async (cat) => {
    const lastPosts = await db.select().from(forumPostsTable)
      .innerJoin(forumThreadsTable, eq(forumPostsTable.threadId, forumThreadsTable.id))
      .where(eq(forumThreadsTable.categoryId, cat.id))
      .orderBy(desc(forumPostsTable.createdAt))
      .limit(1);

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      icon: cat.icon,
      threadCount: cat.threadCount,
      postCount: cat.postCount,
      lastPost: lastPosts[0]?.forum_posts ? {
        id: lastPosts[0].forum_posts.id,
        threadId: lastPosts[0].forum_posts.threadId,
        authorId: lastPosts[0].forum_posts.authorId,
        authorName: lastPosts[0].forum_posts.authorName,
        authorRank: lastPosts[0].forum_posts.authorRank,
        content: lastPosts[0].forum_posts.content,
        createdAt: lastPosts[0].forum_posts.createdAt?.toISOString(),
      } : undefined,
    };
  }));

  res.json(result);
});

router.post("/categories", async (req: any, res: any) => {
  const { name, description, color, icon } = req.body;
  const [cat] = await db.insert(forumCategoriesTable).values({ name, description, color, icon }).returning();
  res.status(201).json({ id: cat.id, name: cat.name, description: cat.description, color: cat.color, icon: cat.icon, threadCount: 0, postCount: 0 });
});

router.get("/threads", async (req: any, res: any) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  let query = db.select().from(forumThreadsTable);
  if (categoryId) {
    const threads = await db.select().from(forumThreadsTable)
      .where(eq(forumThreadsTable.categoryId, categoryId))
      .orderBy(desc(forumThreadsTable.isPinned), desc(forumThreadsTable.lastReplyAt))
      .limit(limit).offset(offset);

    const cat = await db.query.forumCategoriesTable.findFirst({ where: eq(forumCategoriesTable.id, categoryId) });

    res.json({
      threads: threads.map(t => ({
        ...t,
        categoryName: cat?.name || "",
        lastReplyAt: t.lastReplyAt?.toISOString(),
        createdAt: t.createdAt?.toISOString(),
      })),
      total: threads.length,
      page,
      totalPages: 1,
    });
  } else {
    const threads = await db.select().from(forumThreadsTable)
      .orderBy(desc(forumThreadsTable.isPinned), desc(forumThreadsTable.lastReplyAt))
      .limit(limit).offset(offset);

    res.json({
      threads: threads.map(t => ({
        ...t,
        categoryName: "",
        lastReplyAt: t.lastReplyAt?.toISOString(),
        createdAt: t.createdAt?.toISOString(),
      })),
      total: threads.length,
      page,
      totalPages: 1,
    });
  }
});

router.post("/threads", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkUserId, clerkUserId) });
  if (!user) return res.status(401).json({ error: "User not found" });

  const { title, content, categoryId } = req.body;
  const now = new Date();

  const [thread] = await db.insert(forumThreadsTable).values({
    title,
    categoryId,
    authorId: user.id,
    authorName: user.username,
    authorRank: user.rank,
    lastReplyAt: now,
  }).returning();

  await db.insert(forumPostsTable).values({
    threadId: thread.id,
    authorId: user.id,
    authorName: user.username,
    authorRank: user.rank,
    content,
  });

  await db.update(forumCategoriesTable)
    .set({ threadCount: db.$count(forumThreadsTable, eq(forumThreadsTable.categoryId, categoryId)) as any })
    .where(eq(forumCategoriesTable.id, categoryId));

  res.status(201).json({
    id: thread.id,
    title: thread.title,
    categoryId: thread.categoryId,
    categoryName: "",
    authorId: thread.authorId,
    authorName: thread.authorName,
    authorRank: thread.authorRank,
    replyCount: 0,
    viewCount: 0,
    isPinned: thread.isPinned,
    isLocked: thread.isLocked,
    lastReplyAt: thread.lastReplyAt?.toISOString(),
    createdAt: thread.createdAt?.toISOString(),
  });
});

router.get("/threads/:threadId", async (req: any, res: any) => {
  const threadId = Number(req.params.threadId);
  const thread = await db.query.forumThreadsTable.findFirst({ where: eq(forumThreadsTable.id, threadId) });
  if (!thread) return res.status(404).json({ error: "Thread not found" });

  await db.update(forumThreadsTable).set({ viewCount: thread.viewCount + 1 }).where(eq(forumThreadsTable.id, threadId));

  const posts = await db.select().from(forumPostsTable).where(eq(forumPostsTable.threadId, threadId)).orderBy(asc(forumPostsTable.createdAt));
  const cat = await db.query.forumCategoriesTable.findFirst({ where: eq(forumCategoriesTable.id, thread.categoryId) });

  res.json({
    thread: {
      ...thread,
      categoryName: cat?.name || "",
      lastReplyAt: thread.lastReplyAt?.toISOString(),
      createdAt: thread.createdAt?.toISOString(),
    },
    posts: posts.map(p => ({ ...p, createdAt: p.createdAt?.toISOString() })),
    total: posts.length,
  });
});

router.delete("/threads/:threadId", async (req: any, res: any) => {
  const threadId = Number(req.params.threadId);
  await db.delete(forumPostsTable).where(eq(forumPostsTable.threadId, threadId));
  await db.delete(forumThreadsTable).where(eq(forumThreadsTable.id, threadId));
  res.json({ success: true, message: "Thread deleted" });
});

router.post("/threads/:threadId/posts", async (req: any, res: any) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;
  if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

  const user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkUserId, clerkUserId) });
  if (!user) return res.status(401).json({ error: "User not found" });

  const threadId = Number(req.params.threadId);
  const { content } = req.body;
  const now = new Date();

  const [post] = await db.insert(forumPostsTable).values({
    threadId,
    authorId: user.id,
    authorName: user.username,
    authorRank: user.rank,
    content,
  }).returning();

  const thread = await db.query.forumThreadsTable.findFirst({ where: eq(forumThreadsTable.id, threadId) });
  if (thread) {
    await db.update(forumThreadsTable).set({ replyCount: thread.replyCount + 1, lastReplyAt: now }).where(eq(forumThreadsTable.id, threadId));
    await db.update(usersTable).set({ postCount: user.postCount + 1 }).where(eq(usersTable.id, user.id));
  }

  res.status(201).json({ ...post, createdAt: post.createdAt?.toISOString() });
});

router.post("/threads/:threadId/pin", async (req: any, res: any) => {
  const threadId = Number(req.params.threadId);
  const thread = await db.query.forumThreadsTable.findFirst({ where: eq(forumThreadsTable.id, threadId) });
  if (!thread) return res.status(404).json({ error: "Not found" });
  const [updated] = await db.update(forumThreadsTable).set({ isPinned: !thread.isPinned }).where(eq(forumThreadsTable.id, threadId)).returning();
  res.json({ ...updated, lastReplyAt: updated.lastReplyAt?.toISOString(), createdAt: updated.createdAt?.toISOString() });
});

router.post("/threads/:threadId/lock", async (req: any, res: any) => {
  const threadId = Number(req.params.threadId);
  const thread = await db.query.forumThreadsTable.findFirst({ where: eq(forumThreadsTable.id, threadId) });
  if (!thread) return res.status(404).json({ error: "Not found" });
  const [updated] = await db.update(forumThreadsTable).set({ isLocked: !thread.isLocked }).where(eq(forumThreadsTable.id, threadId)).returning();
  res.json({ ...updated, lastReplyAt: updated.lastReplyAt?.toISOString(), createdAt: updated.createdAt?.toISOString() });
});

router.delete("/posts/:postId", async (req: any, res: any) => {
  const postId = Number(req.params.postId);
  await db.delete(forumPostsTable).where(eq(forumPostsTable.id, postId));
  res.json({ success: true, message: "Post deleted" });
});

router.get("/stats", async (_req: any, res: any) => {
  const [threadsRes] = await db.select({ cnt: count() }).from(forumThreadsTable);
  const [postsRes] = await db.select({ cnt: count() }).from(forumPostsTable);
  const [usersRes] = await db.select({ cnt: count() }).from(usersTable);
  const lastUser = await db.select().from(usersTable).orderBy(desc(usersTable.joinedAt)).limit(1);

  res.json({
    totalThreads: Number(threadsRes?.cnt || 0),
    totalPosts: Number(postsRes?.cnt || 0),
    totalMembers: Number(usersRes?.cnt || 0),
    newestMember: lastUser[0]?.username || "",
    onlineNow: Math.floor(Math.random() * 10),
  });
});

export default router;
