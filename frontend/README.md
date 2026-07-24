# Triagem — Frontend

Interface web para visualização e gerenciamento de tickets de atendimento, consumindo a Triagem API.

![Demonstração da aplicação](../.github/assets/demo.gif)

---

## Sumário

- [Tecnologias](#tecnologias)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando com Docker](#executando-com-docker)
- [Executando Localmente](#executando-localmente)

---

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | React 18 |
| Build | Vite |
| Estilização | Tailwind CSS |
| HTTP Client | Axios |
| Estado global | Zustand |
| Servidor web | Nginx (produção) |
| Containerização | Docker |

---

## Variáveis de Ambiente

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000/api
```

> Em produção via Docker, o `VITE_API_URL` é injetado como build argument pelo `docker-compose.yml` da raiz.

---

## Executando com Docker

> O `docker-compose.yml` fica na raiz do projeto. Execute a partir da raiz.

```bash
# Sobe frontend + API + banco
docker compose up --build
```

O frontend estará disponível em `http://localhost:80`.

O Nginx serve os arquivos estáticos e faz proxy das requisições `/api` para a API em `http://api:3000`.

---

## Executando Localmente

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure o .env
cp .env.example .env

# Inicie em modo desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

> Certifique-se de que a API está rodando em `http://localhost:3000` antes de iniciar o frontend.

**Scripts disponíveis:**

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento com HMR |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run preview` | Visualiza o build de produção localmente |
