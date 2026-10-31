import { describe, it, expect } from "vitest";
import { chanceCaptura, tentarCaptura } from "../src/engine/captura.js";

const criatura = (vidaAtual, vidaMaxima = 100) => ({ vida: vidaAtual, vidaMaxima });

describe("captura: chance", () => {
  it("vida cheia: chance é só a base da espécie", () => {
    expect(chanceCaptura(20, criatura(100))).toBe(20);
  });

  it("cada 1% de vida perdida soma 1 ponto de chance (vida em 50% soma 50)", () => {
    expect(chanceCaptura(20, criatura(50))).toBe(70);
  });

  it("chance não passa do teto de 90%", () => {
    expect(chanceCaptura(80, criatura(10))).toBe(90);
  });

  it("chance não fica abaixo do piso de 0,1%", () => {
    expect(chanceCaptura(0, criatura(100))).toBe(0.1);
  });
});

describe("captura: tentativa", () => {
  it("sorteio dentro da chance captura", () => {
    expect(tentarCaptura(20, criatura(100), () => 0.1, false)).toBe(true);
  });

  it("sorteio acima da chance falha", () => {
    expect(tentarCaptura(20, criatura(100), () => 0.9, false)).toBe(false);
  });

  it("grupo cheio: a captura falha mesmo com sorteio favorável", () => {
    expect(tentarCaptura(20, criatura(100), () => 0.0, true)).toBe(false);
  });
});