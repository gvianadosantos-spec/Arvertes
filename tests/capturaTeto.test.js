import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], selvagem: true };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", velocidade: 10 };
const robo = { ...base, nome: "Robo" };

describe("captura e teto de vínculo", () => {
  it("criatura acima do teto não é capturada", () => {
    const r = executarTurno({ jogador, robo: { ...robo, nivel: 60 }, acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", tetoNivel: 50, grupoCheio: false, random: () => 0 });
    expect(r.resultado).toBeNull();
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("captura_falhou");
    expect(r.fadigaDelta).toBe(15);
  });

  it("criatura dentro do teto pode ser capturada", () => {
    const r = executarTurno({ jogador, robo: { ...robo, nivel: 40 }, acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", tetoNivel: 50, grupoCheio: false, random: () => 0 });
    expect(r.resultado).toBe("captura");
  });
});