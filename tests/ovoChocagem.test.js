import { describe, it, expect } from "vitest";
import { criarOvo, crescerOvoUmDia, chocarOvo } from "../src/engine/ovo.js";

const aleatorio = (valor) => () => valor;

const sequencia = (valores) => {
  let i = 0;
  return () => valores[i++];
};

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

describe("criarOvo: titã e deificação", () => {
  it("sorteio acima de 1 não é titã nem deificável", () => {
    const ovo = criarOvo(especie, sequencia([0.01, 0.01]));
    expect(ovo.eTita).toBe(false);
    expect(ovo.eDeificavel).toBe(false);
    expect(ovo.multiplicadorAltura).toBe(1);
    expect(ovo.diasOvo).toBe(0);
    expect(ovo.altura).toBe(0);
    expect(ovo.peso).toBe(0);
  });

  it("titã sem deificação sorteia multiplicador entre 1,5 e 2,5", () => {
    const ovo = criarOvo(especie, sequencia([0, 0.01, 0]));
    expect(ovo.eTita).toBe(true);
    expect(ovo.eDeificavel).toBe(false);
    expect(ovo.multiplicadorAltura).toBeCloseTo(1.5, 5);
  });

  it("titã com deificação sorteia multiplicador entre 3 e 5 (mínimo 3)", () => {
    const ovo = criarOvo(especie, sequencia([0, 0, 0]));
    expect(ovo.eTita).toBe(true);
    expect(ovo.eDeificavel).toBe(true);
    expect(ovo.multiplicadorAltura).toBeCloseTo(3, 5);
  });

  it("titã com deificação chega ao máximo 5 com sorteio máximo", () => {
    const ovo = criarOvo(especie, sequencia([0, 0, 0.999999]));
    expect(ovo.multiplicadorAltura).toBeCloseTo(5, 3);
  });

  it("deificação sozinha não é titã e mantém multiplicador 1", () => {
    const ovo = criarOvo(especie, sequencia([0.01, 0]));
    expect(ovo.eTita).toBe(false);
    expect(ovo.eDeificavel).toBe(true);
    expect(ovo.multiplicadorAltura).toBe(1);
  });
});

describe("crescerOvoUmDia: crescimento diário", () => {
  it("normal: sorteio mínimo dá 0,2 cm de altura e 0,1 kg de peso por dia", () => {
    const ovo = criarOvo(especie, sequencia([0.01, 0.01]));
    const depois = crescerOvoUmDia(ovo, aleatorio(0));
    expect(depois.altura).toBeCloseTo(0.2, 5);
    expect(depois.peso).toBeCloseTo(0.1, 5);
    expect(depois.diasOvo).toBe(1);
  });

  it("titã multiplica o crescimento diário: 0,2 × 1,5 = 0,3 cm", () => {
    const ovo = criarOvo(especie, sequencia([0, 0.01, 0]));
    const depois = crescerOvoUmDia(ovo, aleatorio(0));
    expect(depois.altura).toBeCloseTo(0.3, 5);
    expect(depois.peso).toBeCloseTo(0.15, 5);
  });

  it("titã com deificação multiplica o crescimento diário: 0,2 × 3 = 0,6 cm", () => {
    const ovo = criarOvo(especie, sequencia([0, 0, 0]));
    const depois = crescerOvoUmDia(ovo, aleatorio(0));
    expect(depois.altura).toBeCloseTo(0.6, 5);
    expect(depois.peso).toBeCloseTo(0.3, 5);
  });

  it("valor exato é guardado: dois dias com sorteio 0,5 somam 0,6 cm", () => {
    const ovo = criarOvo(especie, sequencia([0.01, 0.01]));
    const dia1 = crescerOvoUmDia(ovo, aleatorio(0.5));
    const dia2 = crescerOvoUmDia(dia1, aleatorio(0.5));
    expect(dia2.altura).toBeCloseTo(0.6, 10);
    expect(dia2.diasOvo).toBe(2);
  });
});

describe("chocarOvo: eclosão", () => {
  it("altura do bebê = altura final do ovo × fatorEclosao (mínimo 1,4)", () => {
    const ovo = { ...criarOvo(especie, sequencia([0.01, 0.01])), altura: 3, peso: 1.5, diasOvo: 10 };
    const bebe = chocarOvo(ovo, aleatorio(0));
    expect(bebe.altura).toBeCloseTo(4.2, 5);
  });

  it("peso do bebê é o peso acumulado do ovo, sem fator de eclosão", () => {
    const ovo = { ...criarOvo(especie, sequencia([0.01, 0.01])), altura: 3, peso: 1.5, diasOvo: 10 };
    const bebe = chocarOvo(ovo, aleatorio(0));
    expect(bebe.peso).toBe(1.5);
  });

  it("eclosão com sorteio máximo usa fatorEclosao 1,6", () => {
    const ovo = { ...criarOvo(especie, sequencia([0.01, 0.01])), altura: 3, peso: 1.5, diasOvo: 10 };
    const bebe = chocarOvo(ovo, aleatorio(0.999999));
    expect(bebe.altura).toBeCloseTo(4.8, 3);
  });

  it("titã não multiplica a altura de novo na eclosão (já veio do ovo)", () => {
    const ovo = { ...criarOvo(especie, sequencia([0, 0.01, 0])), altura: 3, peso: 1.5, diasOvo: 10 };
    const bebe = chocarOvo(ovo, aleatorio(0));
    expect(bebe.altura).toBeCloseTo(4.2, 5);
  });

  it("bebê começa com 0 dias de vida, sem dias de ovo, e mantém titã e deificação", () => {
    const ovo = { ...criarOvo(especie, sequencia([0, 0, 0])), altura: 3, peso: 1.5, diasOvo: 10 };
    const bebe = chocarOvo(ovo, aleatorio(0));
    expect(bebe.diasVida).toBe(0);
    expect(bebe.diasOvo).toBeUndefined();
    expect(bebe.eTita).toBe(true);
    expect(bebe.eDeificavel).toBe(true);
  });
});