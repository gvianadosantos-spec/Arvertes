import { describe, it, expect } from "vitest";
import { createArverte } from "../src/engine/createArverte.js";

const random0 = () => 0;
const randomMax = () => 0.999999;

describe("createArverte lê as faixas do JSON", () => {
  it("sorteio mínimo dá os mínimos fixos da memória", () => {
    const a = createArverte("Teste", random0);
    expect(a.vida).toBe(20);
    expect(a.ataque).toBe(5);
    expect(a.defesa).toBe(1);
    expect(a.ataqueElemento).toBe(1);
    expect(a.defesaElemento).toBe(1);
    expect(a.velocidade).toBe(1);
    expect(a.folego).toBe(20);
    expect(a.resistencia).toBe(200);
  });

  it("sorteio máximo dá os máximos fixos da memória", () => {
    const a = createArverte("Teste", randomMax);
    expect(a.vida).toBe(50);
    expect(a.ataque).toBe(20);
    expect(a.defesa).toBe(20);
    expect(a.ataqueElemento).toBe(20);
    expect(a.defesaElemento).toBe(20);
    expect(a.velocidade).toBe(20);
    expect(a.folego).toBe(30);
    expect(a.resistencia).toBe(300);
  });

  it("modificador por atributo multiplica só o atributo indicado", () => {
    const a = createArverte("Teste", randomMax, false, { ataque: 1.5 });
    expect(a.ataque).toBe(30);
    expect(a.velocidade).toBe(20);
  });
});