import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarTreinador, capturarCriatura } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const jogador = () => ({ ...criarCriatura(especie, () => 0.5, true), velocidade: 10 });
const selvagem = () => ({ ...criarCriatura({ ...especie, nome: "Selvagem" }, () => 0.5), velocidade: 1, selvagem: true });

describe("a criatura capturada entra no grupo do treinador", () => {
  it("o turno devolve a criatura capturada e o treinador a recebe no grupo", () => {
    const r = executarTurno({ jogador: jogador(), robo: selvagem(), acaoJogador: { tipo: "captura", base: 20 }, acaoRobo: "basico", random: () => 0 });
    const t = capturarCriatura(criarTreinador({ nome: "Zé", dataNascimento: "0202" }), r.capturada);
    expect(t.grupo.criaturas).toHaveLength(1);
    expect(t.grupo.criaturas[0].nome).toBe("Selvagem");
  });
});