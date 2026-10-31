import { describe, it, expect } from "vitest";
import { textoEvento } from "../src/engine/mensagens.js";
import mensagens from "../data/mensagens.json" with { type: "json" };

const modelo = {
  golpe: {
    acertou: "{nome} usou {golpe} e causou {dano} de dano.",
    erro: "{nome} usou {golpe}, mas errou.",
  },
  basico: { acertou: "{nome} atacou e causou {dano} de dano." },
  fuga: "{nome} fugiu da batalha.",
  fuga_falhou: "{nome} tentou fugir, mas não conseguiu.",
  relacao: {
    superior: " Foi super efetivo.",
    neutro: "",
    inferior: " Não foi muito efetivo.",
  },
};

const ctx = { nome: "Gelo 2", golpe: "Lança Gélida" };

describe("textoEvento monta a frase a partir do modelo", () => {
  it("golpe que acerta com relação superior inclui o texto de superior", () => {
    const evento = { quem: "jogador", acao: "golpe", golpeId: "g", acertou: true, dano: 5, relacao: "superior" };
    expect(textoEvento(evento, ctx, modelo)).toBe("Gelo 2 usou Lança Gélida e causou 5 de dano. Foi super efetivo.");
  });

  it("golpe que acerta com relação inferior inclui o texto de inferior", () => {
    const evento = { quem: "jogador", acao: "golpe", golpeId: "g", acertou: true, dano: 5, relacao: "inferior" };
    expect(textoEvento(evento, ctx, modelo)).toBe("Gelo 2 usou Lança Gélida e causou 5 de dano. Não foi muito efetivo.");
  });

  it("golpe com relação neutra não ganha complemento", () => {
    const evento = { quem: "jogador", acao: "golpe", golpeId: "g", acertou: true, dano: 5, relacao: "neutro" };
    expect(textoEvento(evento, ctx, modelo)).toBe("Gelo 2 usou Lança Gélida e causou 5 de dano.");
  });

  it("golpe que erra usa a frase de erro, sem relação", () => {
    const evento = { quem: "jogador", acao: "golpe", golpeId: "g", acertou: false, dano: 0, relacao: null };
    expect(textoEvento(evento, ctx, modelo)).toBe("Gelo 2 usou Lança Gélida, mas errou.");
  });

  it("ação básica usa a frase do básico", () => {
    const evento = { quem: "jogador", acao: "basico", golpeId: null, acertou: true, dano: 5, relacao: null };
    expect(textoEvento(evento, ctx, modelo)).toBe("Gelo 2 atacou e causou 5 de dano.");
  });

  it("fuga e fuga falha têm frases próprias", () => {
    const fuga = { quem: "jogador", acao: "fuga", golpeId: null, acertou: false, dano: 0, relacao: null };
    const falha = { quem: "jogador", acao: "fuga_falhou", golpeId: null, acertou: false, dano: 0, relacao: null };
    expect(textoEvento(fuga, ctx, modelo)).toBe("Gelo 2 fugiu da batalha.");
    expect(textoEvento(falha, ctx, modelo)).toBe("Gelo 2 tentou fugir, mas não conseguiu.");
  });
});

describe("data/mensagens.json tem todos os modelos usados pelo motor", () => {
  it("tem os modelos de golpe, básico, fuga e relação", () => {
    expect(typeof mensagens.golpe.acertou).toBe("string");
    expect(typeof mensagens.golpe.erro).toBe("string");
    expect(typeof mensagens.basico.acertou).toBe("string");
    expect(typeof mensagens.fuga).toBe("string");
    expect(typeof mensagens.fuga_falhou).toBe("string");
    expect(typeof mensagens.relacao.superior).toBe("string");
    expect(typeof mensagens.relacao.neutro).toBe("string");
    expect(typeof mensagens.relacao.inferior).toBe("string");
  });
});