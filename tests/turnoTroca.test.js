import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const acerta = () => 0;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, ...over,
});

const robo = (over = {}) => ({
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, ...over,
});

const reserva = {
  nome: "Reserva", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 25, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50,
};

const golpeNormal = { id: "g_normal", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };

describe("troca no turno", () => {
  it("trocar gasta o turno: a criatura que entra não ataca nessa rodada, e o robô ataca a reserva", () => {
    const r = executarTurno({
      jogador: jogador(), robo: robo(), grupo: [jogador(), reserva],
      acaoJogador: { tipo: "trocar", criatura: reserva },
      acaoRobo: "basico", random: acerta,
    });
    expect(r.jogador.nome).toBe("Reserva");
    expect(r.robo.vida).toBe(30);
    expect(r.jogador.vida).toBe(20);
    expect(r.jogador.folego).toBe(20);
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("troca");
  });

  it("a criatura que entrou age na rodada seguinte", () => {
    const trocou = executarTurno({
      jogador: jogador(), robo: robo(), grupo: [jogador(), reserva],
      acaoJogador: { tipo: "trocar", criatura: reserva },
      acaoRobo: "basico", random: acerta,
    });
    const seguinte = executarTurno({
      jogador: trocou.jogador, robo: trocou.robo, grupo: [trocou.jogador, jogador()],
      acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta,
    });
    expect(seguinte.robo.vida).toBeLessThan(trocou.robo.vida);
  });
});