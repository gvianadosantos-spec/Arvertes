import { describe, it, expect } from "vitest";
import { xpGanho, xpParaProximoNivel, subirNivel } from "../src/engine/xp.js";

describe("xp: ganho por ação", () => {
  it("vitória dá nível do inimigo × 10", () => {
    expect(xpGanho("vitoria", 20)).toBe(200);
  });

  it("captura dá nível do inimigo × 7", () => {
    expect(xpGanho("captura", 20)).toBe(140);
  });

  it("fuga não dá XP", () => {
    expect(xpGanho("fuga", 20)).toBe(0);
  });
});

describe("xp: curva", () => {
  it("nível 20 com vínculo 1 precisa de 4000 XP (20² × 10)", () => {
    expect(xpParaProximoNivel(20, 1)).toBe(4000);
  });

  it("nível 20 com vínculo 2 precisa de 6000 XP (× 1,5)", () => {
    expect(xpParaProximoNivel(20, 2)).toBe(6000);
  });
});

describe("xp: subir de nível", () => {
  it("XP suficiente sobe 1 nível", () => {
    const depois = subirNivel({ nivel: 1, xp: 10, vinculo: 1 }, () => 0);
    expect(depois.nivel).toBe(2);
    expect(depois.xp).toBe(0);
  });

  it("XP que sobra passa para o próximo nível", () => {
    const depois = subirNivel({ nivel: 1, xp: 15, vinculo: 1 }, () => 0);
    expect(depois.nivel).toBe(2);
    expect(depois.xp).toBe(5);
  });

  it("sem XP suficiente, não sobe", () => {
    const depois = subirNivel({ nivel: 1, xp: 1, vinculo: 1 }, () => 0);
    expect(depois.nivel).toBe(1);
  });

  it("subir de nível sorteia o crescimento de cada atributo (mínimo 1 com sorteio 0)", () => {
    const depois = subirNivel({ nivel: 1, xp: 10, vinculo: 1 }, () => 0);
    expect(depois.crescimento.vida).toBe(1);
    expect(depois.crescimento.resistencia).toBe(1);
  });
});