import { GoogleGenerativeAI } from "@google/generative-ai";
import { Channel, Priority } from "@prisma/client";
import { env } from "../config/env";
import logger from "../config/logger";
import { IClassificationResult, IClassificationService } from "../interfaces/IClassification";

const PROMPT = `Você é um sistema especializado em triagem de tickets de atendimento ao cliente.

Sua única responsabilidade é analisar a mensagem do usuário e retornar a classificação correta.

REGRA ABSOLUTA:
Responda SOMENTE com JSON válido, sem qualquer texto adicional.

Formato obrigatório:
{"channel":"nome_do_canal"}

CANAIS DISPONÍVEIS:
- ouvidoria
- sac
- suporte_tecnico
- financeiro
- fora_do_escopo

CRITÉRIOS DE CLASSIFICAÇÃO:

ouvidoria
Utilize quando a mensagem relatar denúncias ou situações envolvendo conduta inadequada de pessoas.
Exemplos: denúncia, assédio (incluindo moral, sexual, discriminação, racismo, intimidação, humilhação e constrangimento), fraude, abuso, violência ou comportamento inadequado.
Atenção: considere também mensagens que descrevem situações de ofensa, injúria ou tratamento degradante, mesmo que não utilizem palavras exatas como "assédio" ou "discriminação".

sac
Utilize quando a mensagem tratar de problemas relacionados a produtos ou serviços.
Exemplos: produto com defeito, entrega atrasada, pedido errado, troca, devolução, cancelamento, assinatura ou problemas com pedidos.

suporte_tecnico
Utilize quando a mensagem relatar problemas de acesso ou falhas técnicas.
Exemplos: erro de login, senha, bug, conta bloqueada, sistema indisponível, tela travada, falha técnica ou página que não carrega.

financeiro
Utilize quando a mensagem tratar de cobranças ou pagamentos.
Exemplos: cobrança indevida, reembolso, estorno, boleto, fatura, pagamento, débito ou valor incorreto.

fora_do_escopo
Utilize quando a mensagem não se enquadrar em nenhuma categoria anterior.
Exemplos: saudações, elogios, dúvidas genéricas ou mensagens sem contexto.

EXEMPLOS DE CLASSIFICAÇÃO:
Mensagem: "Sofri preconceito racial na loja" → {"channel":"ouvidoria"}
Mensagem: "Um funcionário me xingou" → {"channel":"ouvidoria"}
Mensagem: "Não consigo fazer login" → {"channel":"suporte_tecnico"}
Mensagem: "Recebi uma cobrança indevida" → {"channel":"financeiro"}
Mensagem: "Meu pedido não chegou" → {"channel":"sac"}
Mensagem: "Olá, tudo bem?" → {"channel":"fora_do_escopo"}

REGRAS:
- Analise o contexto completo da mensagem, não apenas palavras isoladas. Os exemplos são ilustrativos: uma mensagem pode descrever uma situação equivalente utilizando palavras diferentes e ainda pertencer ao mesmo canal.
- Se houver mais de um assunto, escolha o canal predominante.
- Em caso de dúvida, classifique como fora_do_escopo.
- Nunca retorne explicações, comentários ou Markdown.`;

const KEYWORD_MAP: { keywords: string[]; channel: Channel }[] = [
  {
    keywords: [
      "denuncia", "fraude", "assedio", "abuso", "constrangimento",
      "sem permissao", "tocaram", "abracaram", "abracou", "encostaram",
      "encostou", "intimidacao", "discriminacao", "violencia",
      "inadequado", "inapropriado", "molestaram", "molestou",
      "agrediram", "agrediu", "ameaca", "ameacaram", "ameacou",
      "humilhacao", "humilharam", "humilhou", "humilhado", "ofensa", "ofenderam",
      "racismo", "preconceito", "xingou", "xingaram", "chamaram de",
    ],
    channel: "ouvidoria",
  },
  {
    keywords: [
      "produto", "entrega", "assinatura", "pedido", "compra",
      "devolucao", "troca", "cancelamento", "nao chegou", "extravio",
    ],
    channel: "sac",
  },
  {
    keywords: [
      "erro", "bug", "login", "acesso", "indisponibilidade",
      "nao consigo entrar", "sistema fora", "tela travada", "travou",
      "nao carrega", "senha", "bloqueada", "bloqueado", "falha", "crash",
    ],
    channel: "suporte_tecnico",
  },
  {
    keywords: [
      "cobranca", "pagamento", "reembolso", "fatura", "boleto",
      "debito", "credito", "estorno", "taxa", "juros", "cobraram",
      "cobraram indevido", "valor errado",
    ],
    channel: "financeiro",
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const PRIORITY_MAP: Record<Channel, Priority> = {
  ouvidoria: "ALTA",
  suporte_tecnico: "MEDIA",
  financeiro: "MEDIA",
  sac: "BAIXA",
  fora_do_escopo: "BAIXA",
};

function classifyByKeywords(message: string): IClassificationResult {
  const normalized = normalize(message);
  for (const { keywords, channel } of KEYWORD_MAP) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return { channel, priority: PRIORITY_MAP[channel] };
    }
  }
  return { channel: "fora_do_escopo", priority: "BAIXA" };
}

export class ClassificationService implements IClassificationService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || env.geminiApiKey;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async classify(message: string): Promise<IClassificationResult> {
    if (!this.genAI) {
      logger.warn("Gemini API key não configurada. Usando fallback por palavras-chave.");
      return classifyByKeywords(message);
    }

    try {
      const model = this.genAI.getGenerativeModel(
        { model: process.env.GEMINI_MODEL || env.geminiModel },
        { apiVersion: "v1beta" }
      );
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${PROMPT}\n\nMensagem: ${message}` }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      });
      const text = result.response.text().trim();
      const parsed = JSON.parse(text) as { channel: Channel };

      const validChannels: Channel[] = [
        "ouvidoria", "sac", "suporte_tecnico", "financeiro", "fora_do_escopo",
      ];

      if (!validChannels.includes(parsed.channel)) {
        throw new Error(`Canal inválido retornado pelo Gemini: ${text}`);
      }

      return { channel: parsed.channel, priority: PRIORITY_MAP[parsed.channel] };
    } catch (error) {
      logger.error({ error }, "Erro ao classificar com Gemini. Usando fallback.");
      return classifyByKeywords(message);
    }
  }
}
