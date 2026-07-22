import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";

import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { swaggerSpec } from "./docs/swagger";
import { env } from "./config/env";
import logger from "./config/logger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    message: { status: "error", message: "Muitas requisições. Tente novamente mais tarde." },
  })
);

if (env.nodeEnv !== "test") {
  app.use(pinoHttp({ logger }));
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

export default app;
