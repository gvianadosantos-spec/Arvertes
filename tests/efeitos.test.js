import { describe, it, expect } from "vitest";
import { aplicarEfeito, fatorAtributo, passarTurno } from "../src/engine/efeitos.js";

const buffAtaque = { id: "buff_ataque_normal_medio", tipo: "buff", atributo: "ataque", multiplicador: 1.15, duracaoTurnos: 5 };
const buffAtaqueOutro = { id: "buff_ataque_forte_grande", tipo: "buff", atributo: "ataque", multiplicador: 1.2, duracaoTurnos: 7 };
const debuffAtaque = { id: "debuff_ataque_fraco_pequeno", tipo: "debuff", atributo: "ataque", multiplicador: 0.9, duracaoTurnos: 3 };
const debuffDefesa = { id: "debuff_defesa_normal_medio", tipo: "debuff", atributo: "defesa", multiplicador: 0.85, duracaoTurnos: 5 };

const criatura = { nome: "Teste", efeitos: [] };

describe("efeitos: aplicação", () => {
  it("buff aplicado fica ativo com a duração do tamanho", () => {
    const c = aplicarEfeito(criatura, buffAtaque);
    expect(c.efeitos).toHaveLength(1);
    expect(c.efeitos[0].turnosRestantes).toBe(5);
  });

  it("não empilha buffs do mesmo atributo: segundo buff é recusado", () => {
    const c = aplicarEfeito(aplicarEfeito(criatura, buffAtaque), buffAtaqueOutro);
    expect(c.efeitos.filter((e) => e.tipo === "buff")).toHaveLength(1);
  });

  it("não empilha debuffs do mesmo atributo: segundo debuff é recusado", () => {
    const c = aplicarEfeito(aplicarEfeito(criatura, debuffAtaque), { ...debuffAtaque, id: "outro" });
    expect(c.efeitos.filter((e) => e.tipo === "debuff")).toHaveLength(1);
  });

  it("buff e debuff do mesmo atributo coexistem", () => {
    const c = aplicarEfeito(aplicarEfeito(criatura, buffAtaque), debuffAtaque);
    expect(c.efeitos).toHaveLength(2);
  });

  it("efeitos de atributos diferentes coexistem", () => {
    const c = aplicarEfeito(aplicarEfeito(criatura, buffAtaque), debuffDefesa);
    expect(c.efeitos).toHaveLength(2);
  });
});

describe("efeitos: fator sobre o atributo", () => {
  it("sem efeito, o fator é 1", () => {
    expect(fatorAtributo(criatura, "ataque")).toBe(1);
  });

  it("buff 1,15 e debuff 0,9 se multiplicam: 1,15 × 0,9 = 1,035", () => {
    const c = aplicarEfeito(aplicarEfeito(criatura, buffAtaque), debuffAtaque);
    expect(fatorAtributo(c, "ataque")).toBeCloseTo(1.035, 5);
  });

  it("efeito de outro atributo não altera o fator", () => {
    const c = aplicarEfeito(criatura, debuffDefesa);
    expect(fatorAtributo(c, "ataque")).toBe(1);
  });
});

describe("efeitos: duração", () => {
  it("passar o turno diminui a duração em 1", () => {
    const c = passarTurno(aplicarEfeito(criatura, buffAtaque));
    expect(c.efeitos[0].turnosRestantes).toBe(4);
  });

  it("efeito some quando a duração chega a zero", () => {
    let c = aplicarEfeito(criatura, debuffAtaque);
    for (let i = 0; i < 3; i++) c = passarTurno(c);
    expect(c.efeitos).toHaveLength(0);
  });
});