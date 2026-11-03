import { describe, it, expect } from "vitest";
import itens from "../data/itens.json" with { type: "json" };

describe("itens.json: níveis intermediários", () => {
  it("buffs fraco, normal e forte são 1,10, 1,15 e 1,20", () => {
    expect(itens.buff.fraco).toBe(1.1);
    expect(itens.buff.normal).toBe(1.15);
    expect(itens.buff.forte).toBe(1.2);
  });

  it("debuffs fraco, normal e forte são 0,90, 0,85 e 0,80", () => {
    expect(itens.debuff.fraco).toBe(0.9);
    expect(itens.debuff.normal).toBe(0.85);
    expect(itens.debuff.forte).toBe(0.8);
  });

  it("poções fraco, normal e forte recuperam 40%, 60% e 80%", () => {
    expect(itens.pocoes.recuperacaoPercentual.fraco).toBe(40);
    expect(itens.pocoes.recuperacaoPercentual.normal).toBe(60);
    expect(itens.pocoes.recuperacaoPercentual.forte).toBe(80);
  });
});