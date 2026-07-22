import { GoogleGenerativeAI } from "@google/generative-ai";
import { Channel } from "@prisma/client";
import { env } from "../config/env";
import logger from "../config/logger";
import { IClassificationResult, IClassificationService } from "../interfaces/IClassification";

const PROMPT = `Você é um classificador de tickets.
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
Responder somente JSON válido.`;

const KEYWORD_MAP: { keywords: string[]; channel: Channel }[] = [
  { keywords: ["denúncia", "denuncia", "fraude", "assédio", "assedio"], channel: "ouvidoria" },
  { keywords: ["produto", "entrega", "assinatura"], channel: "sac" },
  { keywords: ["erro", "bug", "login", "acesso", "indisponibilidade"], channel: "suporte_tecnico" },
  { keywords: ["cobrança", "cobranca", "pagamento", "reembolso"], channel: "financeiro" },
];

function classifyByKeywords(message: string): Channel {
  const lower = message.toLowerCase();
  for (const { keywords, channel } of KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return channel;
  }
  return "fora_do_escopo";
}

export class ClassificationService implements IClassificationService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (env.geminiApiKey) {
      this.genAI = new GoogleGenerativeAI(env.geminiApiKey);
    }
  }

  async classify(message: string): Promise<IClassificationResult> {
    if (!this.genAI) {
      logger.warn("Gemini API key não configurada. Usando fallback por palavras-chave.");
      return { channel: classifyByKeywords(message) };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`${PROMPT}\n\nMensagem: ${message}`);
      const text = result.response.text().trim();
      const parsed = JSON.parse(text) as { channel: Channel };

      const validChannels: Channel[] = [
        "ouvidoria",
        "sac",
        "suporte_tecnico",
        "financeiro",
        "fora_do_escopo",
      ];

      if (!validChannels.includes(parsed.channel)) {
        throw new Error(`Canal inválido retornado: ${parsed.channel}`);
      }

      return { channel: parsed.channel };
    } catch (error) {
      logger.error({ error }, "Erro ao classificar com Gemini. Usando fallback.");
      return { channel: classifyByKeywords(message) };
    }
  }
}
