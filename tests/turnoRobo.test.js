import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

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

const golpe = { id: "g_robo", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };
const meio = () => 0.5;
const alto = () => 0.9;

describe("robô escolhe a ação no turno quando não recebe acaoRobo", () => {
  it("sorteio 0,5 escolhe o golpe do robô (10 − 5 = 5 de dano)", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "basico", golpesRobo: [golpe], random: meio });
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("golpe");
    expect(r.jogador.vida).toBe(25);
  });

  it("sorteio 0,9 faz o robô tentar fugir, e a chance de 33% falha com sorteio 91", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "basico", golpesRobo: [golpe], random: alto });
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("fuga_falhou");
    expect(r.resultado).toBeNull();
  });

  it("robô sem fôlego para nenhum golpe usa o básico (10 − 5 = 5 de dano)", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo({ folego: 0 }), acaoJogador: "basico", golpesRobo: [golpe], random: meio });
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("basico");
    expect(r.jogador.vida).toBe(25);
  });
});