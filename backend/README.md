# Triagem API — Backend

> Para instruções de como rodar o projeto, endpoints e exemplos, consulte o [README principal](../README.md).

---

## Arquitetura

Arquitetura em camadas com Repository Pattern e princípios SOLID.

![Arquitetura do Projeto](../.github/assets/arquitetura_projeto.png)


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
│   ├── controllers/
│   ├── docs/
│   ├── interfaces/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validations/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── integration/
│   └── unit/
├── Dockerfile
├── jest.config.ts
├── package.json
└── tsconfig.json
```

---

## Decisões Técnicas

**Fallback de IA** — Se o Gemini falhar ou não estiver configurado, o sistema degrada graciosamente para classificação por palavras-chave, garantindo que todo ticket sempre seja classificado.

**asyncHandler** — Wrapper que captura erros assíncronos e os encaminha ao middleware global, eliminando try/catch repetitivo nos controllers.

**AppError** — Classe de erro customizada com `statusCode`, permitindo diferenciar erros de negócio (4xx) de erros inesperados (5xx) no middleware global.

**excludePassword** — Função utilitária que remove o campo `password` de todas as respostas, garantindo que a senha nunca seja exposta na API.

**NODE_ENV=test** — Desativa o logger HTTP do Pino durante os testes para manter o output limpo.

**Prisma seed** — Dados de exemplo populados automaticamente no startup do container, facilitando avaliação e testes manuais.
