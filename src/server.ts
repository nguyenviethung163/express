import app from "./app";
import env from "./configs/env";
import { logger } from "./shared/utils/pino-logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT || 9000;

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});

configureGracefulShutdown(server);
