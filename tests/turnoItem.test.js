import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";

const sorteio = () => 0;

const jogador = (over = {}) => ({
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, vidaMaxima: 42, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const robo = (over = {}) => ({
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 5, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const pocaoVida60 = { id: "pocao_vida_normal", tipo: "pocao", atributo: "vida", nivel: "normal", recuperacaoPercentual: 60 };
const buffAtaquePequeno = { id: "buff_ataque_normal_pequeno", tipo: "buff", atributo: "ataque", multiplicador: 1.15, duracaoTurnos: 3 };
const debuffDefesaMedio = { id: "debuff_defesa_normal_medio", tipo: "debuff", atributo: "defesa", multiplicador: 0.85, duracaoTurnos: 5 };

describe("usar item no turno", () => {
  it("usar item gasta a vez: o jogador não ataca, e o robô ataca normalmente", () => {
    const r = executarTurno({
      jogador: jogador({ vida: 10 }),
      robo: robo(),
      acaoJogador: { tipo: "item", item: pocaoVida60 },
      acaoRobo: "basico",
      random: sorteio,
    });
    expect(r.robo.vida).toBe(30);
    expect(r.jogador.vida).toBe(30);
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("item");
  });

  it("pocão não passa do máximo", () => {
    const r = executarTurno({
      jogador: jogador({ vida: 40 }),
      robo: robo(),
      acaoJogador: { tipo: "item", item: pocaoVida60 },
      acaoRobo: "basico",
      random: sorteio,
    });
    expect(r.jogador.vida).toBe(37);
  });

  it("buff vai para quem usa e dura o tamanho do item (3 turnos: sobra 2 depois da primeira rodada)", () => {
    const r = executarTurno({
      jogador: jogador(),
      robo: robo(),
      acaoJogador: { tipo: "item", item: buffAtaquePequeno },
      acaoRobo: "basico",
      random: sorteio,
    });
    expect(r.jogador.efeitos).toHaveLength(1);
    expect(r.jogador.efeitos[0].turnosRestantes).toBe(2);
    expect(r.robo.efeitos).toHaveLength(0);
  });

  it("debuff vai para o adversário e dura o tamanho do item (5 turnos: sobra 4)", () => {
    const r = executarTurno({
      jogador: jogador(),
      robo: robo(),
      acaoJogador: { tipo: "item", item: debuffDefesaMedio },
      acaoRobo: "basico",
      random: sorteio,
    });
    expect(r.jogador.efeitos).toHaveLength(0);
    expect(r.robo.efeitos).toHaveLength(1);
    expect(r.robo.efeitos[0].turnosRestantes).toBe(4);
  });

  it("buff de 3 turnos some depois de 3 rodadas", () => {
    const r1 = executarTurno({
      jogador: jogador(),
      robo: robo(),
      acaoJogador: { tipo: "item", item: buffAtaquePequeno },
      acaoRobo: "basico",
      random: sorteio,
    });
    const r2 = executarTurno({ jogador: r1.jogador, robo: r1.robo, acaoJogador: "basico", acaoRobo: "basico", random: sorteio });
    const r3 = executarTurno({ jogador: r2.jogador, robo: r2.robo, acaoJogador: "basico", acaoRobo: "basico", random: sorteio });
    expect(r3.jogador.efeitos).toHaveLength(0);
  });
});