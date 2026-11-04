import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const zero = () => 0;
const alto = () => 0.9;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const selvagem = (over = {}) => ({
  nome: "Selvagem", ehJogador: false, elemento: "Fogo", afinidade: 1, selvagem: true,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], nivel: 1, ...over,
});

const captura = { tipo: "captura", base: 20 };
const base = { tetoNivel: 100, grupoCheio: false };

describe("captura no turno", () => {
  it("captura bem-sucedida termina a batalha com 'captura' e entrega a criatura ao grupo", () => {
    const r = executarTurno({ jogador: jogador(), robo: selvagem(), acaoJogador: captura, acaoRobo: "basico", random: zero, ...base });
    expect(r.resultado).toBe("captura");
    expect(r.capturada.nome).toBe("Selvagem");
    expect(r.fadigaDelta).toBe(5);
    expect(r.robo.vida).toBe(30);
  });

  it("captura falha: soma 15 de fadiga e o selvagem age depois", () => {
    const r = executarTurno({ jogador: jogador(), robo: selvagem(), acaoJogador: captura, acaoRobo: "basico", random: alto, ...base });
    expect(r.resultado).toBeNull();
    expect(r.fadigaDelta).toBe(15);
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("captura_falhou");
    expect(r.jogador.vida).toBe(25);
  });

  it("grupo cheio: a captura falha mesmo com sorteio favorável", () => {
    const r = executarTurno({ jogador: jogador(), robo: selvagem(), acaoJogador: captura, acaoRobo: "basico", random: zero, tetoNivel: 100, grupoCheio: true });
    expect(r.resultado).toBeNull();
    expect(r.fadigaDelta).toBe(15);
  });
});