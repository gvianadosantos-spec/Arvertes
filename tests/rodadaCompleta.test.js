import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", resistencia: 1, velocidade: 10 };
const robo = { ...base, nome: "Robo", velocidade: 5 };

describe("a rodada termina antes do encerramento por resistência", () => {
  it("o robô ainda age na rodada em que o jogador zera a resistência", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(r.eventos.map((e) => e.quem)).toEqual(["jogador", "robo"]);
    expect(r.resultado).toBe("robo");
  });
});