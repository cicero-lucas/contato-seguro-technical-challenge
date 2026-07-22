import app from "./app";
import { env } from "./config/env";
import logger from "./config/logger";
import prisma from "./config/prisma";

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info("Banco de dados conectado");

    app.listen(env.port, () => {
      logger.info(`Servidor rodando na porta ${env.port}`);
      logger.info(`Swagger disponível em http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    logger.error({ error }, "Erro ao iniciar servidor");
    process.exit(1);
  }
}

bootstrap();
