import { describe, it, expect } from "vitest";
import { createArverte } from "../src/engine/createArverte.js";

const randomMax = () => 0.999999;
const randomMin = () => 0;

describe("createArverte com fatores de titã", () => {
  it("sem fatores de titã, o valor segue a regra antiga (ataque 20 com sorteio máximo)", () => {
    const a = createArverte("Teste", randomMax, false, {}, undefined, {});
    expect(a.ataque).toBe(20);
  });

  it("fator de titã multiplica o atributo (20 × 2 = 40)", () => {
    const a = createArverte("Teste", randomMax, false, {}, undefined, { ataque: 2 });
    expect(a.ataque).toBe(40);
  });

  it("espécie e titã se multiplicam nessa ordem (20 × 1,5 × 2 = 60)", () => {
    const a = createArverte("Teste", randomMax, false, { ataque: 1.5 }, undefined, { ataque: 2 });
    expect(a.ataque).toBe(60);
  });

  it("arredondamento para baixo no fim (5 × 1,5 × 1,5 = 11,25 → 11)", () => {
    const a = createArverte("Teste", randomMin, false, { ataque: 1.5 }, undefined, { ataque: 1.5 });
    expect(a.ataque).toBe(11);
  });

  it("atributo sem fator de titã mantém o valor da espécie (velocidade 20)", () => {
    const a = createArverte("Teste", randomMax, false, {}, undefined, { ataque: 2 });
    expect(a.velocidade).toBe(20);
  });

  it("titã com deificação aceita fator de 5 (vida 50 × 5 = 250)", () => {
    const a = createArverte("Teste", randomMax, false, {}, undefined, { vida: 5 });
    expect(a.vida).toBe(250);
  });

  it("fatores de titã não mudam a ordem nem a quantidade de sorteios", () => {
    const semTita = createArverte("Teste", randomMin, false, {}, undefined, {});
    const comTita = createArverte("Teste", randomMin, false, {}, undefined, { vida: 2, resistencia: 2 });
    expect(comTita.defesa).toBe(semTita.defesa);
    expect(comTita.velocidade).toBe(semTita.velocidade);
    expect(comTita.vida).toBe(semTita.vida * 2);
  });
});