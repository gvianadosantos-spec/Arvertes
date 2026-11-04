import { describe, it, expect } from "vitest";
import { executarTurnoComTreinador } from "../src/engine/turno.js";
import { criarTreinador, capturarCriatura } from "../src/engine/treinador.js";
import { criarCriatura } from "../src/engine/createArverte.js";

const especie = { id: "teste_fogo_1", nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const meio = () => 0.5;
const zero = () => 0;

const selvagem = (over = {}) => ({ ...criarCriatura({ ...especie, nome: "Selvagem" }, meio), velocidade: 1, selvagem: true, nivel: 40, ...over });

const treinadorCom = (n) => {
  let t = criarTreinador({ nome: "Zé", dataNascimento: "0202" });
  for (let i = 0; i < n; i++) t = capturarCriatura(t, { ...criarCriatura(especie, meio), id: `0${i}11` });
  return t;
};

describe("captura derivada do treinador", () => {
  it("captura em grupo cheio é recusada sem o chamador passar grupoCheio", () => {
    const t = treinadorCom(5);
    const jogador = criarCriatura(especie, meio, true);
    const r = executarTurnoComTreinador({ treinador: t, jogador, robo: selvagem(), acaoJogador: { tipo: "captura", base: 100 }, acaoRobo: "basico", random: zero });
    expect(r.resultado).toBeNull();
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("captura_falhou");
  });

  it("captura de criatura acima do teto (vínculo 1 = 50) falha sem o chamador passar tetoNivel", () => {
    const t = treinadorCom(0);
    const jogador = criarCriatura(especie, meio, true);
    const r = executarTurnoComTreinador({ treinador: t, jogador, robo: selvagem({ nivel: 60 }), acaoJogador: { tipo: "captura", base: 100 }, acaoRobo: "basico", random: zero });
    expect(r.resultado).toBeNull();
  });

  it("captura dentro do teto e com grupo livre funciona", () => {
    const t = treinadorCom(0);
    const jogador = criarCriatura(especie, meio, true);
    const r = executarTurnoComTreinador({ treinador: t, jogador, robo: selvagem({ nivel: 40 }), acaoJogador: { tipo: "captura", base: 100 }, acaoRobo: "basico", random: zero });
    expect(r.resultado).toBe("captura");
  });
});