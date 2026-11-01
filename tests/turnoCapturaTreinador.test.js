import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const zero = () => 0;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const treinador = (over = {}) => ({
  nome: "Treinador", ehJogador: false, selvagem: false, elemento: "Fogo", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const captura = { tipo: "captura", base: 20 };

describe("captura contra treinador", () => {
  it("tentar capturar treinador soma 15 de fadiga e a vez passa", () => {
    const r = executarTurno({ jogador: jogador(), robo: treinador(), acaoJogador: captura, acaoRobo: "basico", random: zero });
    expect(r.fadigaDelta).toBe(15);
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("captura_recusada");
    expect(r.resultado).toBeNull();
  });

  it("a batalha não termina por captura de treinador", () => {
    const r = executarTurno({ jogador: jogador(), robo: treinador(), acaoJogador: captura, acaoRobo: "basico", random: zero });
    expect(r.resultado).not.toBe("captura");
    expect(r.capturada).toBeUndefined();
  });
});