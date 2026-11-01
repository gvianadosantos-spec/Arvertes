import { describe, it, expect } from "vitest";
import { calcularDanoNormal, calcularDanoElemental } from "../src/engine/danos.js";
import { calcularDano } from "../src/engine/battle.js";

const criatura = (over = {}) => ({
  nome: "Teste", ehJogador: true, elemento: "Agua", afinidade: 1,
  vida: 30, ataque: 20, defesa: 10, ataqueElemento: 20, defesaElemento: 5,
  velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [], ...over,
});

const efeito = (tipo, atributo, multiplicador) => ({ id: "e", tipo, atributo, multiplicador, turnosRestantes: 3 });

const golpe = { id: "g", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };
const golpeElemental = { id: "ge", tipo: "elemental", elemento: "Fisico", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };

describe("efeitos alteram o dano pelo atributo base", () => {
  it("sem efeito, ataque 20 contra defesa 10 dá 10", () => {
    expect(calcularDanoNormal(criatura(), golpe, criatura({ defesa: 10 }))).toBe(10);
  });

  it("buff de ataque 1,25 faz o ataque efetivo ser 25 (25 − 10 = 15)", () => {
    const atacante = criatura({ efeitos: [efeito("buff", "ataque", 1.25)] });
    expect(calcularDanoNormal(atacante, golpe, criatura({ defesa: 10 }))).toBe(15);
  });

  it("debuff de defesa 0,75 faz a defesa efetiva ser 15 (20 − 15 = 5)", () => {
    const defensor = criatura({ defesa: 20, efeitos: [efeito("debuff", "defesa", 0.75)] });
    expect(calcularDanoNormal(criatura(), golpe, defensor)).toBe(5);
  });

  it("efeito de outro atributo não altera o dano (buff de velocidade)", () => {
    const atacante = criatura({ efeitos: [efeito("buff", "velocidade", 1.25)] });
    expect(calcularDanoNormal(atacante, golpe, criatura({ defesa: 10 }))).toBe(10);
  });

  it("o básico também usa o ataque efetivo (25 − 10 = 15)", () => {
    const atacante = criatura({ efeitos: [efeito("buff", "ataque", 1.25)] });
    expect(calcularDano(atacante, criatura({ defesa: 10 }))).toBe(15);
  });

  it("buff de ataqueElemento 1,25 no elemental: força 25, neutra, menos defesa elemental 5 = 20", () => {
    const atacante = criatura({ efeitos: [efeito("buff", "ataqueElemento", 1.25)] });
    expect(calcularDanoElemental(atacante, golpeElemental, criatura({ elemento: "Fogo", defesaElemento: 5 }))).toBe(20);
  });
});