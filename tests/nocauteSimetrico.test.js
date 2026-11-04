import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", velocidade: 5, vida: 5 };
const robo = { ...base, nome: "Robo", resistencia: 1 };

describe("nocaute simultâneo pelo lado do robô", () => {
  it("robô que zera a vida do jogador e a própria resistência no mesmo golpe vence", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(r.robo.resistencia).toBe(0);
    expect(r.jogador.vida).toBe(0);
    expect(r.resultado).toBe("robo");
  });
});