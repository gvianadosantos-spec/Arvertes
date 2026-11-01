import { describe, it, expect } from "vitest";
import especies from "../data/testes/especies.json" with { type: "json" };

describe("data/testes/especies.json tem numero para o id", () => {
  it("são 45 espécies", () => {
    expect(especies).toHaveLength(45);
  });

  it("cada espécie tem numero de 1 a 45, sem repetir", () => {
    const numeros = especies.map((e) => e.numero).sort((a, b) => a - b);
    expect(numeros).toEqual(Array.from({ length: 45 }, (_, i) => i + 1));
  });
});