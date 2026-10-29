import { describe, it, expect } from "vitest";
import { tentarFuga } from "../src/engine/fuga.js";

const sorteiaMaximo = () => 0.9999;
const sorteiaMinimo = () => 0;

describe("fuga: tentativa com chance", () => {
  it("chance 100 sempre foge, mesmo no sorteio máximo", () => {
    expect(tentarFuga(100, sorteiaMaximo)).toBe(true);
  });

  it("chance 0 nunca foge, nem no sorteio mínimo", () => {
    expect(tentarFuga(0, sorteiaMinimo)).toBe(false);
  });

  it("chance 50 foge com sorteio 50 e não com sorteio 51", () => {
    expect(tentarFuga(50, () => 0.495)).toBe(true);
    expect(tentarFuga(50, () => 0.505)).toBe(false);
  });
});