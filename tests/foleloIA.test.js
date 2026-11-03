import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const jogador = () => ({ ...criarCriatura(especie, () => 0.5, true), velocidade: 10 });
const roboDeTreinador = () => ({ ...criarCriatura({ ...especie, nome: "Robo" }, () => 0.5), velocidade: 1, deTreinador: true });
const golpe = { id: "g", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };

describe("robô de treinador escolhe o golpe pela própria IA", () => {
  it("sem ação passada, o golpe escolhido é executado e gasta o fôlego", () => {
    const robo = roboDeTreinador();
    const r = executarTurno({ jogador: jogador(), robo, acaoJogador: "basico", golpesRobo: [golpe], random: () => 0.5 });
    expect(r.eventos.find((e) => e.quem === "robo").golpeId).toBe("g");
    expect(r.robo.folego).toBe(robo.folego - 3);
  });
});