import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const jogador = {
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50,
};

const robo = {
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50,
};

const golpe = { id: "g_robo", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };

describe("fôlego do inimigo", () => {
  it("o inimigo gasta o custo do golpe que usa", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: "basico", acaoRobo: golpe, random: () => 0 });
    expect(r.robo.folego).toBe(15);
  });

  it("sem fôlego para o golpe, o inimigo usa o básico e não gasta fôlego", () => {
    const r = executarTurno({ jogador, robo: { ...robo, folego: 2 }, acaoJogador: "basico", acaoRobo: golpe, random: () => 0 });
    expect(r.robo.folego).toBe(2);
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("basico");
  });

  it("o inimigo com treinador também gasta fôlego ao escolher golpe", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: "basico", acaoRobo: golpe, random: () => 0 });
    expect(r.robo.folego).toBeLessThan(20);
  });
});