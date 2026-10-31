import { describe, it, expect } from "vitest";
import { usarPocao } from "../src/engine/pocoes.js";

const criatura = { vida: 30, vidaMaxima: 42, folego: 5, folegoMaximo: 28 };
const pocaoVida = (percentual) => ({ atributo: "vida", recuperacaoPercentual: percentual });
const pocaoFolego = (percentual) => ({ atributo: "folego", recuperacaoPercentual: percentual });

describe("poções: recuperação por percentual do máximo", () => {
  it("poção de vida 20% recupera 8 (42 × 20% = 8,4, arredondado para baixo)", () => {
    const depois = usarPocao({ ...criatura, vida: 10 }, pocaoVida(20));
    expect(depois.vida).toBe(18);
  });

  it("poção de fôlego 20% recupera 5 (28 × 20% = 5,6, arredondado para baixo)", () => {
    const depois = usarPocao({ ...criatura, folego: 0 }, pocaoFolego(20));
    expect(depois.folego).toBe(5);
  });

  it("poção de vida 60% recupera 25, mas não passa de 42", () => {
    const depois = usarPocao(criatura, pocaoVida(60));
    expect(depois.vida).toBe(42);
  });

  it("poção de vida 100% em criatura quase cheia fica no máximo", () => {
    const depois = usarPocao({ ...criatura, vida: 40 }, pocaoVida(100));
    expect(depois.vida).toBe(42);
  });

  it("poção de fôlego 100% enche o fôlego até o máximo", () => {
    const depois = usarPocao(criatura, pocaoFolego(100));
    expect(depois.folego).toBe(28);
  });

  it("poção não altera o outro atributo", () => {
    const depois = usarPocao(criatura, pocaoVida(40));
    expect(depois.folego).toBe(5);
  });

  it("poção não altera a criatura original", () => {
    usarPocao(criatura, pocaoVida(40));
    expect(criatura.vida).toBe(30);
  });
});