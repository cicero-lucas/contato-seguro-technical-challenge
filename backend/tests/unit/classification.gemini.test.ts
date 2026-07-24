import { ClassificationService } from "../../src/services/ClassificationService";

const hasGeminiKey = !!process.env.GEMINI_API_KEY;

describe("ClassificationService - Google Gemini (real)", () => {
  let service: ClassificationService;

  beforeEach(() => {
    service = new ClassificationService();
  });

  const run = hasGeminiKey ? it : it.skip;

  run("classifica denúncia de assédio como ouvidoria/ALTA", async () => {
    const result = await service.classify("Fui humilhado por um funcionário na frente de todos");
    expect(result.channel).toBe("ouvidoria");
    expect(result.priority).toBe("ALTA");
  }, 15000);

  run("classifica problema de login como suporte_tecnico/MEDIA", async () => {
    const result = await service.classify("Não consigo acessar minha conta, aparece erro");
    expect(result.channel).toBe("suporte_tecnico");
    expect(result.priority).toBe("MEDIA");
  }, 15000);

  run("classifica cobrança indevida como financeiro/MEDIA", async () => {
    const result = await service.classify("Recebi uma cobrança que não reconheço");
    expect(result.channel).toBe("financeiro");
    expect(result.priority).toBe("MEDIA");
  }, 15000);

  run("classifica problema de entrega como sac/BAIXA", async () => {
    const result = await service.classify("Meu pedido chegou errado");
    expect(result.channel).toBe("sac");
    expect(result.priority).toBe("BAIXA");
  }, 15000);

  run("classifica mensagem vaga como fora_do_escopo/BAIXA", async () => {
    const result = await service.classify("Olá, tudo bem?");
    expect(result.channel).toBe("fora_do_escopo");
    expect(result.priority).toBe("BAIXA");
  }, 15000);
});
