import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only activate Clerk middleware when the secret key is present.
// Without it every API request would crash with "Publishable key is missing".
// The backend reuses VITE_CLERK_PUBLISHABLE_KEY (same key, different prefix).
const clerkHandler: RequestHandler = process.env.CLERK_SECRET_KEY
  ? clerkMiddleware({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey:
        process.env.CLERK_PUBLISHABLE_KEY ??
        process.env.VITE_CLERK_PUBLISHABLE_KEY,
    })
  : (_req, _res, next) => next();

app.use("/api", clerkHandler, router);

// Serve frontend static files in production
const frontendDist = path.resolve(__dirname, "../../techy-mc/dist/public");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
