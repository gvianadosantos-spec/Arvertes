import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", resistencia: 1 };
const robo = { ...base, nome: "Robo", velocidade: 5 };
const reserva = { ...base, nome: "Reserva", ehJogador: true, elemento: "Agua", resistencia: 50 };

describe("troca e resistência", () => {
  it("a criatura que sai perde 1 de resistência", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "trocar", criatura: reserva }, acaoRobo: "basico", random: () => 0 });
    expect(r.saiu.resistencia).toBe(0);
  });

  it("a criatura que entra não perde resistência na rodada da troca", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "trocar", criatura: reserva }, acaoRobo: "basico", random: () => 0 });
    expect(r.jogador.resistencia).toBe(50);
  });
});