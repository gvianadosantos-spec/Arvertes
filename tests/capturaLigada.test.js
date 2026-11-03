import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarTreinador, capturarCriatura } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const jogadorCriado = () => criarCriatura(especie, () => 0.5, true);
const selvagem = () => ({ ...criarCriatura(especie, () => 0.5), selvagem: true, nivel: 1 });

describe("captura do turno entra no grupo do treinador", () => {
  it("a criatura capturada volta no resultado do turno para ser colocada no grupo", () => {
    const t = criarTreinador({ nome: "Zé", dataNascimento: "0202" });
    const r = executarTurno({ jogador: jogadorCriado(), robo: selvagem(), acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", random: () => 0 });
    const depois = capturarCriatura(t, r.capturada);
    expect(depois.grupo.criaturas).toHaveLength(1);
    expect(depois.grupo.criaturas[0].id).toBe("0111");
  });
});