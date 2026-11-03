import { describe, it, expect } from "vitest";
import { criarOvo, chocarOvo } from "../src/engine/ovo.js";
import especies from "../data/testes/especies.json" with { type: "json" };

describe("ovo: identidade da espécie chega ao bebê", () => {
  it("bebê guarda numero e elemento da espécie", () => {
    const bebe = chocarOvo(criarOvo(especies[0], () => 0.5), () => 0.5);
    expect(bebe).toMatchObject({ numero: 1, elemento: "Fogo" });
  });
});