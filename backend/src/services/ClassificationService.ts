import { GoogleGenerativeAI } from "@google/generative-ai";
import { Channel, Priority } from "@prisma/client";
import { env } from "../config/env";
import logger from "../config/logger";
import { IClassificationResult, IClassificationService } from "../interfaces/IClassification";

const PROMPT = `Você é um classificador de tickets de atendimento.
Sua função é classificar mensagens em um canal e definir a prioridade.
Responda SOMENTE neste formato JSON:
{"channel":"suporte_tecnico","priority":"MEDIA"}

Valores permitidos para channel:
ouvidoria
sac
suporte_tecnico
financeiro
fora_do_escopo

Valores permitidos para priority:
ALTA
MEDIA
BAIXA

Critérios de canal:
Denúncia, fraude, assédio, abuso, constrangimento, toque sem permissão, comportamento inadequado, intimidação, discriminação ou violência → ouvidoria
Produto, entrega, pedido, devolução, troca ou assinatura → sac
Erro, bug, login, acesso, senha, sistema indisponível ou travado → suporte_tecnico
Cobrança, pagamento, reembolso, fatura, boleto ou estorno → financeiro
Qualquer outro assunto → fora_do_escopo

Critérios de prioridade:
ALTA: ouvidoria (denúncias, assédio, fraude e situações sensíveis)
MEDIA: suporte_tecnico ou financeiro (impactos no uso do serviço ou cobrança)
BAIXA: sac ou fora_do_escopo (casos genéricos ou sem urgência evidente)

Nunca escreva explicações.
Nunca utilize Markdown.
Nunca escreva comentários.
Responder somente JSON válido.`;

const KEYWORD_MAP: { keywords: string[]; channel: Channel }[] = [
  {
    keywords: [
      "denuncia", "fraude", "assedio", "abuso", "constrangimento",
      "sem permissao", "tocaram", "abracaram", "abracou", "encostaram",
      "encostou", "intimidacao", "discriminacao", "violencia",
      "inadequado", "inapropriado", "molestaram", "molestou",
      "agrediram", "agrediu", "ameaca", "ameacaram", "ameacou",
      "humilhacao", "humilharam", "humilhou", "humilhado", "ofensa", "ofenderam",
      "racismo", "preconceito",
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`${PROMPT}\n\nMensagem: ${message}`);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text) as { channel: Channel; priority: Priority };

      const validChannels: Channel[] = [
        "ouvidoria", "sac", "suporte_tecnico", "financeiro", "fora_do_escopo",
      ];
      const validPriorities: Priority[] = ["ALTA", "MEDIA", "BAIXA"];

      if (!validChannels.includes(parsed.channel) || !validPriorities.includes(parsed.priority)) {
        throw new Error(`Resposta inválida do Gemini: ${text}`);
      }

      return { channel: parsed.channel, priority: parsed.priority };
    } catch (error) {
      logger.error({ error }, "Erro ao classificar com Gemini. Usando fallback.");
      return classifyByKeywords(message);
    }
  }
}
