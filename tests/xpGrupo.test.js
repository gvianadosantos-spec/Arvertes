import { describe, it, expect } from "vitest";
import { criarTreinador, capturarCriatura, aplicarXpBatalha } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const comUmaCriatura = () => capturarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), { ...criarCriatura(especie, () => 0.5), selvagem: true });
const sorteio = () => 0.5;

describe("aplicarXpBatalha", () => {
  it("o XP vai para a criatura do id informado e ela sobe de nível", () => {
    const t = aplicarXpBatalha(comUmaCriatura(), { "0111": 10 }, sorteio);
    expect(t.grupo.criaturas[0].nivel).toBe(2);
  });

  it("criatura sem recompensa não muda", () => {
    const t = aplicarXpBatalha(comUmaCriatura(), { "0999": 10 }, sorteio);
    expect(t.grupo.criaturas[0].nivel).toBe(1);
  });

  it("XP que não basta para subir fica guardado", () => {
    const t = aplicarXpBatalha(comUmaCriatura(), { "0111": 5 }, sorteio);
    expect(t.grupo.criaturas[0].xp).toBe(5);
  });
});