import { describe, it, expect } from "vitest";
import { criarTreinador, capturarCriatura, aplicarFimBatalha } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";
import { criarGrupo, criaturaAtiva } from "../src/engine/grupo.js";

const especie = { id: "teste_fogo_1", nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const meio = () => 0.5;

const comAtiva = (over = {}) => {
  const c = { ...criarCriatura(especie, meio, true), id: "0111", ...over };
  return { ...criarTreinador({ nome: "Zé", dataNascimento: "0202" }), grupo: criarGrupo([c]) };
};

const turno = (t, resultado, nivelRobo) => ({
  resultado,
  robo: { nivel: nivelRobo },
  jogador: criaturaAtiva(t.grupo),
  saiu: null,
  participantes: ["0111"],
});

describe("fim da batalha: vitória sobe de nível com XP correto", () => {
  it("vitória contra nível 10 sobe até o nível 3 e guarda 50 de XP", () => {
    const t = comAtiva();
    const depois = aplicarFimBatalha(t, turno(t, "jogador", 10), meio);
    expect(criaturaAtiva(depois.grupo).nivel).toBe(3);
    expect(criaturaAtiva(depois.grupo).xp).toBe(50);
  });

  it("vitória contra nível 20 sobe até o nível 4 e guarda 60 de XP", () => {
    const t = comAtiva();
    const depois = aplicarFimBatalha(t, turno(t, "jogador", 20), meio);
    expect(criaturaAtiva(depois.grupo).nivel).toBe(4);
    expect(criaturaAtiva(depois.grupo).xp).toBe(60);
  });

  it("criatura no teto de vínculo não ganha XP nem sobe", () => {
    const t = comAtiva({ nivel: 50, vinculo: 1 });
    const depois = aplicarFimBatalha(t, turno(t, "jogador", 10), meio);
    expect(criaturaAtiva(depois.grupo).nivel).toBe(50);
    expect(criaturaAtiva(depois.grupo).xp).toBe(0);
  });
});