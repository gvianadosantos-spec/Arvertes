import { describe, it, expect } from "vitest";
import { criarComId } from "../src/engine/ids.js";

const base = { nome: "Teste", elemento: "Fogo", numero: 1, vida: 30 };

describe("criarComId: id dentro da criatura, com contador do treinador", () => {
  it("a criatura recebe o campo id com o id gerado", () => {
    const r = criarComId(base, {});
    expect(r.criatura.id).toBe("0111");
  });

  it("devolve o registro atualizado do treinador", () => {
    const r = criarComId(base, {});
    expect(r.registro).toEqual({ 1: 1 });
  });

  it("segunda criatura da mesma espécie recebe o próximo número", () => {
    const primeira = criarComId(base, {});
    const segunda = criarComId(base, primeira.registro);
    expect(segunda.criatura.id).toBe("0112");
  });

  it("mantém os outros campos da criatura", () => {
    const r = criarComId(base, {});
    expect(r.criatura.vida).toBe(30);
    expect(r.criatura.nome).toBe("Teste");
  });

  it("não altera a criatura original nem o registro original", () => {
    const registro = {};
    criarComId(base, registro);
    expect(base.id).toBeUndefined();
    expect(registro).toEqual({});
  });
});