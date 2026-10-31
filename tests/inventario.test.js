import { describe, it, expect } from "vitest";
import { gerarTiposItens, criarInventario, usarItem, totalUnidades } from "../src/engine/inventario.js";
import itens from "../data/itens.json" with { type: "json" };


describe("inventário: tipos de item", () => {
  it("gera 250 tipos (120 buffs, 120 debuffs, 10 poções)", () => {
    const tipos = gerarTiposItens();
    expect(tipos).toHaveLength(250);
    expect(tipos.filter((t) => t.tipo === "buff")).toHaveLength(120);
    expect(tipos.filter((t) => t.tipo === "debuff")).toHaveLength(120);
    expect(tipos.filter((t) => t.tipo === "pocao")).toHaveLength(10);
  });
});

describe("inventário: estoque do treinador inimigo", () => {
  it("começa com 3 unidades de cada tipo (750 no total)", () => {
    const inv = criarInventario(gerarTiposItens(), 3);
    expect(totalUnidades(inv)).toBe(750);
  });
});

describe("inventário: uso de item", () => {
  it("usar item reduz a quantidade em 1", () => {
    const inv = criarInventario(gerarTiposItens(), 3);
    const id = inv.itens[0].id;
    const depois = usarItem(inv, id);
    expect(depois.itens.find((i) => i.id === id).quantidade).toBe(2);
  });

  it("item com quantidade 1 some do inventário ao ser usado", () => {
    const inv = criarInventario(gerarTiposItens(), 1);
    const id = inv.itens[0].id;
    const depois = usarItem(inv, id);
    expect(depois.itens.find((i) => i.id === id)).toBeUndefined();
  });

  it("usar um item que já não existe no inventário é recusado", () => {
    const inv = criarInventario(gerarTiposItens(), 1);
    const id = inv.itens[0].id;
    const depois = usarItem(inv, id);
    expect(() => usarItem(depois, id)).toThrow();
  });

  it("usar item não altera o inventário original", () => {
    const inv = criarInventario(gerarTiposItens(), 3);
    usarItem(inv, inv.itens[0].id);
    expect(inv.itens[0].quantidade).toBe(3);
  });
});

describe("inventário lê data/itens.json", () => {
  it("cada buff carrega o multiplicador do JSON", () => {
    const b = gerarTiposItens().find((t) => t.id === "buff_ataque_muitoFraco_pequeno");
    expect(b.multiplicador).toBe(itens.buff.muitoFraco);
  });

  it("cada debuff carrega o multiplicador do JSON", () => {
    const d = gerarTiposItens().find((t) => t.id === "debuff_defesa_muitoForte_grande");
    expect(d.multiplicador).toBe(itens.debuff.muitoForte);
  });

  it("cada tipo carrega a duração do tamanho do JSON", () => {
    const m = gerarTiposItens().find((t) => t.id === "buff_velocidade_normal_medio");
    expect(m.duracaoTurnos).toBe(itens.tamanhos.medio.duracaoTurnos);
  });

  it("poção carrega o percentual do JSON", () => {
    const p = gerarTiposItens().find((t) => t.id === "pocao_vida_muitoForte");
    expect(p.recuperacaoPercentual).toBe(itens.pocoes.recuperacaoPercentual.muitoForte);
  });
});