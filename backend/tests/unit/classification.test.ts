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

  it("deve classificar como ouvidoria para denúncia", async () => {
    const result = await service.classify("Quero fazer uma denúncia");
    expect(result.channel).toBe("ouvidoria");
  });

  it("deve classificar como ouvidoria para fraude", async () => {
    const result = await service.classify("Detectei uma fraude na minha conta");
    expect(result.channel).toBe("ouvidoria");
  });

  it("deve classificar como sac para entrega", async () => {
    const result = await service.classify("Meu produto não chegou na entrega");
    expect(result.channel).toBe("sac");
  });

  it("deve classificar como suporte_tecnico para bug", async () => {
    const result = await service.classify("Encontrei um bug no sistema");
    expect(result.channel).toBe("suporte_tecnico");
  });

  it("deve classificar como suporte_tecnico para login", async () => {
    const result = await service.classify("Não consigo fazer login");
    expect(result.channel).toBe("suporte_tecnico");
  });

  it("deve classificar como financeiro para cobrança", async () => {
    const result = await service.classify("Recebi uma cobrança indevida");
    expect(result.channel).toBe("financeiro");
  });

  it("deve classificar como financeiro para reembolso", async () => {
    const result = await service.classify("Quero solicitar reembolso");
    expect(result.channel).toBe("financeiro");
  });

  it("deve classificar como fora_do_escopo para mensagem vaga", async () => {
    const result = await service.classify("Olá, tudo bem?");
    expect(result.channel).toBe("fora_do_escopo");
  });
});
