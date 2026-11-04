import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarCriatura } from "../src/engine/createArverte.js";
import { gerarTiposItens, criarInventario } from "../src/engine/inventario.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const jogador = () => ({ ...criarCriatura(especie, () => 0.5, true), velocidade: 10 });
const roboDeTreinador = () => ({ ...criarCriatura({ ...especie, nome: "Robo" }, () => 0.5), velocidade: 1, deTreinador: true });
const golpe = { id: "g", tipo: "normal", ataqueGolpe: 2, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };

describe("robô de treinador escolhe a própria ação no turno", () => {
  it("sem ação passada, o robô de treinador usa a IA dele, e não a selvagem", () => {
    const inventarioRobo = criarInventario(gerarTiposItens(), 3);
    const r = executarTurno({
      jogador: jogador(), robo: roboDeTreinador(), acaoJogador: "basico",
      golpesRobo: [golpe], inventarioRobo, random: () => 0.9,
    });
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("item");
  });

  it("robô selvagem continua usando a IA selvagem", () => {
    const r = executarTurno({
      jogador: jogador(),
      robo: criarCriatura({ ...especie, nome: "Selvagem" }, () => 0.5),
      acaoJogador: "basico", golpesRobo: [golpe], random: () => 0.9,
    });
    expect(r.eventos.find((e) => e.quem === "robo").acao).toBe("fuga_falhou");
  });
});