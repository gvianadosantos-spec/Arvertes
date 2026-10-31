import { describe, it, expect } from "vitest";
import { criarOvo, chocarOvo } from "../src/engine/ovo.js";
import { createArverte } from "../src/engine/createArverte.js";

const especie = {
  id: "teste_fogo_1",
  elemento: "Fogo",
  afinidade: 1,
  modificadorAtributos: {},
  fisico: {
    crescimentoOvoPorDia: { min: 0.2, max: 0.4 },
    fatorEclosao: { min: 1.4, max: 1.6 },
    fatorPeso: 0.5,
    crescimentoAltura: {
      crianca: { min: 5, max: 10 },
      adolescente: { min: 10, max: 15 },
      adulto: { min: 5, max: 10 },
      anciao: { min: 0, max: 3 },
      semideus: { min: 0, max: 2 },
    },
  },
  diasParaChocar: 10,
};

const sequencia = (valores) => {
  let i = 0;
  return () => valores[i++];
};

const randomMax = () => 0.999999;
const aleatorio0 = () => 0;

describe("ovo chocado entrega os fatores de titã para o createArverte", () => {
  it("ovo normal: a criatura sai com os valores da espécie", () => {
    const bebe = chocarOvo(criarOvo(especie, sequencia([0.01, 0.01])), aleatorio0);
    const criatura = createArverte("Teste", randomMax, false, {}, undefined, bebe.fatoresTita);
    expect(criatura.ataque).toBe(20);
    expect(criatura.vida).toBe(50);
  });

  it("titã: fator de ataque 2 chega à criatura (20 × 2 = 40)", () => {
    const r = sequencia([0, 0.01, 0, 0, 0.5, 0, 0, 0, 0, 0, 0]);
    const bebe = chocarOvo(criarOvo(especie, r), aleatorio0);
    const criatura = createArverte("Teste", randomMax, false, {}, undefined, bebe.fatoresTita);
    expect(criatura.ataque).toBe(40);
  });

  it("titã com deificação: fator 3 em tudo chega à criatura (vida 50 × 3 = 150)", () => {
    const r = sequencia([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const bebe = chocarOvo(criarOvo(especie, r), aleatorio0);
    const criatura = createArverte("Teste", randomMax, false, {}, undefined, bebe.fatoresTita);
    expect(criatura.vida).toBe(150);
  });
});