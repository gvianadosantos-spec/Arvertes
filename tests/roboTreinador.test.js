import { describe, it, expect } from "vitest";
import { escolherAcaoRoboTreinador } from "../src/engine/roboTreinador.js";
import { gerarTiposItens, criarInventario } from "../src/engine/inventario.js";

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
const inventario = criarInventario(gerarTiposItens(), 3);

describe("robô com treinador: escolha da ação", () => {
  it("sorteio até 40 escolhe golpe aleatório", () => {
    const acao = escolherAcaoRoboTreinador(robo, jogador, [fraco, forte], inventario, () => 0.39);
    expect(acao.tipo).toBe("golpe");
    expect(acao.golpe).toBe(fraco);
  });

  it("sorteio de 41 a 80 escolhe o golpe de maior dano", () => {
    const acao = escolherAcaoRoboTreinador(robo, jogador, [fraco, forte], inventario, () => 0.5);
    expect(acao.tipo).toBe("golpe");
    expect(acao.golpe).toBe(forte);
  });

  it("sorteio acima de 80 usa um item", () => {
    const acao = escolherAcaoRoboTreinador(robo, jogador, [fraco, forte], inventario, () => 0.9);
    expect(acao.tipo).toBe("item");
    expect(acao.item).toBeDefined();
  });

  it("sem item com estoque, o sorteio de 20% vira golpe (fallback técnico)", () => {
    const vazio = { itens: [] };
    const acao = escolherAcaoRoboTreinador(robo, jogador, [fraco, forte], vazio, () => 0.9);
    expect(acao.tipo).toBe("golpe");
  });

  it("sem fôlego para nenhum golpe usa o básico", () => {
    const semFolego = { ...robo, folego: 0 };
    const acao = escolherAcaoRoboTreinador(semFolego, jogador, [fraco, forte], inventario, () => 0.5);
    expect(acao.tipo).toBe("basico");
  });
});