import { describe, it, expect } from "vitest";
import regras from "../data/regras.json" with { type: "json" };

describe("regras.json tem os valores de regra do motor", () => {
  it("dano: superior 1,5, inferior 0,5 e piso 1", () => {
    expect(regras.dano.multiplicadorSuperior).toBe(1.5);
    expect(regras.dano.multiplicadorInferior).toBe(0.5);
    expect(regras.dano.pisoElementalPuro).toBe(1);
  });

  it("fôlego: devolve 1 na vitória", () => {
    expect(regras.folego.recuperacaoVitoria).toBe(1);
  });

  it("resistência: desgasta 1 por rodada", () => {
    expect(regras.resistencia.desgastePorRodada).toBe(1);
  });

  it("acerto: sorteio entre 1 e 100", () => {
    expect(regras.acerto.sorteioMinimo).toBe(1);
    expect(regras.acerto.sorteioMaximo).toBe(100);
  });
});
