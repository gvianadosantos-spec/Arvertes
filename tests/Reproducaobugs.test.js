import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarCriatura } from "../src/engine/createArverte.js"; 
import { aplicarEfeito } from "../src/engine/efeitos.js";
import { subirNivel } from "../src/engine/xp.js";
import { criarGrupo, criaturaAtiva, recuperarFolegoGrupo } from "../src/engine/grupo.js";
import { calcularDano } from "../src/engine/battle.js";
import { escolherAcaoRoboTreinador } from "../src/engine/roboTreinador.js";
import { gerarTiposItens, criarInventario } from "../src/engine/inventario.js";
import { usarPocao } from "../src/engine/pocoes.js";
import { criarOvo, chocarOvo } from "../src/engine/ovo.js";
import { criarComId } from "../src/engine/ids.js";
import { textoEvento } from "../src/engine/mensagens.js";
import especies from "../data/testes/especies.json" with { type: "json" };
import mensagens from "../data/mensagens.json" with { type: "json" };

const base = { ehJogador: false, elemento: "Fogo", afinidade: 1, vida: 30, vidaMaxima: 30, ataque: 10, defesa: 5, ataqueElemento: 10, defesaElemento: 5, velocidade: 10, folego: 20, folegoMaximo: 20, resistencia: 50, efeitos: [] };
const jogador = { ...base, nome: "Jogador", ehJogador: true, elemento: "Agua" };
const robo = { ...base, nome: "Robo" };
const golpe = { id: "g", tipo: "normal", ataqueGolpe: 2, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };
const c = () => criarCriatura({ nome: "X", elemento: "Fogo", afinidade: 1, numero: 1, modificadorAtributos: {} }, () => 0.5, false);

describe("reprodução: turno", () => {
  it("criatura nocauteada não age", () => {
    const r = executarTurno({ jogador: { ...jogador, resistencia: 0 }, robo: { ...robo, vida: 1, velocidade: 5 }, acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(r.eventos.some((e) => e.quem === "jogador")).toBe(false);
    expect(r.resultado).toBe("robo");
  });

  it("troca para criatura nocauteada é recusada", () => {
    const reserva = { ...jogador, nome: "Reserva", vida: 0 };
    const r = executarTurno({ jogador, robo, acaoJogador: { tipo: "trocar", criatura: reserva }, acaoRobo: "basico", random: () => 0 });
    expect(r.jogador.nome).toBe("Jogador");
  });

  it("robô com treinador executa o golpe escolhido e gasta o fôlego", () => {
    const r = executarTurno({ jogador, robo: { ...robo, velocidade: 1 }, acaoJogador: "basico", acaoRobo: { tipo: "golpe", golpe }, random: () => 0 });
    expect(r.robo.folego).toBe(17);
  });

  it("resistência zerada por fuga malsucedida termina a batalha", () => {
    const r = executarTurno({ jogador: { ...jogador, resistencia: 1 }, robo, acaoJogador: "fugir", acaoRobo: "basico", random: () => 0.99 });
    expect(r.jogador.resistencia).toBe(0);
    expect(r.resultado).toBe("robo");
  });

  it("buff de velocidade muda a ordem do turno", () => {
    const j = { ...jogador, efeitos: [{ id: "b", tipo: "buff", atributo: "velocidade", multiplicador: 1.25, turnosRestantes: 3 }] };
    const r = executarTurno({ jogador: j, robo: { ...robo, velocidade: 12 }, acaoJogador: "basico", acaoRobo: "basico", random: () => 0 });
    expect(r.eventos[0].quem).toBe("jogador");
  });

  it("participantes distinguem criaturas com o mesmo nome", () => {
    const ativa = { ...jogador, id: "0111" };
    const reserva = { ...jogador, id: "0112", vida: 25 };
    const r = executarTurno({ jogador: ativa, robo, grupo: [ativa, reserva], acaoJogador: { tipo: "trocar", criatura: reserva }, acaoRobo: "basico", random: () => 0 });
    expect(r.participantes).toEqual(["0111", "0112"]);
  });
});

describe("reprodução: criatura e progressão", () => {
  it("criatura criada tem máximos, efeitos, nível, xp e vínculo", () => {
    const a = c();
    expect(a).toMatchObject({ vidaMaxima: a.vida, efeitos: [], nivel: 1, xp: 0, vinculo: 1 });
  });

  it("buff funciona em criatura criada por createArverte", () => {
    expect(() => aplicarEfeito(c(), { id: "b", tipo: "buff", atributo: "ataque", multiplicador: 1.1, duracaoTurnos: 3 })).not.toThrow();
  });

  it("poção não produz NaN em criatura criada", () => {
    const d = usarPocao({ ...c(), vida: 10 }, { atributo: "vida", recuperacaoPercentual: 60 });
    expect(Number.isNaN(d.vida)).toBe(false);
  });

  it("sem xp não sobe de nível", () => {
    const semXp = { ...c(), nivel: 1, vinculo: 1 };
    delete semXp.xp;
    expect(subirNivel(semXp, () => 0).nivel).toBe(1);
  });

  it("não passa do teto de vínculo (vínculo 1 = nível 50)", () => {
    expect(subirNivel({ ...c(), nivel: 50, xp: 1e12, vinculo: 1 }, () => 0).nivel).toBe(50);
  });

  it("vitória devolve fôlego quando o resultado vem do turno ('jogador')", () => {
    const g = criarGrupo([{ ...c(), folego: 9, folegoMaximo: 20 }]);
    expect(criaturaAtiva(recuperarFolegoGrupo(g, "jogador")).folego).toBe(10);
  });

  it("dano básico com buff é inteiro", () => {
    const atacante = { ...c(), ataque: 10, efeitos: [{ id: "b", tipo: "buff", atributo: "ataque", multiplicador: 1.15, turnosRestantes: 3 }] };
    const defensor = { ...c(), defesa: 5, efeitos: [] };
    expect(Number.isInteger(calcularDano(atacante, defensor))).toBe(true);
  });
});

describe("reprodução: nascimento, ids, robô e mensagens", () => {
  it("ovo chocado guarda o número da espécie", () => {
    const bebe = chocarOvo(criarOvo(especies[0], () => 0.5), () => 0.5);
    expect(bebe.numero).toBe(1);
  });

   it("criatura gerada por criarComId tem atributos de combate", () => {
    expect(typeof criarComId(criarCriatura(especies[0], () => 0.5), {}).criatura.vida).toBe("number");
  });;

  it("robô com treinador sem fôlego usa item no sorteio de 81 a 100", () => {
    const inventario = criarInventario(gerarTiposItens(), 3);
    const acao = escolherAcaoRoboTreinador({ ...robo, folego: 0 }, jogador, [golpe], inventario, () => 0.9);
    expect(acao.tipo).toBe("item");
  });

  it("evento de troca não vira mensagem de golpe", () => {
    const evento = { quem: "jogador", acao: "troca", golpeId: null, acertou: false, dano: 0, relacao: null };
    expect(textoEvento(evento, { nome: "Reserva", golpe: "" }, mensagens)).not.toContain("mas errou");
  });
});