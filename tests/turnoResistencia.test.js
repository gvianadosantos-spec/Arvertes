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

describe("nocaute por resistência dentro do turno", () => {
  it("robô com resistência 1 fica com 0 depois da rodada e perde, mesmo com vida cheia", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo({ resistencia: 1 }), acaoJogador: "basico", acaoRobo: "basico", random: acerta });
    expect(r.robo.resistencia).toBe(0);
    expect(r.robo.vida).toBeGreaterThan(0);
    expect(r.resultado).toBe("jogador");
  });

  it("jogador com resistência 1 fica com 0 depois da rodada e perde, mesmo com vida cheia", () => {
    const r = executarTurno({ jogador: jogador({ resistencia: 1 }), robo: robo(), acaoJogador: "basico", acaoRobo: "basico", random: acerta });
    expect(r.jogador.resistencia).toBe(0);
    expect(r.jogador.vida).toBeGreaterThan(0);
    expect(r.resultado).toBe("robo");
  });
});