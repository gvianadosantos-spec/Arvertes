import { describe, it, expect } from "vitest";
import { criarCriatura } from "../src/engine/createArverte.js";
import { estagioAtual } from "../src/engine/estagios.js";

const especie = { id: "teste_fogo_1", nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const maximo = () => 0.999999;

describe("criarCriatura e estágio", () => {
  it("criatura recém-criada tem 0 dias de vida", () => {
    expect(criarCriatura(especie, maximo).diasVida).toBe(0);
  });

  it("criatura recém-criada é reconhecida como bebê", () => {
    expect(estagioAtual(criarCriatura(especie, maximo))).toBe("bebe");
  });
});