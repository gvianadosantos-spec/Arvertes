import { describe, it, expect } from "vitest";
import {
  desgastarResistencia,
  estaNocauteado,
} from "../src/engine/resistencia.js";

const criatura = (vida, resistencia) => ({ nome: "Teste", vida, resistencia });

describe("resistência: desgaste por rodada", () => {
  it("desgasta 1 de resistência", () => {
    expect(desgastarResistencia(criatura(30, 10)).resistencia).toBe(9);
  });

  it("não fica abaixo de zero", () => {
    expect(desgastarResistencia(criatura(30, 0)).resistencia).toBe(0);
  });

  it("não altera a vida", () => {
    expect(desgastarResistencia(criatura(30, 10)).vida).toBe(30);
  });
});

describe("resistência: nocaute", () => {
  it("resistência zerada é nocaute, mesmo com vida cheia", () => {
    expect(estaNocauteado(criatura(50, 0))).toBe(true);
  });

  it("resistência acima de zero não é nocaute, mesmo com vida baixa", () => {
    expect(estaNocauteado(criatura(1, 1))).toBe(false);
  });
});