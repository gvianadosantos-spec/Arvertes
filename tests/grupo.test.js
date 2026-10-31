import { describe, it, expect } from "vitest";
import { criarGrupo, adicionarCriatura, criaturaAtiva } from "../src/engine/grupo.js";
import { aplicarResultadoBatalha, recuperarFolegoGrupo } from "../src/engine/grupo.js";

const criatura = (nome, vida = 10) => ({ nome, vida, folego: 20, resistencia: 200 });

describe("grupo: até 5 criaturas", () => {
  it("aceita até 5 criaturas", () => {
    let grupo = criarGrupo([criatura("A")]);
    grupo = adicionarCriatura(grupo, criatura("B"));
    grupo = adicionarCriatura(grupo, criatura("C"));
    grupo = adicionarCriatura(grupo, criatura("D"));
    grupo = adicionarCriatura(grupo, criatura("E"));
    expect(grupo.criaturas).toHaveLength(5);
  });

  it("sexta criatura é recusada", () => {
    const cheio = criarGrupo([criatura("A"), criatura("B"), criatura("C"), criatura("D"), criatura("E")]);
    expect(() => adicionarCriatura(cheio, criatura("F"))).toThrow();
  });

  it("a primeira criatura começa como ativa", () => {
    const grupo = criarGrupo([criatura("A"), criatura("B")]);
    expect(criaturaAtiva(grupo).nome).toBe("A");
  });

  it("adicionar uma criatura não muda a ativa", () => {
    const grupo = adicionarCriatura(criarGrupo([criatura("A")]), criatura("B"));
    expect(criaturaAtiva(grupo).nome).toBe("A");
  });

  it("adicionar não altera o grupo original (imutável)", () => {
    const original = criarGrupo([criatura("A")]);
    adicionarCriatura(original, criatura("B"));
    expect(original.criaturas).toHaveLength(1);
  });
});
describe("grupo: estado entre batalhas", () => {
  it("a vida e a resistência da criatura da batalha são salvas no grupo", () => {
    const grupo = criarGrupo([criatura("A", 30)]);
    const batalhada = { ...criaturaAtiva(grupo), vida: 12, resistencia: 150, folego: 9 };
    const depois = aplicarResultadoBatalha(grupo, batalhada);
    expect(criaturaAtiva(depois).vida).toBe(12);
    expect(criaturaAtiva(depois).resistencia).toBe(150);
    expect(criaturaAtiva(depois).folego).toBe(9);
  });

  it("vitória devolve 1 de fôlego à criatura ativa, sem passar do máximo", () => {
    const grupo = criarGrupo([{ ...criatura("A"), folego: 9, folegoMaximo: 20 }]);
    const depois = recuperarFolegoGrupo(grupo, "vitoria");
    expect(criaturaAtiva(depois).folego).toBe(10);
  });

  it("derrota não devolve fôlego", () => {
    const grupo = criarGrupo([{ ...criatura("A"), folego: 9, folegoMaximo: 20 }]);
    const depois = recuperarFolegoGrupo(grupo, "derrota");
    expect(criaturaAtiva(depois).folego).toBe(9);
  });
});