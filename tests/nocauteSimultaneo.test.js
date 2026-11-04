import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", velocidade: 10, resistencia: 1 };
const robo = { ...base, nome: "Robo", vida: 5 };

describe("nocaute simultâneo", () => {
  it("jogador que zera a vida do robô e a própria resistência no mesmo golpe perde", () => {
    const r = executarTurno({ jogador, robo, acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(r.jogador.resistencia).toBe(0);
    expect(r.robo.vida).toBe(0);
    expect(r.resultado).toBe("robo");
  });
});