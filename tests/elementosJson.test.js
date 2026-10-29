import { describe, it, expect } from "vitest";
import { relacaoElemento } from "../src/engine/elementos.js";
import tabela from "../data/elementos.json" with { type: "json" };

const mutuos = [
  ["Terra", "Ar"],
  ["Ar", "Terra"],
  ["Luz", "Sombra"],
  ["Sombra", "Luz"],
];

describe("relacaoElemento lê a tabela do JSON", () => {
  it("a tabela tem as 9 entradas de elementos", () => {
    expect(tabela.elementos).toHaveLength(9);
  });

  it("cada par de vantagem simples é superior de um lado e inferior do outro", () => {
    for (const [superior, inferior] of tabela.vantagens) {
      if (mutuos.some(([a, b]) => a === superior && b === inferior)) continue;
      expect(relacaoElemento(superior, inferior)).toBe("superior");
      expect(relacaoElemento(inferior, superior)).toBe("inferior");
    }
  });

  it("pares com vantagem mútua são superiores nos dois sentidos", () => {
    for (const [a, b] of mutuos) {
      expect(relacaoElemento(a, b)).toBe("superior");
    }
  });
});