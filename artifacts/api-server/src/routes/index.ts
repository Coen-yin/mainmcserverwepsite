import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import forumsRouter from "./forums";
import announcementsRouter from "./announcements";
import bansRouter from "./bans";
import appealsRouter from "./appeals";
import applicationsRouter from "./applications";
import serverRouter from "./server";
import leaderboardRouter from "./leaderboard";
import votesRouter from "./votes";
import galleryRouter from "./gallery";
import rulesRouter from "./rules";
import storeRouter from "./store";
import changelogRouter from "./changelog";
import ticketsRouter from "./tickets";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/forums", forumsRouter);
router.use("/announcements", announcementsRouter);
router.use("/bans", bansRouter);
router.use("/appeals", appealsRouter);
router.use("/applications", applicationsRouter);
router.use("/server", serverRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/votes", votesRouter);
router.use("/gallery", galleryRouter);
router.use("/rules", rulesRouter);
router.use("/store", storeRouter);
router.use("/changelog", changelogRouter);
router.use("/tickets", ticketsRouter);
router.use("/admin", adminRouter);

export default router;
