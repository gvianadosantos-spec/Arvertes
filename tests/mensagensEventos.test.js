import { describe, it, expect } from "vitest";
import { textoEvento } from "../src/engine/mensagens.js";
import mensagens from "../data/mensagens.json" with { type: "json" };

const ctx = { nome: "Reserva", golpe: "" };
const evento = (acao) => ({ quem: "jogador", acao, golpeId: null, acertou: false, dano: 0, relacao: null });

describe("mensagens dos eventos de turno", () => {
  it("item recusado não vira mensagem de golpe", () => {
    expect(textoEvento(evento("item_recusado"), ctx, mensagens)).not.toContain("mas errou");
  });

  it("captura não vira mensagem de golpe", () => {
    expect(textoEvento(evento("captura"), ctx, mensagens)).not.toContain("mas errou");
  });

  it("captura falha não vira mensagem de golpe", () => {
    expect(textoEvento(evento("captura_falhou"), ctx, mensagens)).not.toContain("mas errou");
  });

  it("captura recusada não vira mensagem de golpe", () => {
    expect(textoEvento(evento("captura_recusada"), ctx, mensagens)).not.toContain("mas errou");
  });

  it("troca recusada não vira mensagem de golpe", () => {
    expect(textoEvento(evento("troca_recusada"), ctx, mensagens)).not.toContain("mas errou");
  });
});