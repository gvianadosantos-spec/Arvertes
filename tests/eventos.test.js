import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const acerta = () => 0;
const erra = () => 0.9999;

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

const golpeNormal = { id: "g_normal", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };
const golpeElemental = { id: "g_elem", tipo: "elemental", elemento: "Agua", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };

describe("etapa D: eventos do turno", () => {
  it("golpe que acerta gera evento com quem, golpe, dano e acerto", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta });
    expect(r.eventos[0]).toEqual({ quem: "jogador", acao: "golpe", golpeId: "g_normal", acertou: true, dano: 5, relacao: null });
  });

  it("golpe que erra gera evento com acertou falso e dano zero", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: { ...golpeNormal, chanceAcerto: 33 }, acaoRobo: "basico", random: erra });
    expect(r.eventos[0]).toEqual({ quem: "jogador", acao: "golpe", golpeId: "g_normal", acertou: false, dano: 0, relacao: null });
  });

  it("golpe elemental registra a relação com o defensor (Água contra Fogo é superior)", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeElemental, acaoRobo: "basico", random: acerta });
    expect(r.eventos[0].relacao).toBe("superior");
  });

  it("ação básica gera evento com acao 'basico' e sem golpe", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "basico", acaoRobo: "basico", random: acerta });
    expect(r.eventos[0]).toEqual({ quem: "jogador", acao: "basico", golpeId: null, acertou: true, dano: 5, relacao: null });
  });

  it("fuga gera um único evento de fuga", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "fugir", acaoRobo: "basico", random: acerta });
    expect(r.eventos).toEqual([{ quem: "jogador", acao: "fuga", golpeId: null, acertou: false, dano: 0, relacao: null }]);
  });

  it("eventos seguem a ordem de velocidade", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo({ velocidade: 20 }), acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta });
    expect(r.eventos.map((e) => e.quem)).toEqual(["robo", "jogador"]);
  });

  it("para de gerar eventos quando alguém é derrotado", () => {
    const r = executarTurno({ jogador: jogador({ vida: 1 }), robo: robo({ velocidade: 20 }), acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta });
    expect(r.eventos).toHaveLength(1);
    expect(r.resultado).toBe("robo");
  });
});