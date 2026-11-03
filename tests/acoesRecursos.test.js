import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { gerarTiposItens, criarInventario } from "../src/engine/inventario.js";

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua", vida: 10 };
const robo = { ...base, nome: "Robo", velocidade: 5 };
const inventarioComUmaPocao = () => criarInventario(gerarTiposItens(), 1);
const pocao = (inventario) => inventario.itens.find((i) => i.id === "pocao_vida_normal");

describe("item consome estoque", () => {
  it("usar item consome uma unidade do estoque", () => {
    const inv = inventarioComUmaPocao();
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "item", item: pocao(inv) }, acaoRobo: "basico", inventario: inv, random: () => 0 });
    expect(r.inventario.itens.find((i) => i.id === "pocao_vida_normal")).toBeUndefined();
  });

  it("item sem estoque é recusado e não cura", () => {
    const inv = inventarioComUmaPocao();
    const r1 = executarTurno({ jogador, robo, acaoJogador: { tipo: "item", item: pocao(inv) }, acaoRobo: "basico", inventario: inv, random: () => 0 });
    const r2 = executarTurno({ jogador: r1.jogador, robo: r1.robo, acaoJogador: { tipo: "item", item: pocao(inv) }, acaoRobo: "basico", inventario: r1.inventario, random: () => 0 });
    expect(r2.eventos.find((e) => e.quem === "jogador").acao).toBe("item_recusado");
  });
});

describe("resistência nas ações de item e captura", () => {
  it("usar item gasta 1 de resistência de quem usa", () => {
    const inv = inventarioComUmaPocao();
    const r = executarTurno({ jogador: { ...jogador, resistencia: 1 }, robo, acaoJogador: { tipo: "item", item: pocao(inv) }, acaoRobo: "basico", inventario: inv, random: () => 0 });
    expect(r.jogador.resistencia).toBe(0);
    expect(r.resultado).toBe("robo");
  });

  it("tentar capturar gasta 1 de resistência de quem tenta", () => {
    const r = executarTurno({ jogador: { ...jogador, resistencia: 1 }, robo: { ...robo, selvagem: true }, acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", random: () => 0.99 });
    expect(r.jogador.resistencia).toBe(0);
    expect(r.resultado).toBe("robo");
  });
});