# Triagem API — Backend

API REST para triagem de atendimentos com classificação automática de tickets por IA.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando com Docker](#executando-com-docker)
- [Executando Localmente](#executando-localmente)
- [Migrations e Seed](#migrations-e-seed)
- [Endpoints e Exemplos](#endpoints-e-exemplos)
- [Classificação Automática](#classificação-automática)
- [Testes](#testes)
- [Decisões Técnicas](#decisões-técnicas)

---

## Tecnologias

| Categoria         | Tecnologia                 |
| ----------------- | -------------------------- |
| Runtime           | Node.js 20                 |
| Linguagem         | TypeScript                 |
| Framework         | Express                    |
| ORM               | Prisma                     |
| Banco de Dados    | PostgreSQL 16              |
| Autenticação    | JWT + bcrypt               |
| Validação       | Zod                        |
| IA                | Google Gemini API          |
| Logs              | Pino + pino-http           |
| Documentação    | Swagger (OpenAPI 3.0)      |
| Testes            | Jest + Supertest           |
| Containerização | Docker                     |
| Segurança        | Helmet + CORS + Rate Limit |

---

## Arquitetura

Arquitetura em camadas com Repository Pattern e princípios SOLID.

```
HTTP Request
     ↓
  Routes          ← define endpoints e aplica middlewares
     ↓
Controller        ← recebe a requisição, delega ao service, retorna resposta
     ↓
 Service          ← toda a regra de negócio fica aqui
     ↓
Repository        ← abstrai as queries do Prisma
     ↓
  Prisma
     ↓
PostgreSQL
```

**Responsabilidades por camada:**

| Camada            | Responsabilidade                                       |
| ----------------- | ------------------------------------------------------ |
| `routes/`       | Define endpoints e aplica middlewares                  |
| `controllers/`  | Recebe requisição, valida entrada, delega ao service |
| `services/`     | Regras de negócio, orquestração entre repositórios |
| `repositories/` | Queries ao banco via Prisma                            |
| `middlewares/`  | Auth JWT, tratamento de erros, async handler           |
| `validations/`  | Schemas Zod para validação de entrada                |
| `interfaces/`   | Contratos TypeScript (DTOs e interfaces)               |
| `config/`       | Env, logger e Prisma client                            |
| `utils/`        | AppError, excludePassword                              |

---

## Estrutura de Pastas

```
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── prisma.ts
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── TicketController.ts
│   │   └── UserController.ts
│   ├── docs/
│   │   └── swagger.ts
│   ├── interfaces/
│   │   ├── IAuth.ts
│   │   ├── IClassification.ts
│   │   ├── ITicket.ts
│   │   └── IUser.ts
│   ├── middlewares/
│   │   ├── asyncHandler.ts
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   ├── repositories/
│   │   ├── TicketRepository.ts
│   │   └── UserRepository.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── index.ts
│   │   ├── ticketRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── ClassificationService.ts
│   │   ├── TicketService.ts
│   │   └── UserService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   └── excludePassword.ts
│   ├── validations/
│   │   ├── authValidation.ts
│   │   ├── ticketValidation.ts
│   │   └── userValidation.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── tickets.test.ts
│   │   └── users.test.ts
│   └── unit/
│       └── classification.test.ts
├── .env.example
├── api.http
├── Dockerfile
├── jest.config.ts
├── package.json
└── tsconfig.json
```

---

## Variáveis de Ambiente

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://triagem_user:senha@localhost:5432/triagem_db"

# JWT
JWT_SECRET="seu_jwt_secret_longo_aqui"
JWT_EXPIRES_IN="7d"

# Google Gemini (opcional)
GEMINI_API_KEY="sua_gemini_api_key"

# App
PORT=3000
NODE_ENV="development"

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> Sem `GEMINI_API_KEY`, o sistema usa classificação por palavras-chave automaticamente.

---

## Executando com Docker

> O `docker-compose.yml` fica na raiz do projeto. Execute os comandos a partir da raiz.

```bash
# Sobe banco + API + frontend
docker compose up --build

# Sobe apenas o banco (para desenvolvimento local)
docker compose up -d postgres

# Para os containers
docker compose down

# Para e remove os dados do banco
docker compose down -v
```

Na primeira execução, o container da API automaticamente:

1. Aplica as migrations (`prisma migrate deploy`)
2. Popula o banco com seed
3. Inicia o servidor

---

## Executando Localmente

```bash
# 1. Suba o banco a partir da raiz do projeto
docker compose up -d postgres

# 2. Entre na pasta do backend
cd backend

# 3. Instale as dependências
npm install

# 4. Configure o .env
cp .env.example .env
# Ajuste DATABASE_URL para: postgresql://triagem_user:senha@localhost:5432/triagem_db

# 5. Aplique as migrations
npm run prisma:migrate

# 6. Popule o banco
npm run prisma:seed

# 7. Inicie em modo desenvolvimento (hot reload)
npm run dev
```

A API estará disponível em `http://localhost:3000`.

**Scripts disponíveis:**

| Script                     | Descrição                         |
| -------------------------- | ----------------------------------- |
| `npm run dev`            | Inicia com hot reload (ts-node-dev) |
| `npm run build`          | Compila TypeScript para`dist/`    |
| `npm start`              | Inicia a versão compilada          |
| `npm test`               | Roda todos os testes                |
| `npm run test:coverage`  | Testes com relatório de cobertura  |
| `npm run prisma:migrate` | Cria e aplica migrations            |
| `npm run prisma:seed`    | Popula o banco com dados de exemplo |
| `npm run prisma:studio`  | Abre o Prisma Studio (GUI do banco) |

---

## Migrations e Seed

```bash
# Aplicar migrations (desenvolvimento)
npm run prisma:migrate

# Rodar o seed manualmente
npm run prisma:seed
```

**Dados criados pelo seed:**

Usuários (senha: `senha123`): `admin@email.com`, `joao@email.com`, `maria@email.com`

9 tickets cobrindo todos os canais (`ouvidoria`, `suporte_tecnico`, `financeiro`, `sac`, `fora_do_escopo`), prioridades (`ALTA`, `MEDIA`, `BAIXA`) e status (`aberto`, `em_atendimento`, `resolvido`).

---

## Endpoints e Exemplos

### GET /health

```http
GET http://localhost:3000/health
```

**Resposta 200:**

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

### POST /api/auth/register

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Lucas Silva",
  "email": "lucas@email.com",
  "password": "senha123"
}
```

**Resposta 201:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Lucas Silva",
    "email": "lucas@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### POST /api/auth/login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "senha123"
}
```

**Resposta 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@email.com"
  }
}
```

---

### GET /api/auth/me

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer <token>
```

**Resposta 200:**

```json
{
  "id": "uuid",
  "name": "Admin",
  "email": "admin@email.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET /api/users

```http
GET http://localhost:3000/api/users
```

**Resposta 200:**

```json
[
  { "id": "uuid", "name": "Admin", "email": "admin@email.com" },
  { "id": "uuid", "name": "João Silva", "email": "joao@email.com" }
]
```

---

### POST /api/users

```http
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Maria Souza",
  "email": "maria@email.com",
  "password": "senha123"
}
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "name": "Maria Souza",
  "email": "maria@email.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT /api/users/:id

```http
PUT http://localhost:3000/api/users/<id>
Content-Type: application/json

{
  "name": "Maria Souza Atualizada"
}
```

**Resposta 200:**

```json
{
  "id": "uuid",
  "name": "Maria Souza Atualizada",
  "email": "maria@email.com"
}
```

---

### POST /api/tickets

```http
POST http://localhost:3000/api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Não consigo fazer login no sistema, aparece erro de acesso"
}
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "message": "Não consigo fazer login no sistema, aparece erro de acesso",
  "channel": "suporte_tecnico",
  "priority": "MEDIA",
  "status": "aberto",
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "name": "Lucas Silva",
    "email": "lucas@email.com"
  }
}
```

Outros exemplos de classificação:

| Mensagem                                    | Canal          | Prioridade |
| ------------------------------------------- | -------------- | ---------- |
| "Quero registrar uma denúncia de assédio" | ouvidoria      | ALTA       |
| "Recebi uma cobrança indevida no cartão"  | financeiro     | MEDIA      |
| "Meu produto chegou com defeito"            | sac            | BAIXA      |
| "Olá, tudo bem?"                           | fora_do_escopo | BAIXA      |

---

### PATCH /api/tickets/:id/status

```http
PATCH http://localhost:3000/api/tickets/<id>/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "em_atendimento"
}
```

**Resposta 200:**

```json
{
  "id": "uuid",
  "status": "em_atendimento",
  "channel": "suporte_tecnico",
  "priority": "MEDIA"
}
```

Status válidos: `aberto`, `em_atendimento`, `resolvido`

---

### Respostas de Erro

**400 — Dados inválidos (Zod):**

```json
{
  "status": "error",
  "message": "Dados inválidos",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

**401 — Não autorizado:**

```json
{ "status": "error", "message": "Token não fornecido" }
```

**404 — Não encontrado:**

```json
{ "status": "error", "message": "Ticket não encontrado" }
```

**409 — Conflito:**

```json
{ "status": "error", "message": "E-mail já cadastrado" }
```

---

## Classificação Automática

O `ClassificationService` é responsável por classificar cada mensagem.

**Fluxo:**

```
classify(message)
      ↓
GEMINI_API_KEY configurada?
   ↙ sim              ↘ não
Chama Gemini      classifyByKeywords()
      ↓
Gemini retornou JSON válido?
   ↙ sim              ↘ não
Retorna           classifyByKeywords()
channel + priority
```

**Fallback por palavras-chave** — normaliza acentos e detecta variações:

| Palavras detectadas                                    | Canal           | Prioridade |
| ------------------------------------------------------ | --------------- | ---------- |
| denúncia, fraude, assédio, abuso, discriminação... | ouvidoria       | ALTA       |
| erro, bug, login, senha, travou, bloqueado...          | suporte_tecnico | MEDIA      |
| cobrança, pagamento, reembolso, boleto...             | financeiro      | MEDIA      |
| produto, entrega, pedido, troca, assinatura...         | sac             | BAIXA      |
| qualquer outra mensagem                                | fora_do_escopo  | BAIXA      |

---

## Testes

```bash
# Suba o banco (a partir da raiz do projeto)
docker compose up -d postgres

# Aplique as migrations
npm run prisma:migrate

# Rode todos os testes
npm test

# Com cobertura
npm run test:coverage
```

**Resultado esperado:**

```
Test Suites: 4 passed, 4 total
Tests:       55 passed, 55 total
```

| Suite                      | Tipo         | O que cobre                                                             |
| -------------------------- | ------------ | ----------------------------------------------------------------------- |
| `classification.test.ts` | Unitário    | 30 casos — todos os canais, prioridades e variações de mensagem      |
| `auth.test.ts`           | Integração | Register, login, token inválido, /me autenticado                       |
| `users.test.ts`          | Integração | CRUD completo, e-mail duplicado, validações                           |
| `tickets.test.ts`        | Integração | Criação, classificação por canal, listagem, atualização de status |

---

## Decisões Técnicas

**Fallback de IA** — Se o Gemini falhar ou não estiver configurado, o sistema degrada graciosamente para palavras-chave, garantindo que todo ticket sempre seja classificado.

**asyncHandler** — Wrapper que captura erros assíncronos e os encaminha ao middleware global, eliminando try/catch repetitivo nos controllers.

**AppError** — Classe de erro customizada com `statusCode`, permitindo diferenciar erros de negócio (4xx) de erros inesperados (5xx) no middleware global.

**excludePassword** — Função utilitária que remove o campo `password` de todas as respostas, garantindo que a senha nunca seja exposta.

**NODE_ENV=test** — Desativa o logger HTTP do Pino durante os testes para manter o output limpo.

**Prisma seed** — Dados de exemplo populados automaticamente no startup do container, facilitando avaliação e testes manuais.
