import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const acerta = () => 0;
const erra = () => 0.9999;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50,
  ...over,
});

const robo = (over = {}) => ({
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50,
  ...over,
});

const golpeNormal = { id: "g_normal", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };
const golpeErra = { ...golpeNormal, id: "g_erra", chanceAcerto: 33 };
const golpeElemental = { id: "g_elem", tipo: "elemental", elemento: "Agua", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };
const golpeHibrido = { id: "g_hib", tipo: "hibrido", elemento: "Agua", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 5 };

describe("etapa C: turno com ação escolhida", () => {
  it("golpe normal aplica dano, gasta fôlego e desgasta a resistência de quem agiu e de quem apanhou", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta });
    expect(r.robo.vida).toBe(25);
    expect(r.jogador.vida).toBe(25);
    expect(r.jogador.folego).toBe(15);
    expect(r.robo.folego).toBe(20);
    expect(r.jogador.resistencia).toBe(49);
    expect(r.robo.resistencia).toBe(49);
    expect(r.resultado).toBeNull();
  });

  it("golpe que erra não causa dano, mas gasta fôlego", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeErra, acaoRobo: "basico", random: erra });
    expect(r.robo.vida).toBe(30);
    expect(r.jogador.folego).toBe(15);
  });

  it("golpe elemental: superior multiplica a força antes da defesa (10 × 1,5 − 5 = 10)", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeElemental, acaoRobo: "basico", random: acerta });
    expect(r.robo.vida).toBe(20);
    expect(r.jogador.folego).toBe(15);
  });

  it("golpe híbrido soma parte física e elemental (5 + 10 = 15)", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: golpeHibrido, acaoRobo: "basico", random: acerta });
    expect(r.robo.vida).toBe(15);
  });

  it("sem fôlego para o golpe escolhido, usa o básico e não gasta fôlego", () => {
    const r = executarTurno({ jogador: jogador({ folego: 2 }), robo: robo(), acaoJogador: golpeNormal, acaoRobo: "basico", random: acerta });
    expect(r.robo.vida).toBe(25);
    expect(r.jogador.folego).toBe(2);
  });

  it("jogador mais rápido foge: batalha termina com 'fuga' e o robô não age", () => {
    const r = executarTurno({ jogador: jogador(), robo: robo(), acaoJogador: "fugir", acaoRobo: "basico", random: acerta });
    expect(r.resultado).toBe("fuga");
    expect(r.robo.vida).toBe(30);
    expect(r.jogador.vida).toBe(30);
    expect(r.robo.folego).toBe(20);
  });

  it("robô mais rápido derruba o jogador antes da fuga: derrota, sem fuga", () => {
   
    const r = executarTurno({
      jogador: jogador({ vida: 1 }),
      robo: robo({ velocidade: 20 }),
      acaoJogador: "fugir",
      acaoRobo: "basico",
      random: acerta,
    });
    expect(r.jogador.vida).toBe(0);
    expect(r.resultado).toBe("robo");
    expect(r.resultado).not.toBe("fuga");
  });
});