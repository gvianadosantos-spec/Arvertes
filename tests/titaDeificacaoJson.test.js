import { describe, it, expect } from "vitest";
import atributos from "../data/atributos.json" with { type: "json" };

describe("titã e deificação estão no atributos.json", () => {
  it("titã: chance de 1% e multiplicador entre 1,5 e 2,5", () => {
    expect(atributos.titaDeificacao.chanceTita).toBe(1);
    expect(atributos.titaDeificacao.multiplicadorTita.min).toBe(1.5);
    expect(atributos.titaDeificacao.multiplicadorTita.max).toBe(2.5);
  });

  it("deificação: chance de 1%", () => {
    expect(atributos.titaDeificacao.chanceDeificavel).toBe(1);
  });

  it("estágio deus: nível 900 e 700 dias, só por deificação", () => {
    const deus = atributos.estagios.find((e) => e.id === "deus");
    expect(deus).toBeDefined();
    expect(deus.nivelMinimo).toBe(900);
    expect(deus.diasMinimos).toBe(700);
    expect(deus.viaDeificacao).toBe(true);
  });
});