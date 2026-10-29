import { describe, it, expect } from "vitest";
import { chanceFuga } from "../src/engine/fuga.js";

describe("chance de fuga pela velocidade", () => {
  it("velocidades iguais dão 50%", () => {
    expect(chanceFuga(10, 10)).toBe(50);
  });

  it("jogador duas vezes mais rápido dá cerca de 67%", () => {
    expect(chanceFuga(20, 10)).toBeCloseTo(66.67, 2);
  });

  it("jogador duas vezes mais lento dá cerca de 33%", () => {
    expect(chanceFuga(10, 20)).toBeCloseTo(33.33, 2);
  });

  it("chance nunca passa do teto de 90%", () => {
    expect(chanceFuga(100, 1)).toBe(90);
  });

  it("chance nunca fica abaixo do piso de 10%", () => {
    expect(chanceFuga(1, 100)).toBe(10);
  });
});