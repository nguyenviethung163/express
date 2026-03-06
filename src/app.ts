import express, { Express, Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import "source-map-support/register";

import Routes from "./routes/index";
import path from "node:path";

import { errorHandler } from "./shared/middlewares/error-handler";
import { notFoundHandler } from "./shared/middlewares/not-found-handler";
import { configureSecurityHeaders } from "./shared/middlewares/security-header";
import { httpLogger } from "./shared/middlewares/logger.middleware";
import { rateLimiter } from "./shared/middlewares/rate-limiter";
import { setupSwagger } from "./app.swagger";
import env from "./configs/env";

const app: Express = express();

// Security and Logging
configureSecurityHeaders(app);
setupSwagger(app);
app.use(httpLogger);
app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Routes

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/health");
});

app.use("/api", Routes);

// Not found handler (should be after routes)
app.use(notFoundHandler);

// Global error handler (should be last)
app.use(errorHandler);

export default app;
