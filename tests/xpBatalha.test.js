import { describe, it, expect } from "vitest";
import { distribuirXp } from "../src/engine/xp.js";

describe("distribuição de XP da batalha", () => {
  it("ativa leva 50% e divide os outros 50% com quem participou, incluindo a ativa", () => {
    const r = distribuirXp(200, "A", ["A", "B"]);
    expect(r.A).toBe(150);
    expect(r.B).toBe(50);
  });

  it("ativa sozinha recebe o XP inteiro", () => {
    expect(distribuirXp(200, "A", ["A"]).A).toBe(200);
  });

  it("três participantes: ativa 100 + 33, os outros 33 cada", () => {
    const r = distribuirXp(200, "A", ["A", "B", "C"]);
    expect(r.A).toBe(133);
    expect(r.B).toBe(33);
    expect(r.C).toBe(33);
  });

  it("arredonda para baixo: XP 10 com dois participantes dá 7 e 2", () => {
    const r = distribuirXp(10, "A", ["A", "B"]);
    expect(r.A).toBe(7);
    expect(r.B).toBe(2);
  });

  it("quem não participou não recebe XP", () => {
    const r = distribuirXp(200, "A", ["A", "B"]);
    expect(r.C).toBeUndefined();
  });
});

  it("cada participante recebe pelo menos 1 de XP", () => {
    const r = distribuirXp(1, "A", ["A", "B"]);
    expect(r.A).toBe(1);
    expect(r.B).toBe(1);
  });

  it("fuga (XP 0) não distribui nada", () => {
    const r = distribuirXp(0, "A", ["A", "B"]);
    expect(r.A).toBeUndefined();
    expect(r.B).toBeUndefined();
  });