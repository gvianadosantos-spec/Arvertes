import { describe, it, expect } from "vitest";
import {
  gastarFolego,
  escolherAcao,
  recuperarFolegoVitoria,
} from "../src/engine/folego.js";

const golpe = {
  id: "golpe_teste",
  tipo: "normal",
  ataqueGolpe: 1,
  afinidadeGolpe: 1,
  chanceAcerto: 100,
  custoFolego: 5,
};

const criatura = (folego, folegoMaximo = 20) => ({
  nome: "Teste",
  vida: 30,
  ataque: 10,
  defesa: 5,
  folego,
  folegoMaximo,
});

describe("fôlego: gasto por golpe", () => {
  it("golpe gasta o custo do próprio golpe", () => {
    const depois = gastarFolego(criatura(20), golpe);
    expect(depois.folego).toBe(15);
  });

  it("fôlego exatamente igual ao custo permite o golpe e zera o fôlego", () => {
    const acao = escolherAcao(criatura(5), golpe);
    expect(acao).toBe(golpe);
    expect(gastarFolego(criatura(5), golpe).folego).toBe(0);
  });

  it("fôlego abaixo do custo não permite o golpe e usa o básico", () => {
    const acao = escolherAcao(criatura(3), golpe);
    expect(acao).toBe("basico");
  });

  it("sem fôlego nenhum, usa o básico e não gasta nada", () => {
    const acao = escolherAcao(criatura(0), golpe);
    expect(acao).toBe("basico");
  });
});

describe("fôlego: recuperação na vitória", () => {
  it("vitória devolve 1 de fôlego", () => {
    const depois = recuperarFolegoVitoria(criatura(10));
    expect(depois.folego).toBe(11);
  });

  it("vitória não passa do fôlego máximo", () => {
    const depois = recuperarFolegoVitoria(criatura(20, 20));
    expect(depois.folego).toBe(20);
  });
});