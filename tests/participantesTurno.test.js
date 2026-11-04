import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const acerta = () => 0;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const robo = (over = {}) => ({
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const reserva = {
  nome: "Reserva", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 25, vidaMaxima: 25, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [],
};

describe("participantes da batalha", () => {
  it("sem troca, a lista fica só com o jogador inicial", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "basico", acaoRobo: "basico", random: acerta });
    expect(r.participantes).toEqual(["Jogador"]);
  });

  it("troca adiciona a criatura que entra à lista", () => {
    const r = executarTurno({
      jogador: jogador(), robo: robo(), grupo: [jogador(), reserva],
      acaoJogador: { tipo: "trocar", criatura: reserva },
      acaoRobo: "basico", random: acerta,
    });
    expect(r.participantes).toEqual(["Jogador", "Reserva"]);
  });

  it("trocar para criatura que já participou não duplica", () => {
    const r = executarTurno({
      jogador: jogador(), robo: robo(), grupo: [jogador(), reserva],
      acaoJogador: { tipo: "trocar", criatura: reserva },
      acaoRobo: "basico", participantes: ["Jogador", "Reserva"], random: acerta,
    });
    expect(r.participantes).toEqual(["Jogador", "Reserva"]);
  });

  it("a lista recebida é mantida e a nova criatura entra no fim", () => {
    const r = executarTurno({
      jogador: jogador(), robo: robo(), grupo: [jogador(), reserva],
      acaoJogador: { tipo: "trocar", criatura: reserva },
      acaoRobo: "basico", participantes: ["Jogador", "Outro"], random: acerta,
    });
    expect(r.participantes).toEqual(["Jogador", "Outro", "Reserva"]);
  });
});