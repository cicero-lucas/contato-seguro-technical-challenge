import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma";

const baseUrl = "/api/tickets";

let token: string;
let ticketId: string;

beforeAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const res = await request(app).post("/api/auth/register").send({
    name: "Carlos Teste",
    email: "carlos@email.com",
    password: "senha123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("Tickets", () => {
  it("POST /tickets - deve criar ticket e classificar automaticamente", async () => {
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Estou com erro de login no sistema" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("channel");
    expect(res.body.status).toBe("aberto");
    ticketId = res.body.id;
  });

  it("POST /tickets - deve classificar como ouvidoria para denúncia", async () => {
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Quero fazer uma denúncia de fraude" });

    expect(res.status).toBe(201);
    expect(res.body.channel).toBe("ouvidoria");
  });

  it("POST /tickets - deve classificar como financeiro para cobrança", async () => {
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Recebi uma cobrança indevida no meu cartão" });

    expect(res.status).toBe(201);
    expect(res.body.channel).toBe("financeiro");
  });

  it("POST /tickets - deve classificar como sac para problema com produto", async () => {
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Meu produto chegou com defeito na entrega" });

    expect(res.status).toBe(201);
    expect(res.body.channel).toBe("sac");
  });

  it("POST /tickets - deve retornar 401 sem autenticação", async () => {
    const res = await request(app).post(baseUrl).send({ message: "Mensagem sem token" });
    expect(res.status).toBe(401);
  });

  it("POST /tickets - deve retornar 422 para mensagem inválida", async () => {
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "oi" });

    expect(res.status).toBe(422);
  });

  it("GET /tickets - deve listar tickets", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /tickets/:id - deve buscar ticket por ID", async () => {
    const res = await request(app)
      .get(`${baseUrl}/${ticketId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ticketId);
  });

  it("GET /tickets/:id - deve retornar 404 para ID inexistente", async () => {
    const res = await request(app)
      .get(`${baseUrl}/id-inexistente`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("PATCH /tickets/:id/status - deve atualizar status do ticket", async () => {
    const res = await request(app)
      .patch(`${baseUrl}/${ticketId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "em_atendimento" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("em_atendimento");
  });

  it("PATCH /tickets/:id/status - deve retornar 422 para status inválido", async () => {
    const res = await request(app)
      .patch(`${baseUrl}/${ticketId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "invalido" });

    expect(res.status).toBe(422);
  });
});
