import { describe, it, expect } from "vitest";
import { gerarTiposItens } from "../src/engine/inventario.js";

const tipos = gerarTiposItens();
const pegar = (id) => tipos.find((t) => t.id === id);

describe("inventário gera os multiplicadores com números fixos", () => {
  it("buff de ataque muito fraco vale 1,05", () => {
    expect(pegar("buff_ataque_muitoFraco_pequeno").multiplicador).toBe(1.05);
  });

  it("debuff de defesa muito forte vale 0,75", () => {
    expect(pegar("debuff_defesa_muitoForte_grande").multiplicador).toBe(0.75);
  });

  it("buff de velocidade normal médio dura 5 turnos", () => {
    expect(pegar("buff_velocidade_normal_medio").duracaoTurnos).toBe(5);
  });

  it("poção de vida muito forte recupera 100%", () => {
    expect(pegar("pocao_vida_muitoForte").recuperacaoPercentual).toBe(100);
  });
});