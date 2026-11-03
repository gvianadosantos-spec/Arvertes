import { describe, it, expect } from "vitest";
import { criarTreinador, capturarCriatura } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const selvagem = () => ({ ...criarCriatura(especie, () => 0.5), selvagem: true });
const novoTreinador = () => criarTreinador({ nome: "Zé", dataNascimento: "0202" });

describe("captura entra no grupo", () => {
  it("criatura capturada entra no grupo com id", () => {
    const t = capturarCriatura(novoTreinador(), selvagem());
    expect(t.grupo.criaturas).toHaveLength(1);
    expect(t.grupo.criaturas[0].id).toBe("0111");
  });

  it("criatura capturada deixa de ser selvagem", () => {
    const t = capturarCriatura(novoTreinador(), selvagem());
    expect(t.grupo.criaturas[0].selvagem).toBe(false);
  });

  it("contador de ids sobe com a captura", () => {
    const t = capturarCriatura(capturarCriatura(novoTreinador(), selvagem()), selvagem());
    expect(t.grupo.criaturas[1].id).toBe("0112");
    expect(t.registroIds).toEqual({ 1: 2 });
  });

  it("grupo cheio recusa a captura", () => {
    let t = novoTreinador();
    for (let i = 0; i < 5; i++) t = capturarCriatura(t, selvagem());
    expect(() => capturarCriatura(t, selvagem())).toThrow();
  });

  it("não altera o treinador original", () => {
    const original = novoTreinador();
    capturarCriatura(original, selvagem());
    expect(original.grupo.criaturas).toHaveLength(0);
  });
});