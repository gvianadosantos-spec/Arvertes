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
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, ...over,
});

describe("fuga do jogador no turno (velocidades iguais, chance 50%)", () => {
  it("sorteio acima da chance: a fuga falha, o jogador perde a rodada e não há resultado", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "fugir", acaoRobo: "basico", random: () => 0.6 });
    expect(r.resultado).toBeNull();
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("fuga_falhou");
  });

  it("sorteio dentro da chance: a fuga dá certo e encerra com 'fuga'", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "fugir", acaoRobo: "basico", random: () => 0.4 });
    expect(r.resultado).toBe("fuga");
  });
});