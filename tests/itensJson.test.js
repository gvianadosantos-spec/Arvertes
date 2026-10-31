import { describe, it, expect } from "vitest";
import itens from "../data/itens.json" with { type: "json" };

describe("itens.json tem as definições dos itens", () => {
  it("lista os 8 atributos", () => {
    expect(itens.atributos).toHaveLength(8);
  });

  it("tamanhos: pequeno 3 turnos, médio 5, grande 7", () => {
    expect(itens.tamanhos.pequeno.duracaoTurnos).toBe(3);
    expect(itens.tamanhos.medio.duracaoTurnos).toBe(5);
    expect(itens.tamanhos.grande.duracaoTurnos).toBe(7);
  });

  it("buffs: 1,05 a 1,25", () => {
    expect(itens.buff.muitoFraco).toBe(1.05);
    expect(itens.buff.muitoForte).toBe(1.25);
  });

  it("debuffs: 0,95 a 0,75", () => {
    expect(itens.debuff.muitoFraco).toBe(0.95);
    expect(itens.debuff.muitoForte).toBe(0.75);
  });

  it("poções recuperam de 20% a 100% do máximo", () => {
    expect(itens.pocoes.recuperacaoPercentual.muitoFraco).toBe(20);
    expect(itens.pocoes.recuperacaoPercentual.muitoForte).toBe(100);
  });

  it("o inimigo começa com 3 unidades de cada tipo", () => {
    expect(itens.quantidadePorTipoNoInimigo).toBe(3);
  });
});

