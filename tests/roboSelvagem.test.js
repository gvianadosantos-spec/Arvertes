import { describe, it, expect } from "vitest";
import { escolherAcaoRobo } from "../src/engine/robo.js";

const jogador = {
  nome: "Jogador", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50,
};

const robo = {
  nome: "Robo", ehJogador: false, elemento: "Fogo", afinidade: 1,
  vida: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50,
};

const fraco = { id: "g_fraco", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };
const forte = { id: "g_forte", tipo: "normal", ataqueGolpe: 2, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };
const caro = { id: "g_caro", tipo: "normal", ataqueGolpe: 3, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 50 };

describe("robô selvagem: escolha da ação na rodada", () => {
  it("sorteio até 40 escolhe golpe aleatório (não o de maior dano)", () => {
    expect(escolherAcaoRobo(robo, jogador, [fraco, forte], () => 0.39)).toBe(fraco);
  });

  it("sorteio de 41 a 80 escolhe o golpe de maior dano esperado", () => {
    expect(escolherAcaoRobo(robo, jogador, [fraco, forte], () => 0.4)).toBe(forte);
  });

  it("sorteio acima de 80 tenta fugir", () => {
    expect(escolherAcaoRobo(robo, jogador, [fraco, forte], () => 0.8)).toBe("fugir");
  });

  it("golpe sem fôlego não entra na escolha de maior dano", () => {
    expect(escolherAcaoRobo(robo, jogador, [fraco, caro], () => 0.4)).toBe(fraco);
  });

  it("golpe aleatório só sorteia entre golpes com fôlego", () => {
    expect(escolherAcaoRobo(robo, jogador, [caro, fraco], () => 0.39)).toBe(fraco);
  });

  it("sem nenhum golpe com fôlego, usa o básico", () => {
    expect(escolherAcaoRobo(robo, jogador, [caro], () => 0.4)).toBe("basico");
  });
});