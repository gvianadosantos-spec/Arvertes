import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: true, elemento: "Agua", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", id: "0111" };
const robo = { ...base, nome: "Robo", ehJogador: false, elemento: "Fogo", velocidade: 5 };
const reserva = { ...base, nome: "Reserva", id: "0112" };

describe("troca inválida no turno", () => {
  it("trocar para a própria criatura ativa é recusado", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "trocar", criatura: jogador }, acaoRobo: "basico", grupo: [jogador, reserva], random: () => 0 });
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("troca_recusada");
    expect(r.jogador.id).toBe("0111");
  });

  it("trocar para criatura fora do grupo é recusada", () => {
    const estranha = { ...base, nome: "Estranha", id: "0999" };
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "trocar", criatura: estranha }, acaoRobo: "basico", grupo: [jogador, reserva], random: () => 0 });
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("troca_recusada");
    expect(r.jogador.id).toBe("0111");
  });
});