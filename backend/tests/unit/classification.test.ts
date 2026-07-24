import { ClassificationService } from "../../src/services/ClassificationService";

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockRejectedValue(new Error("Gemini indisponível")),
    }),
  })),
}));

describe("ClassificationService - fallback por palavras-chave", () => {
  let service: ClassificationService;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "fake-key";
    service = new ClassificationService();
  });

  describe("ouvidoria", () => {
    it.each([
      ["denúncia explícita", "Quero fazer uma denúncia"],
      ["fraude", "Detectei uma fraude na minha conta"],
      ["assédio explícito", "Sofri assédio de um funcionário"],
      ["toque sem permissão", "Me abraçaram sem permissão ontem na loja"],
      ["comportamento inapropriado", "Um funcionário teve um comportamento inapropriado comigo"],
      ["abuso", "Sofri um abuso na loja"],
      ["agressão", "Um atendente me agrediu"],
      ["humilhação", "Fui humilhado na frente de todos"],
    ])("%s", async (_, message) => {
      const result = await service.classify(message);
      expect(result.channel).toBe("ouvidoria");
      expect(result.priority).toBe("ALTA");
    });
  });

  describe("sac", () => {
    it.each([
      ["entrega", "Meu produto não chegou na entrega"],
      ["pedido", "Quero cancelar meu pedido"],
      ["devolução", "Preciso fazer uma devolução"],
      ["troca", "Quero trocar o produto"],
      ["assinatura", "Quero cancelar minha assinatura"],
    ])("%s", async (_, message) => {
      const result = await service.classify(message);
      expect(result.channel).toBe("sac");
      expect(result.priority).toBe("BAIXA");
    });
  });

  describe("suporte_tecnico", () => {
    it.each([
      ["bug", "Encontrei um bug no sistema"],
      ["login", "Não consigo fazer login"],
      ["senha", "Esqueci minha senha"],
      ["sistema travado", "A tela travou e não carrega"],
      ["conta bloqueada", "Minha conta está bloqueada"],
      ["falha", "Ocorreu uma falha ao acessar o sistema"],
    ])("%s", async (_, message) => {
      const result = await service.classify(message);
      expect(result.channel).toBe("suporte_tecnico");
      expect(result.priority).toBe("MEDIA");
    });
  });

  describe("financeiro", () => {
    it.each([
      ["cobrança", "Recebi uma cobrança indevida"],
      ["reembolso", "Quero solicitar reembolso"],
      ["boleto", "Não recebi meu boleto"],
      ["estorno", "Preciso de um estorno"],
      ["valor errado", "Me cobraram um valor errado"],
    ])("%s", async (_, message) => {
      const result = await service.classify(message);
      expect(result.channel).toBe("financeiro");
      expect(result.priority).toBe("MEDIA");
    });
  });

  describe("fora_do_escopo", () => {
    it.each([
      ["saudação", "Olá, tudo bem?"],
      ["mensagem vaga", "Preciso de ajuda"],
      ["elogio", "Adorei o atendimento!"],
    ])("%s", async (_, message) => {
      const result = await service.classify(message);
      expect(result.channel).toBe("fora_do_escopo");
      expect(result.priority).toBe("BAIXA");
    });
  });
});
