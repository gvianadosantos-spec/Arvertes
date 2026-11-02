import { describe, it, expect } from "vitest";
import { criarTreinador } from "../src/engine/treinador.js";
import { criarTreinador, registrarCriatura } from "../src/engine/treinador.js";

describe("criarTreinador: nome", () => {
  it("aceita nome com espaço e acento", () => {
    expect(criarTreinador({ nome: "Zé do Gelo", dataNascimento: "0202" }).nome).toBe("Zé do Gelo");
  });

  it("aceita nome de 16 caracteres", () => {
    const nome = "abcdefghijklmnop";
    expect(criarTreinador({ nome, dataNascimento: "0202" }).nome).toBe(nome);
  });

  it("recusa nome de 17 caracteres", () => {
    expect(() => criarTreinador({ nome: "abcdefghijklmnopq", dataNascimento: "0202" })).toThrow();
  });

  it("recusa nome vazio", () => {
    expect(() => criarTreinador({ nome: "", dataNascimento: "0202" })).toThrow();
  });
});

describe("criarTreinador: data de nascimento em DDMM, sem ano, sempre válida", () => {
  it("aceita 0202 e 2409", () => {
    expect(criarTreinador({ nome: "Zé", dataNascimento: "0202" }).dataNascimento).toBe("0202");
    expect(criarTreinador({ nome: "Zé", dataNascimento: "2409" }).dataNascimento).toBe("2409");
  });

  it("aceita 29 de fevereiro", () => {
    expect(criarTreinador({ nome: "Zé", dataNascimento: "2902" }).dataNascimento).toBe("2902");
  });

  it("aceita 30 de abril e 31 de dezembro", () => {
    expect(criarTreinador({ nome: "Zé", dataNascimento: "3004" }).dataNascimento).toBe("3004");
    expect(criarTreinador({ nome: "Zé", dataNascimento: "3112" }).dataNascimento).toBe("3112");
  });

  it("recusa 31 de fevereiro (3102)", () => {
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "3102" })).toThrow();
  });

  it("recusa 31 de abril (3104) e 30 de fevereiro (3002)", () => {
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "3104" })).toThrow();
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "3002" })).toThrow();
  });

  it("recusa mês 13 (0113) e dia 00 (0001)", () => {
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "0113" })).toThrow();
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "0001" })).toThrow();
  });

  it("recusa data com menos de 4 dígitos", () => {
    expect(() => criarTreinador({ nome: "Zé", dataNascimento: "202" })).toThrow();
  });
});

describe("criarTreinador: estado inicial", () => {
  it("começa com registro de ids vazio", () => {
    expect(criarTreinador({ nome: "Zé", dataNascimento: "0202" }).registroIds).toEqual({});
  });
});

describe("treinador: grupo e ids", () => {
  const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", vida: 30, folego: 20, folegoMaximo: 20, resistencia: 200 };
  const outra = { ...especie, nome: "Fogo 2", numero: 2 };

  it("começa sem criaturas no grupo", () => {
    expect(criarTreinador({ nome: "Zé", dataNascimento: "0202" }).grupo.criaturas).toHaveLength(0);
  });

  it("registrar adiciona a criatura ao grupo com o id", () => {
    const t = registrarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), especie);
    expect(t.grupo.criaturas).toHaveLength(1);
    expect(t.grupo.criaturas[0].id).toBe("0111");
  });

  it("segunda criatura da mesma espécie recebe 0112 e o contador sobe", () => {
    const t = registrarCriatura(registrarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), especie), especie);
    expect(t.grupo.criaturas[1].id).toBe("0112");
    expect(t.registroIds).toEqual({ 1: 2 });
  });

  it("espécies diferentes têm contadores separados", () => {
    const t = registrarCriatura(registrarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), especie), outra);
    expect(t.grupo.criaturas[1].id).toBe("0211");
    expect(t.registroIds).toEqual({ 1: 1, 2: 1 });
  });

  it("não altera o treinador original", () => {
    const original = criarTreinador({ nome: "Zé", dataNascimento: "0202" });
    registrarCriatura(original, especie);
    expect(original.grupo.criaturas).toHaveLength(0);
    expect(original.registroIds).toEqual({});
  });

  it("grupo cheio: a sexta criatura é recusada", () => {
    let t = criarTreinador({ nome: "Zé", dataNascimento: "0202" });
    for (let i = 0; i < 5; i++) t = registrarCriatura(t, especie);
    expect(() => registrarCriatura(t, especie)).toThrow();
  });
});