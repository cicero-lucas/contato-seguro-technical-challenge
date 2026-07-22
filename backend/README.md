# Triagem API

API REST profissional para triagem de atendimentos com classificação automática de tickets via Inteligência Artificial (Google Gemini).

---

## Objetivo

Permitir o cadastro de usuários, criação e consulta de tickets de atendimento, com classificação automática do canal de atendimento utilizando IA, além de autenticação JWT e testes automatizados completos.

---

## Tecnologias Utilizadas

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
| Containerização | Docker + Docker Compose    |
| Segurança        | Helmet + CORS + Rate Limit |

---

## Arquitetura

O projeto segue **Arquitetura em Camadas (Layered Architecture)** com os princípios **SOLID** e **Repository Pattern**.

```
HTTP Request
     ↓
  Routes
     ↓
 Controller        ← sem regras de negócio
     ↓
  Service          ← toda regra de negócio aqui
     ↓
 Repository        ← exclusivamente comunicação com banco
     ↓
   Prisma
     ↓
 PostgreSQL
```

**Responsabilidades por camada:**

- `routes/` — define os endpoints e aplica middlewares
- `controllers/` — recebe a requisição, delega ao service, retorna a resposta
- `services/` — contém toda a lógica de negócio
- `repositories/` — abstrai as queries do Prisma
- `middlewares/` — autenticação, tratamento de erros, async handler
- `validations/` — schemas Zod para validação de entrada
- `interfaces/` — contratos TypeScript (DTOs e interfaces de serviço)
- `config/` — configurações de ambiente, logger e Prisma client
- `utils/` — utilitários reutilizáveis (AppError, excludePassword)
- `docs/` — configuração do Swagger

---

## Estrutura de Pastas

```
backend/
├── prisma/
│   └── schema.prisma
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
├── .env
├── .env.example
├── api.http
├── docker-compose.yml
├── Dockerfile
├── jest.config.ts
├── package.json
└── tsconfig.json
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/triagem_db"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"
JWT_EXPIRES_IN="7d"

# Google Gemini
GEMINI_API_KEY="sua_gemini_api_key_aqui"

# App
PORT=3000
NODE_ENV="development"

# Rate Limit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> A `GEMINI_API_KEY` é opcional. Se não configurada, o sistema usa automaticamente o fallback por palavras-chave.

---

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com suas configurações
```

---

## Docker

### Subir toda a aplicação (API + PostgreSQL)

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`.

### Subir apenas o banco (para desenvolvimento local)

```bash
docker compose up -d postgres
```

---

## Migrations do Prisma

```bash
# Criar e aplicar migration (desenvolvimento)
npm run prisma:migrate

# Apenas gerar o Prisma Client
npm run prisma:generate

# Abrir o Prisma Studio
npm run prisma:studio
```

Em produção (via Docker), as migrations são aplicadas automaticamente no startup do container.

---

## Como Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

---

## Como Rodar os Testes

Os testes de integração requerem o PostgreSQL rodando.

```bash
# Subir o banco
docker compose up -d postgres

# Aplicar migrations
npm run prisma:migrate

# Rodar todos os testes
npm test

# Rodar com cobertura
npm run test:coverage
```

**Resultado esperado:**

```
Test Suites: 4 passed, 4 total
Tests:       33 passed, 33 total
```

---

## Endpoints

### Health Check

| Método | Rota        | Descrição   | Auth |
| ------- | ----------- | ------------- | ---- |
| GET     | `/health` | Status da API | Não |

### Auth

| Método | Rota                   | Descrição                   | Auth |
| ------- | ---------------------- | ----------------------------- | ---- |
| POST    | `/api/auth/register` | Registrar usuário            | Não |
| POST    | `/api/auth/login`    | Login                         | Não |
| GET     | `/api/auth/me`       | Dados do usuário autenticado | Sim  |

### Users

| Método | Rota               | Descrição            | Auth |
| ------- | ------------------ | ---------------------- | ---- |
| GET     | `/api/users`     | Listar usuários       | Não |
| GET     | `/api/users/:id` | Buscar usuário por ID | Não |
| POST    | `/api/users`     | Criar usuário         | Não |
| PUT     | `/api/users/:id` | Atualizar usuário     | Não |

### Tickets

| Método | Rota                        | Descrição                                | Auth |
| ------- | --------------------------- | ------------------------------------------ | ---- |
| GET     | `/api/tickets`            | Listar tickets                             | Sim  |
| GET     | `/api/tickets/:id`        | Buscar ticket por ID                       | Sim  |
| POST    | `/api/tickets`            | Criar ticket (classificação automática) | Sim  |
| PATCH   | `/api/tickets/:id/status` | Atualizar status                           | Sim  |

---

## Exemplos de Requisição e Resposta

### POST /api/auth/register

**Request:**

```json
{
  "name": "Lucas Silva",
  "email": "lucas@email.com",
  "password": "senha123"
}
```

**Response 201:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Lucas Silva",
    "email": "lucas@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/auth/login

**Request:**

```json
{
  "email": "lucas@email.com",
  "password": "senha123"
}
```

**Response 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Lucas Silva",
    "email": "lucas@email.com"
  }
}
```

### POST /api/tickets

**Request:**

```json
{
  "message": "Não consigo fazer login no sistema, aparece erro de acesso"
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "message": "Não consigo fazer login no sistema, aparece erro de acesso",
  "channel": "suporte_tecnico",
  "status": "aberto",
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "name": "Lucas Silva",
    "email": "lucas@email.com"
  }
}
```

### PATCH /api/tickets/:id/status

**Request:**

```json
{
  "status": "em_atendimento"
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "status": "em_atendimento",
  "channel": "suporte_tecnico",
  ...
}
```

### Resposta de erro (422 - Validação)

```json
{
  "status": "error",
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

### Resposta de erro (401 - Não autorizado)

```json
{
  "status": "error",
  "message": "Token não fornecido"
}
```

---

## Fluxo da Aplicação

### Criação de Ticket com Classificação por IA

```
1. Usuário autenticado envia POST /api/tickets com { message }
2. TicketController valida a mensagem via Zod
3. TicketService verifica se o usuário existe
4. TicketService chama ClassificationService.classify(message)
5. ClassificationService envia o prompt ao Google Gemini
6. Gemini retorna o canal em JSON: { "channel": "suporte_tecnico" }
7. Se Gemini falhar → fallback por palavras-chave
8. TicketRepository persiste o ticket com o canal classificado
9. Ticket retornado com status "aberto" e canal definido
```

---

## Prompt Utilizado para IA

```
Você é um classificador de tickets.
Sua função é classificar mensagens em apenas um canal.
Responda SOMENTE neste formato JSON:
{"channel":"suporte_tecnico"}

Os únicos valores permitidos são:
ouvidoria
sac
suporte_tecnico
financeiro
fora_do_escopo

Critérios:
Denúncia, fraude ou assédio → ouvidoria
Produto, entrega ou assinatura → sac
Erro, bug, login, acesso ou indisponibilidade → suporte_tecnico
Cobrança, pagamento ou reembolso → financeiro
Qualquer outro assunto → fora_do_escopo

Nunca escreva explicações.
Nunca utilize Markdown.
Nunca escreva comentários.
Responder somente JSON válido.
```

### Fallback por Palavras-chave

Quando o Gemini está indisponível ou não configurado, o sistema classifica automaticamente por palavras-chave:

| Palavras-chave                              | Canal           |
| ------------------------------------------- | --------------- |
| denúncia, fraude, assédio                 | ouvidoria       |
| produto, entrega, assinatura                | sac             |
| erro, bug, login, acesso, indisponibilidade | suporte_tecnico |
| cobrança, pagamento, reembolso             | financeiro      |
| qualquer outra mensagem                     | fora_do_escopo  |

---

## Decisões Arquiteturais

**Arquitetura em Camadas com Repository Pattern**
Garante separação de responsabilidades, facilita testes unitários com mocks e permite trocar o ORM sem impactar a lógica de negócio.

**ClassificationService isolado**
O TicketService não conhece detalhes do Gemini. A dependência é injetada via interface `IClassificationService`, respeitando o princípio de inversão de dependência (SOLID - D).

**Fallback automático de IA**
Se a GEMINI_API_KEY não estiver configurada ou o serviço estiver indisponível, o sistema degrada graciosamente para classificação por palavras-chave, garantindo disponibilidade.

**asyncHandler**
Wrapper que captura erros assíncronos e os encaminha ao middleware de erro global, eliminando try/catch repetitivo nos controllers.

**AppError**
Classe de erro customizada com statusCode, permitindo que o middleware de erro global trate erros de negócio e erros inesperados de forma diferenciada.

**Senha nunca retornada**
A função `excludePassword` garante que o campo `password` seja removido de todas as respostas que envolvem dados de usuário.

**NODE_ENV=test desativa o logger HTTP**
O pino-http é desativado durante os testes para manter o output limpo.

---

## Diferenciais Implementados

- **Google Gemini API** — classificação automática de tickets com IA generativa
- **Fallback inteligente** — classificação por palavras-chave quando a IA está indisponível
- **JWT + bcrypt** — autenticação segura com senha criptografada
- **Swagger** — documentação interativa disponível em `/api-docs`
- **Docker + Docker Compose** — ambiente completo containerizado
- **Pino** — logging estruturado de alta performance
- **Helmet + CORS + Rate Limit** — camadas de segurança em produção
- **Zod** — validação com mensagens de erro padronizadas
- **33 testes automatizados** — cobertura completa de integração e unitária
- **Arquivo `.http`** — coleção de requisições prontas para uso no VS Code (REST Client)

---

## Documentação Interativa

Com a API rodando, acesse:

```
http://localhost:3000/api-docs
```
