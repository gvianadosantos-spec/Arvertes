import { describe, it, expect } from "vitest";
import { numeroElemento, atribuirId } from "../src/engine/ids.js";

describe("numeroElemento: ordem de data/elementos.json", () => {
  it("Fogo é 1 e Físico é 9", () => {
    expect(numeroElemento("Fogo")).toBe(1);
    expect(numeroElemento("Fisico")).toBe(9);
  });

  it("Agua é 2", () => {
    expect(numeroElemento("Agua")).toBe(2);
  });
});

describe("atribuirId: espécie (2 dígitos) + elemento (1 dígito) + contador", () => {
  it("primeiro Arverte da espécie 1 de Fogo recebe 0111", () => {
    expect(atribuirId({}, 1, "Fogo").id).toBe("0111");
  });

  it("cada novo Arverte da mesma espécie sobe o contador", () => {
    const primeiro = atribuirId({}, 1, "Fogo");
    const segundo = atribuirId(primeiro.registro, 1, "Fogo");
    expect(segundo.id).toBe("0112");
  });

  it("espécie 11 não colide com espécie 1: espécie 11, Fogo, primeiro é 1111", () => {
    expect(atribuirId({}, 11, "Fogo").id).toBe("1111");
  });

  it("espécie 1 no contador 3 (0113) é diferente de espécie 11 no contador 3 (1113)", () => {
    let registro = {};
    for (let i = 0; i < 3; i++) registro = atribuirId(registro, 1, "Fogo").registro;
    const espécie1 = atribuirId(registro, 1, "Fogo").id;

    let registro11 = {};
    for (let i = 0; i < 3; i++) registro11 = atribuirId(registro11, 11, "Fogo").registro;
    const espécie11 = atribuirId(registro11, 11, "Fogo").id;

    expect(espécie1).toBe("0114");
    expect(espécie11).toBe("1114");
    expect(espécie1).not.toBe(espécie11);
  });

  it("o contador é separado por espécie: primeiro da espécie 2 de Fogo é 0211", () => {
    const r = atribuirId(atribuirId({}, 1, "Fogo").registro, 1, "Fogo");
    expect(atribuirId(r.registro, 2, "Fogo").id).toBe("0211");
  });

  it("espécie 3 de Água, primeiro, é 0321", () => {
    expect(atribuirId({}, 3, "Agua").id).toBe("0321");
  });

  it("não altera o registro original", () => {
    const registro = {};
    atribuirId(registro, 1, "Fogo");
    expect(registro).toEqual({});
  });
});