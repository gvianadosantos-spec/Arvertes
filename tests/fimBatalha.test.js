import { describe, it, expect } from "vitest";
import { criarTreinador, capturarCriatura, aplicarFimBatalha } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";
import { executarTurno } from "../src/engine/turno.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const sorteio = () => 0.5;
const treinadorComAtiva = () => capturarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), criarCriatura(especie, sorteio, true));
const ativa = (t) => t.grupo.criaturas[0];
const selvagem = (over = {}) => ({ ...criarCriatura({ ...especie, nome: "Selvagem" }, sorteio), selvagem: true, nivel: 1, ...over });

describe("fim da batalha dá XP à criatura ativa", () => {
  it("vitória dá XP e a ativa sobe de nível", () => {
    const t = treinadorComAtiva();
    const turno = executarTurno({ jogador: ativa(t), robo: selvagem({ vida: 1, velocidade: 1 }), acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(turno.resultado).toBe("jogador");
    expect(aplicarFimBatalha(t, turno, sorteio).grupo.criaturas[0].nivel).toBe(2);
  });

  it("derrota não dá XP", () => {
    const t = treinadorComAtiva();
    const turno = executarTurno({ jogador: { ...ativa(t), vida: 1 }, robo: selvagem({ velocidade: 999 }), acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(turno.resultado).toBe("robo");
    expect(aplicarFimBatalha(t, turno, sorteio).grupo.criaturas[0].nivel).toBe(1);
  });

  it("captura dá XP de captura, sem subir de nível", () => {
    const t = treinadorComAtiva();
    const turno = executarTurno({ jogador: ativa(t), robo: selvagem(), acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", tetoNivel: 100, grupoCheio: false, random: () => 0 });
    expect(turno.resultado).toBe("captura");
    expect(aplicarFimBatalha(t, turno, sorteio).grupo.criaturas[0].xp).toBe(7);
  });
});