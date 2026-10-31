import { describe, it, expect } from "vitest";
import { criarGrupo, criaturaAtiva, trocarAtiva, podeAgir, fimDaRodada } from "../src/engine/grupo.js";

const criatura = (nome, vida = 10) => ({ nome, vida, folego: 20, resistencia: 200 });

describe("troca de Arverte", () => {
  it("troca para outra criatura viva e a torna ativa", () => {
    const grupo = criarGrupo([criatura("A"), criatura("B")]);
    expect(criaturaAtiva(trocarAtiva(grupo, 1)).nome).toBe("B");
  });

  it("não troca para a criatura que já está ativa", () => {
    const grupo = criarGrupo([criatura("A"), criatura("B")]);
    expect(() => trocarAtiva(grupo, 0)).toThrow();
  });

  it("não troca para criatura nocauteada", () => {
    const grupo = criarGrupo([criatura("A"), criatura("B", 0)]);
    expect(() => trocarAtiva(grupo, 1)).toThrow();
  });

  it("quem entra não age na rodada da troca", () => {
    const grupo = trocarAtiva(criarGrupo([criatura("A"), criatura("B")]), 1);
    expect(podeAgir(grupo)).toBe(false);
  });

  it("quem entra age na rodada seguinte", () => {
    const grupo = fimDaRodada(trocarAtiva(criarGrupo([criatura("A"), criatura("B")]), 1));
    expect(podeAgir(grupo)).toBe(true);
  });
});