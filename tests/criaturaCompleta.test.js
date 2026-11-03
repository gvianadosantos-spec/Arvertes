import { describe, it, expect } from "vitest";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { id: "teste_fogo_1", nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 0.5, modificadorAtributos: {} };
const maximo = () => 0.999999;

describe("criarCriatura: identidade e progressão", () => {
  it("copia nome, elemento, afinidade e número da espécie", () => {
    expect(criarCriatura(especie, maximo)).toMatchObject({ nome: "Fogo 1", elemento: "Fogo", afinidade: 0.5, numero: 1 });
  });

  it("começa no nível 1, com 0 de XP, vínculo 1, sem efeitos e não selvagem", () => {
    expect(criarCriatura(especie, maximo)).toMatchObject({ nivel: 1, xp: 0, vinculo: 1, efeitos: [], selvagem: false });
  });

  it("marca ehJogador quando informado", () => {
    expect(criarCriatura(especie, maximo, true).ehJogador).toBe(true);
  });
});

describe("criarCriatura: máximos começam iguais aos valores sorteados", () => {
  it("vidaMaxima, folegoMaximo e resistenciaMaxima iguais aos atuais", () => {
    const c = criarCriatura(especie, maximo);
    expect(c.vidaMaxima).toBe(c.vida);
    expect(c.folegoMaximo).toBe(c.folego);
    expect(c.resistenciaMaxima).toBe(c.resistencia);
  });
});