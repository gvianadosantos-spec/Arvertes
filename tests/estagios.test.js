import { describe, it, expect } from "vitest";
import { estagioAtual } from "../src/engine/estagios.js";

const criatura = (over = {}) => ({ nivel: 1, diasVida: 0, eTita: false, eDeificavel: false, ...over });

describe("estágios: escolha pelo nível e pelos dias de vida", () => {
  it("nível 1 e 0 dias é bebê", () => {
    expect(estagioAtual(criatura())).toBe("bebe");
  });

  it("nível 300 e 100 dias é ancião (ainda não semideus, que pede nível 500)", () => {
    expect(estagioAtual(criatura({ nivel: 300, diasVida: 100 }))).toBe("anciao");
  });

  it("nível alto sem dias suficientes não sobe de estágio", () => {
    expect(estagioAtual(criatura({ nivel: 500, diasVida: 100 }))).toBe("anciao");
  });
});

describe("estágio Deus: nível 900 e 700 dias, ao mesmo tempo, só para deificados", () => {
  it("deificado com nível 900 e 700 dias é Deus", () => {
    expect(estagioAtual(criatura({ nivel: 900, diasVida: 700, eDeificavel: true }))).toBe("deus");
  });

  it("deificado com nível 900 e 400 dias espera: continua semideus", () => {
    expect(estagioAtual(criatura({ nivel: 900, diasVida: 400, eDeificavel: true }))).toBe("semideus");
  });

  it("deificado com nível 600 e 700 dias espera: continua semideus", () => {
    expect(estagioAtual(criatura({ nivel: 600, diasVida: 700, eDeificavel: true }))).toBe("semideus");
  });

  it("não deificado nunca chega a Deus, mesmo com nível 900 e 700 dias", () => {
    expect(estagioAtual(criatura({ nivel: 900, diasVida: 700, eDeificavel: false }))).toBe("semideus");
  });
});

describe("titã não muda o estágio", () => {
  it("titã com nível 100 e 50 dias é adulto", () => {
    expect(estagioAtual(criatura({ nivel: 100, diasVida: 50, eTita: true }))).toBe("adulto");
  });
});
