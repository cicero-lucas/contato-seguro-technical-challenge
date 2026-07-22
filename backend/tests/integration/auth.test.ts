import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma";

const baseUrl = "/api/auth";

beforeAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("Auth", () => {
  let token: string;

  it("POST /auth/register - deve registrar e retornar token", async () => {
    const res = await request(app).post(`${baseUrl}/register`).send({
      name: "Ana Costa",
      email: "ana@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).not.toHaveProperty("password");
    token = res.body.token;
  });

  it("POST /auth/register - deve retornar 409 para e-mail duplicado", async () => {
    const res = await request(app).post(`${baseUrl}/register`).send({
      name: "Ana Costa",
      email: "ana@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(409);
  });

  it("POST /auth/login - deve fazer login e retornar token", async () => {
    const res = await request(app).post(`${baseUrl}/login`).send({
      email: "ana@email.com",
      password: "senha123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("POST /auth/login - deve retornar 401 para credenciais inválidas", async () => {
    const res = await request(app).post(`${baseUrl}/login`).send({
      email: "ana@email.com",
      password: "senhaerrada",
    });

    expect(res.status).toBe(401);
  });

  it("GET /auth/me - deve retornar dados do usuário autenticado", async () => {
    const res = await request(app)
      .get(`${baseUrl}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("ana@email.com");
    expect(res.body).not.toHaveProperty("password");
  });

  it("GET /auth/me - deve retornar 401 com token inválido", async () => {
    const res = await request(app)
      .get(`${baseUrl}/me`)
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).toBe(401);
  });

  it("GET /auth/me - deve retornar 401 sem token", async () => {
    const res = await request(app).get(`${baseUrl}/me`);
    expect(res.status).toBe(401);
  });
});
