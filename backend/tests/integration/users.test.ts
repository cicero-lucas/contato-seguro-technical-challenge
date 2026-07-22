import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma";

const baseUrl = "/api/users";

beforeAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("Users", () => {
  let userId: string;

  it("POST /users - deve criar um usuário", async () => {
    const res = await request(app).post(baseUrl).send({
      name: "Lucas Silva",
      email: "lucas@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).not.toHaveProperty("password");
    expect(res.body.email).toBe("lucas@email.com");
    userId = res.body.id;
  });

  it("POST /users - deve retornar 409 para e-mail duplicado", async () => {
    const res = await request(app).post(baseUrl).send({
      name: "Outro",
      email: "lucas@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(409);
  });

  it("POST /users - deve retornar 422 para dados inválidos", async () => {
    const res = await request(app).post(baseUrl).send({ name: "A", email: "invalido" });
    expect(res.status).toBe(422);
  });

  it("GET /users - deve listar usuários", async () => {
    const res = await request(app).get(baseUrl);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /users/:id - deve buscar usuário por ID", async () => {
    const res = await request(app).get(`${baseUrl}/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body).not.toHaveProperty("password");
  });

  it("GET /users/:id - deve retornar 404 para ID inexistente", async () => {
    const res = await request(app).get(`${baseUrl}/id-inexistente`);
    expect(res.status).toBe(404);
  });

  it("PUT /users/:id - deve atualizar usuário", async () => {
    const res = await request(app).put(`${baseUrl}/${userId}`).send({ name: "Lucas Atualizado" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Lucas Atualizado");
    expect(res.body).not.toHaveProperty("password");
  });
});
