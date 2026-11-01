import { describe, it, expect } from "vitest";
import { recompensaBatalha } from "../src/engine/xp.js";

describe("recompensa da batalha", () => {
  it("vitória do jogador: nível 20 dá 200 de XP, ativa 150 e B 50", () => {
    const r = recompensaBatalha("jogador", 20, "A", ["A", "B"]);
    expect(r.A).toBe(150);
    expect(r.B).toBe(50);
  });

  it("captura: nível 20 dá 140 de XP, ativa 105 e B 35", () => {
    const r = recompensaBatalha("captura", 20, "A", ["A", "B"]);
    expect(r.A).toBe(105);
    expect(r.B).toBe(35);
  });

  it("derrota não dá XP", () => {
    expect(recompensaBatalha("robo", 20, "A", ["A", "B"])).toEqual({});
  });

  it("fuga não dá XP", () => {
    expect(recompensaBatalha("fuga", 20, "A", ["A", "B"])).toEqual({});
  });
});