import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const [admin, joao, maria] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@email.com",
        password: await bcrypt.hash("12345", 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "João Silva",
        email: "joao@email.com",
        password: await bcrypt.hash("12345", 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "Maria Souza",
        email: "maria@email.com",
        password: await bcrypt.hash("12345", 10),
      },
    }),
  ]);

  await prisma.ticket.createMany({
    data: [
      {
        message: "Fui assediado por um funcionário na loja ontem.",
        channel: "ouvidoria",
        priority: "ALTA",
        status: "aberto",
        userId: joao.id,
      },
      {
        message: "Detectei uma fraude na minha conta bancária.",
        channel: "ouvidoria",
        priority: "ALTA",
        status: "em_atendimento",
        userId: maria.id,
      },
      {
        message: "Não consigo fazer login no sistema, aparece erro de acesso.",
        channel: "suporte_tecnico",
        priority: "MEDIA",
        status: "aberto",
        userId: joao.id,
      },
      {
        message: "O sistema travou e não carrega a página principal.",
        channel: "suporte_tecnico",
        priority: "MEDIA",
        status: "resolvido",
        userId: admin.id,
      },
      {
        message: "Recebi uma cobrança indevida no meu cartão de crédito.",
        channel: "financeiro",
        priority: "MEDIA",
        status: "aberto",
        userId: maria.id,
      },
      {
        message: "Quero solicitar reembolso de uma compra cancelada.",
        channel: "financeiro",
        priority: "MEDIA",
        status: "em_atendimento",
        userId: joao.id,
      },
      {
        message: "Meu produto chegou com defeito, preciso de troca.",
        channel: "sac",
        priority: "BAIXA",
        status: "aberto",
        userId: maria.id,
      },
      {
        message: "Quero cancelar minha assinatura do plano mensal.",
        channel: "sac",
        priority: "BAIXA",
        status: "resolvido",
        userId: admin.id,
      },
      {
        message: "Olá, gostaria de saber mais sobre os serviços.",
        channel: "fora_do_escopo",
        priority: "BAIXA",
        status: "aberto",
        userId: joao.id,
      },
    ],
  });

  console.log(" Seed concluído:");
  console.log("   Usuários: admin@email.com, joao@email.com, maria@email.com");
  console.log("   Senha de todos: 12345");
  console.log("   Tickets: 9 criados cobrindo todos os canais e prioridades");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
