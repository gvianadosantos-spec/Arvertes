import { describe, it, expect } from "vitest";
import { subirNivel } from "../src/engine/xp.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const sorteioMinimo = () => 0;

describe("subirNivel atualiza os atributos de combate", () => {
  it("cada atributo aumenta 1 por nível ganho quando o sorteio é mínimo", () => {
    const antes = criarCriatura(especie, sorteioMinimo);
    const depois = subirNivel({ ...antes, xp: 10000 }, sorteioMinimo);
    const niveisGanhos = depois.nivel - antes.nivel;
    expect(niveisGanhos).toBeGreaterThan(1);
    expect(depois.vida).toBe(antes.vida + niveisGanhos);
    expect(depois.resistencia).toBe(antes.resistencia + niveisGanhos);
  });

  it("o crescimento de cada atributo está dentro da faixa porNivel (1 a 10)", () => {
    const depois = subirNivel({ ...criarCriatura(especie, sorteioMinimo), xp: 10000 }, sorteioMinimo);
    expect(depois.crescimento.vida).toBeGreaterThanOrEqual(1);
    expect(depois.crescimento.vida).toBeLessThanOrEqual(10);
  });
});