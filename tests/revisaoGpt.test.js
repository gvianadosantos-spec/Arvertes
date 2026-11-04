import { describe, it, expect } from "vitest";
import { executarTurno } from "../src/engine/turno.js";
import { criarCriatura } from "../src/engine/createArverte.js";
import { criarTreinador, aplicarFimBatalha } from "../src/engine/treinador.js";
import { gerarTiposItens, criarInventario } from "../src/engine/inventario.js";
import { escolherAcaoRoboTreinador } from "../src/engine/roboTreinador.js";
import { criarGrupo, criaturaAtiva } from "../src/engine/grupo.js";

const especie = { id: "teste_fogo_1", nome: "Fogo 1", numero: 1, elemento: "Fogo", afinidade: 1, modificadorAtributos: {} };
const meio = () => 0.5;

const criar = (over = {}) => ({ ...criarCriatura(especie, meio, false), vida: 30, vidaMaxima: 30, velocidade: 10, ...over });

describe("B3: item sem inventário é recusado", () => {
  it("usar poção sem inventário é recusado e não cura", () => {
    const pocao = { id: "pocao_vida_normal", tipo: "pocao", atributo: "vida", recuperacaoPercentual: 60 };
    const r = executarTurno({ jogador: criar({ vida: 10, ehJogador: true }), robo: criar({ velocidade: 1 }), acaoJogador: { tipo: "item", item: pocao }, acaoRobo: "fugir", random: meio });
    expect(r.eventos.find((e) => e.quem === "jogador").acao).toBe("item_recusado");
    expect(r.jogador.vida).toBe(10);
  });
});

describe("B4: inventários separados por treinador", () => {
  it("usar item do robô não consome o estoque do jogador", () => {
    const invJogador = criarInventario(gerarTiposItens(), 1);
    const invRobo = criarInventario(gerarTiposItens(), 1);
    const pocao = invRobo.itens.find((i) => i.id === "pocao_vida_normal");
    const r = executarTurno({
      jogador: criar({ ehJogador: true }), robo: criar({ deTreinador: true, velocidade: 1 }),
      acaoJogador: "basico", acaoRobo: { tipo: "item", item: pocao },
      inventario: invJogador, inventarioRobo: invRobo, random: meio,
    });
    expect(r.inventario.itens.find((i) => i.id === "pocao_vida_normal").quantidade).toBe(1);
  });
});

describe("B5: captura exige teto e grupo explícitos", () => {
  it("sem teto informado, captura de criatura de nível alto é recusada", () => {
    const r = executarTurno({ jogador: criar({ ehJogador: true }), robo: criar({ selvagem: true, nivel: 60, velocidade: 1 }), acaoJogador: { tipo: "captura", base: 100 }, acaoRobo: "basico", grupoCheio: false, random: () => 0 });
    expect(r.resultado).toBeNull();
  });

  it("com grupo cheio, captura falha mesmo com sorteio favorável", () => {
    const r = executarTurno({ jogador: criar({ ehJogador: true }), robo: criar({ selvagem: true, nivel: 1, velocidade: 1 }), acaoJogador: { tipo: "captura", base: 100 }, acaoRobo: "basico", tetoNivel: 50, grupoCheio: true, random: () => 0 });
    expect(r.resultado).toBeNull();
  });
});

describe("B6: o efeito vem do item armazenado", () => {
  it("item falso com id de poção não aplica buff e a poção real cura", () => {
    const inv = criarInventario(gerarTiposItens(), 1);
    const falso = { id: "pocao_vida_normal", tipo: "buff", atributo: "ataque", multiplicador: 100 };
    const r = executarTurno({ jogador: criar({ vida: 10, ehJogador: true }), robo: criar({ velocidade: 1 }), acaoJogador: { tipo: "item", item: falso }, acaoRobo: "fugir", inventario: inv, random: meio });
    expect(r.jogador.efeitos).toHaveLength(0);
    expect(r.jogador.vida).toBe(28);
  });
});

describe("B7: IA não escolhe item com quantidade zero", () => {
  it("inventário só com itens de quantidade zero cai no golpe", () => {
    const inv = { itens: [{ ...gerarTiposItens()[0], quantidade: 0 }] };
    const golpe = { id: "g", tipo: "normal", ataqueGolpe: 1, afinidadeGolpe: 1, chanceAcerto: 100, custoFolego: 3 };
    const acao = escolherAcaoRoboTreinador(criar({ folego: 20, deTreinador: true }), criar(), [golpe], inv, () => 0.9);
    expect(acao.tipo).toBe("golpe");
  });
});

describe("B8: criatura acima do teto não ganha XP", () => {
  it("XP não é acumulado quando o nível passa do teto", () => {
    const c = { ...criarCriatura(especie, meio), id: "0111", nivel: 51, xp: 0, vinculo: 1 };
    const t = { ...criarTreinador({ nome: "Zé", dataNascimento: "0202" }), grupo: criarGrupo([c]) };
    const depois = aplicarFimBatalha(t, { resultado: "jogador", robo: { nivel: 1 }, jogador: c, participantes: ["0111"] }, meio);
    expect(criaturaAtiva(depois.grupo).xp).toBe(0);
  });
});

describe("B9: efeitos expiram no encerramento por vida zero", () => {
  it("buff de 1 turno expira quando o jogador vence com golpe", () => {
    const buff = { id: "b", tipo: "buff", atributo: "ataque", multiplicador: 1.1, turnosRestantes: 1 };
    const r = executarTurno({ jogador: criar({ ehJogador: true, efeitos: [buff], ataque: 100 }), robo: criar({ vida: 1, velocidade: 1 }), acaoJogador: "basico", acaoRobo: "basico", random: meio });
    expect(r.resultado).toBe("jogador");
    expect(r.jogador.efeitos).toHaveLength(0);
  });
});

describe("B10: vida persiste no grupo ao fim da batalha", () => {
  it("a criatura do grupo fica com a vida final da batalha", () => {
    const c = { ...criarCriatura(especie, meio), id: "0111", vida: 30, vidaMaxima: 30, folego: 20, folegoMaximo: 20 };
    const t = { ...criarTreinador({ nome: "Zé", dataNascimento: "0202" }), grupo: criarGrupo([c]) };
    const turno = { resultado: "fuga", robo: { nivel: 1 }, jogador: { ...c, vida: 25 }, participantes: ["0111"] };
    expect(criaturaAtiva(aplicarFimBatalha(t, turno, meio).grupo).vida).toBe(25);
  });
});