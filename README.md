# Triagem API

<div style="display:flex; flex-wrap:wrap; gap:6px; justify-content:center;">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/bcrypt-4A4A4A?logo=securityscorecard&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?logo=google-gemini&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Pino-F9A825?logo=javascript&logoColor=black" height="24" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black" height="24" />
  <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Helmet-000000?logo=helmet&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/CORS-00599C?logo=cloudflare&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Rate_Limit-FF6B35?logo=shield&logoColor=white" height="24" />
</div>

API REST para triagem de atendimentos com classificação automática de tickets por Inteligência Artificial (Google Gemini) e fallback inteligente por palavras-chave.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Modelo de IA](#modelo-de-ia)
- [Como Rodar com Docker](#como-rodar-com-docker)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Dados de Seed](#dados-de-seed)
- [Endpoints e Exemplos](#endpoints-e-exemplos)
- [Classificação Automática](#classificação-automática)
- [Testes](#testes)
- [Documentação Interativa](#documentação-interativa)
- [Deploy na AWS](#deploy-na-aws)
- [Autor](#autor)
- [Licença](#licença)

---

## Visão Geral

O sistema permite que usuários autenticados abram tickets de atendimento enviando uma mensagem de texto. A mensagem é automaticamente classificada em um canal (`ouvidoria`, `suporte_tecnico`, `financeiro`, `sac`, `fora_do_escopo`) e recebe uma prioridade (`ALTA`, `MEDIA`, `BAIXA`) via Google Gemini. Caso a IA esteja indisponível, um fallback por palavras-chave garante que a classificação sempre ocorra.

<img src="./.github/assets/demo.gif" width="800" alt="Demonstração da aplicação">

---

## Tecnologias

| Camada            | Tecnologia                 |
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

O projeto segue arquitetura em camadas com Repository Pattern e princípios SOLID.

<img src="./.github/assets/arquitetura_projeto.png" width="750" alt="Arquitetura do Projeto">

---

## Estrutura do Projeto

```
contato-seguro-technical-challenge/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── interfaces/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose — para rodar com containers
- [Node.js 20+](https://nodejs.org/) — para rodar localmente sem Docker

---

## Variáveis de Ambiente

Copie o arquivo de exemplo na raiz do projeto e ajuste os valores:

```bash
cp .env.example .env
```

| Variável          | Descrição                           | Padrão                       |
| ------------------ | ------------------------------------- | ----------------------------- |
| `DB_USER`        | Usuário do PostgreSQL                | `triagem_user`              |
| `DB_PASSWORD`    | Senha do PostgreSQL                   | —                            |
| `DB_NAME`        | Nome do banco                         | `triagem_db`                |
| `DB_PORT`        | Porta exposta do banco                | `5432`                      |
| `PORT`           | Porta da API                          | `3000`                      |
| `JWT_SECRET`     | Chave secreta para assinar tokens JWT | —                            |
| `JWT_EXPIRES_IN` | Tempo de expiração do token         | `7d`                        |
| `GEMINI_API_KEY` | Chave da API do Google Gemini         | opcional                      |
| `GEMINI_MODEL`   | Modelo do Gemini a ser utilizado      | `gemini-3-flash-preview`    |
| `VITE_API_URL`   | URL da API consumida pelo frontend    | `http://localhost:3000/api` |

> `GEMINI_API_KEY` é opcional. Sem ela, o sistema usa classificação por palavras-chave automaticamente.

---

## Modelo de IA

O sistema utiliza a **Google Gemini API** para classificar automaticamente as mensagens dos tickets.

### Modelo utilizado

Por padrão o modelo configurado é o `gemini-3-flash-preview`, definido via variável de ambiente `GEMINI_MODEL`. Você pode trocar para qualquer modelo disponível na sua chave sem alterar o código.

| Modelo                     | Velocidade | Custo |
| -------------------------- | ---------- | ----- |
| `gemini-3-flash-preview` | Rápido    | Baixo |
| `gemini-2.0-flash`       | Rápido    | Baixo |
| `gemini-2.5-pro`         | Lento      | Alto  |

### Como obter a chave

1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Faça login com sua conta Google
3. Clique em **Get API key** → **Create API key**
4. Copie a chave gerada e adicione no `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3-flash-preview
```

> A chave é gratuita com limites de uso. Caso a cota seja atingida, o sistema faz fallback automático para classificação por palavras-chave sem interromper o serviço.

### Fluxo de classificação

<img src="./.github/assets/diagrama.png" width="700" alt="Diagrama de Classificação">

---

## Como Rodar com Docker

> Recomendado. Sobe banco, API e frontend com um único comando.

```bash
# 1. Clone o repositório
git clone https://github.com/cicero-lucas/contato-seguro-technical-challenge
cd contato-seguro-technical-challenge

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Suba toda a aplicação
docker compose up --build
```

Na primeira execução o Docker irá:

1. Subir o PostgreSQL e aguardar o healthcheck
2. Aplicar as migrations do Prisma
3. Popular o banco com os dados de seed
4. Iniciar a API e o frontend

Serviços disponíveis após o boot:

| Serviço     | URL                            |
| ------------ | ------------------------------ |
| API          | http://localhost:3000          |
| Swagger      | http://localhost:3000/api-docs |
| Frontend     | http://localhost:80            |
| Health Check | http://localhost:3000/health   |

Para parar:

```bash
docker compose down
```

Para parar e remover os dados do banco:

```bash
docker compose down -v
```

---

## Como Rodar Localmente

> Para desenvolvimento sem Docker completo. Requer apenas o banco containerizado.

### Backend

```bash
# 1. Na raiz do projeto, suba apenas o banco
docker compose up -d postgres

# 2. Entre na pasta do backend
cd backend

# 3. Instale as dependências
npm install

# 4. Configure o .env do backend
cp .env.example .env
```

Edite o `backend/.env` e ajuste a `DATABASE_URL` para apontar para localhost:

```env
DATABASE_URL="postgresql://triagem_user:sua_senha@localhost:5432/triagem_db"
```

```bash
# 5. Aplique as migrations
npm run prisma:migrate

# 6. Popule o banco com dados de seed
npm run prisma:seed

# 7. Inicie o servidor em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`.

**Scripts disponíveis:**

| Script                     | Descrição                         |
| -------------------------- | ----------------------------------- |
| `npm run dev`            | Inicia com hot reload               |
| `npm run build`          | Compila TypeScript para`dist/`    |
| `npm start`              | Inicia a versão compilada          |
| `npm test`               | Roda todos os testes                |
| `npm run test:coverage`  | Testes com relatório de cobertura  |
| `npm run prisma:migrate` | Cria e aplica migrations            |
| `npm run prisma:seed`    | Popula o banco com dados de exemplo |
| `npm run prisma:studio`  | Abre o Prisma Studio (GUI do banco) |

### Frontend

```bash
# 1. Entre na pasta do frontend (em outro terminal)
cd frontend

# 2. Instale as dependências
npm install

# 3. Configure o .env do frontend
cp .env.example .env
```

Edite o `frontend/.env` e aponte para a API local:

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Dados de Seed

O banco é populado automaticamente com dados de exemplo ao subir o projeto.

**Usuários** — senha de todos: `senha123`

| Nome        | E-mail          |
| ----------- | --------------- |
| Admin       | admin@email.com |
| João Silva | joao@email.com  |
| Maria Souza | maria@email.com |

**Tickets** — 9 tickets cobrindo todos os canais, prioridades e status:

| Canal           | Prioridade | Status         | Mensagem                                                       |
| --------------- | ---------- | -------------- | -------------------------------------------------------------- |
| ouvidoria       | ALTA       | aberto         | "Fui assediado por um funcionário na loja ontem."             |
| ouvidoria       | ALTA       | em_atendimento | "Detectei uma fraude na minha conta bancária."                |
| suporte_tecnico | MEDIA      | aberto         | "Não consigo fazer login no sistema, aparece erro de acesso." |
| suporte_tecnico | MEDIA      | resolvido      | "O sistema travou e não carrega a página principal."         |
| financeiro      | MEDIA      | aberto         | "Recebi uma cobrança indevida no meu cartão de crédito."    |
| financeiro      | MEDIA      | em_atendimento | "Quero solicitar reembolso de uma compra cancelada."           |
| sac             | BAIXA      | aberto         | "Meu produto chegou com defeito, preciso de troca."            |
| sac             | BAIXA      | resolvido      | "Quero cancelar minha assinatura do plano mensal."             |
| fora_do_escopo  | BAIXA      | aberto         | "Olá, gostaria de saber mais sobre os serviços."             |

---

## Endpoints e Exemplos

### GET /health

```bash
curl http://localhost:3000/health
```

**Resposta 200:**

```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

### POST /api/auth/register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Lucas Silva", "email": "lucas@email.com", "password": "senha123"}'
```

**Resposta 201:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "name": "Lucas Silva", "email": "lucas@email.com" }
}
```

---

### POST /api/auth/login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@email.com", "password": "senha123"}'
```

**Resposta 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "name": "Admin", "email": "admin@email.com" }
}
```

---

### GET /api/auth/me

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Resposta 200:**

```json
{ "id": "uuid", "name": "Admin", "email": "admin@email.com", "createdAt": "2024-01-01T00:00:00.000Z" }
```

---

### GET /api/users

```bash
curl http://localhost:3000/api/users
```

**Resposta 200:**

```json
[
  { "id": "uuid", "name": "Admin", "email": "admin@email.com" },
  { "id": "uuid", "name": "João Silva", "email": "joao@email.com" }
]
```

---

### GET /api/users/:id

```bash
curl http://localhost:3000/api/users/<id>
```

**Resposta 200:**

```json
{ "id": "uuid", "name": "Admin", "email": "admin@email.com", "createdAt": "2024-01-01T00:00:00.000Z" }
```

---

### POST /api/users

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Souza", "email": "maria@email.com", "password": "senha123"}'
```

**Resposta 201:**

```json
{ "id": "uuid", "name": "Maria Souza", "email": "maria@email.com", "createdAt": "2024-01-01T00:00:00.000Z" }
```

---

### PUT /api/users/:id

```bash
curl -X PUT http://localhost:3000/api/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Souza Atualizada"}'
```

**Resposta 200:**

```json
{ "id": "uuid", "name": "Maria Souza Atualizada", "email": "maria@email.com" }
```

---

### GET /api/tickets

```bash
curl http://localhost:3000/api/tickets \
  -H "Authorization: Bearer <token>"
```

**Resposta 200:**

```json
[
  {
    "id": "uuid",
    "message": "Não consigo fazer login no sistema",
    "channel": "suporte_tecnico",
    "priority": "MEDIA",
    "status": "aberto",
    "user": { "id": "uuid", "name": "Admin", "email": "admin@email.com" }
  }
]
```

---

### GET /api/tickets/:id

```bash
curl http://localhost:3000/api/tickets/<id> \
  -H "Authorization: Bearer <token>"
```

**Resposta 200:**

```json
{
  "id": "uuid",
  "message": "Não consigo fazer login no sistema",
  "channel": "suporte_tecnico",
  "priority": "MEDIA",
  "status": "aberto",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": { "id": "uuid", "name": "Admin", "email": "admin@email.com" }
}
```

---

### POST /api/tickets

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Não consigo fazer login no sistema, aparece erro de acesso"}'
```

**Resposta 201:**

```json
{
  "id": "uuid",
  "message": "Não consigo fazer login no sistema, aparece erro de acesso",
  "channel": "suporte_tecnico",
  "priority": "MEDIA",
  "status": "aberto",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": { "id": "uuid", "name": "Lucas Silva", "email": "lucas@email.com" }
}
```

---

### PATCH /api/tickets/:id/status

```bash
curl -X PATCH http://localhost:3000/api/tickets/<id>/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "em_atendimento"}'
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

## Classificação Automática

Ao criar um ticket, o sistema classifica automaticamente a mensagem em um canal e define a prioridade.

**Tabela de classificação:**

| Canal               | Prioridade | Exemplos de mensagem                                |
| ------------------- | ---------- | --------------------------------------------------- |
| `ouvidoria`       | ALTA       | Denúncia, assédio, fraude, abuso, discriminação |
| `sac`             | BAIXA      | Problemas com produto, entrega ou assinatura        |
| `suporte_tecnico` | MEDIA      | Erro de acesso, bug ou indisponibilidade do sistema |
| `financeiro`      | MEDIA      | Cobrança indevida ou solicitação de reembolso    |
| `fora_do_escopo`  | BAIXA      | Mensagem vaga ou sem contexto claro                 |

---

## Testes

Os testes de integração requerem o PostgreSQL rodando.

> **Importante:** os scripts do backend carregam o `.env` da raiz automaticamente via `dotenv-cli`. Não é necessário criar um `.env` dentro de `backend/`. Use sempre `npm run prisma:migrate` e não `npx prisma migrate dev` diretamente.

### Opção 1 — Via Docker (sem instalar nada localmente)

Com a aplicação já rodando via `docker compose up`, execute os testes dentro do container:

```bash
docker compose exec api npm test

# Com relatório de cobertura
docker compose exec api npm run test:coverage
```

### Opção 2 — Localmente

```bash
# 1. Na raiz, suba o banco
docker compose up -d postgres

# 2. Entre no backend
cd backend

# 3. Instale as dependências (se ainda não fez)
npm install

# 4. Aplique as migrations (carrega .env da raiz automaticamente)
npm run prisma:migrate

# 5. Rode todos os testes
npm test

# Com relatório de cobertura
npm run test:coverage
```

**Resultado esperado:**

```
Test Suites: 4 passed, 4 total
Tests:       55 passed, 55 total
```

| Suite                      | Tipo         | Cobertura                                              |
| -------------------------- | ------------ | ------------------------------------------------------ |
| `classification.test.ts` | Unitário    | Todos os canais, prioridades e variações de mensagem |
| `auth.test.ts`           | Integração | Register, login, token inválido, /me                  |
| `users.test.ts`          | Integração | CRUD completo, validações, duplicidade               |
| `tickets.test.ts`        | Integração | Criação, classificação, listagem, status           |

---

## Documentação Interativa

Com a API rodando, acesse o Swagger em:

```
http://localhost:3000/api-docs
```

---

## Deploy na AWS

Guia para subir o projeto em produção na AWS usando os serviços gerenciados.

### Serviços utilizados

| Serviço AWS     | Função                                           |
| ---------------- | -------------------------------------------------- |
| ECR              | Registro privado das imagens Docker                |
| ECS + Fargate    | Execução dos containers sem gerenciar servidores |
| RDS (PostgreSQL) | Banco de dados gerenciado                          |
| ALB              | Load balancer e roteamento de tráfego             |
| Secrets Manager  | Armazenamento seguro das variáveis de ambiente    |
| VPC              | Rede privada isolada                               |

---

### Passo 1 — Criar o banco de dados no RDS

1. Acesse o console da AWS → **RDS** → **Create database**
2. Selecione **PostgreSQL 16**
3. Em *Templates*, escolha **Free tier** (para testes) ou **Production**
4. Configure:
   - DB instance identifier: `triagem-db`
   - Master username: `triagem_user`
   - Master password: uma senha forte
5. Em *Connectivity*, selecione a VPC desejada e marque **Publicly accessible: No**
6. Anote o **endpoint** gerado (ex: `triagem-db.xxxx.us-east-1.rds.amazonaws.com`)

---

### Passo 2 — Armazenar segredos no Secrets Manager

1. Acesse **Secrets Manager** → **Store a new secret**
2. Escolha *Other type of secret* e adicione as chaves:

```
DATABASE_URL=postgresql://triagem_user:senha@endpoint-rds:5432/triagem_db
JWT_SECRET=seu_jwt_secret
GEMINI_API_KEY=sua_gemini_key
```

3. Nomeie o segredo como `triagem/api/env`

---

### Passo 3 — Publicar a imagem no ECR

```bash
# Autenticar no ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Criar o repositório
aws ecr create-repository --repository-name triagem-api --region us-east-1

# Build e push da imagem
docker build -t triagem-api ./backend
docker tag triagem-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/triagem-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/triagem-api:latest
```

---

### Passo 4 — Criar o cluster ECS

1. Acesse **ECS** → **Clusters** → **Create Cluster**
2. Selecione **AWS Fargate** (serverless)
3. Nomeie como `triagem-cluster`

---

### Passo 5 — Criar a Task Definition

1. Acesse **Task Definitions** → **Create new task definition**
2. Selecione **Fargate**
3. Configure:
   - Task role: uma IAM role com permissão de leitura no Secrets Manager
   - Container name: `triagem-api`
   - Image: URI da imagem no ECR
   - Port mappings: `3000`
4. Em *Environment*, referencie os segredos do Secrets Manager criados no Passo 2

---

### Passo 6 — Criar o serviço ECS

1. No cluster criado, clique em **Create Service**
2. Selecione a Task Definition criada
3. Configure:
   - Launch type: **Fargate**
   - Desired tasks: `1` (ou mais para alta disponibilidade)
   - VPC e subnets privadas
   - Security group: liberar porta `3000` apenas para o ALB
4. Associe ao **Application Load Balancer** para expor a API publicamente

---

### Passo 7 — Aplicar migrations em produção

Antes de iniciar o serviço, rode as migrations manualmente via ECS Run Task ou inclua no entrypoint do container (já configurado no `Dockerfile`):

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/server.js"]
```

O `migrate deploy` aplica apenas migrations já existentes, sem criar novas — seguro para produção.

---

### Arquitetura AWS resultante

<img src="./.github/assets/arquitetura-AWS.png" width="750" alt="Arquitetura AWS">

> Para um ambiente de produção completo, considere adicionar CloudFront para o frontend, Route 53 para DNS e Certificate Manager para HTTPS.

---

## Autor

Feito por **cicero-lucas** — [github.com/cicero-lucas](https://github.com/cicero-lucas)

---

## Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
