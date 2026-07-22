import pino from "pino";
import { env } from "./env";

const logger = pino({
  level: env.nodeEnv === "test" ? "silent" : "info",
  transport:
    env.nodeEnv === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:standard" } }
      : undefined,
});

export default logger;
