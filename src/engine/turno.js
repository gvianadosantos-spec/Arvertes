import { calcularDano } from "./battle.js";
import { calcularDanoNormal, calcularDanoElemental, calcularDanoHibrido } from "./danos.js";
import { golpeAcerta } from "./acerto.js";
import { escolherAcao, gastarFolego } from "./folego.js";
import { desgastarResistencia, estaNocauteado } from "./resistencia.js";
import { relacaoElemento } from "./elementos.js";
import { chanceFuga, tentarFuga } from "./fuga.js";
import { escolherAcaoRobo } from "./robo.js";
import { escolherAcaoRoboTreinador } from "./roboTreinador.js";
import { usarPocao } from "./pocoes.js";
import { aplicarEfeito, passarTurno, valorEfetivo } from "./efeitos.js";
import { tentarCaptura } from "./captura.js";
import { usarItem as consumirItem } from "./inventario.js";

const danoDoGolpe = {
  normal: calcularDanoNormal,
  elemental: calcularDanoElemental,
  hibrido: calcularDanoHibrido,
};

const aplicarDano = (alvo, dano) => ({ ...alvo, vida: Math.max(alvo.vida - dano, 0) });

const caiu = (criatura) => criatura.vida === 0 || estaNocauteado(criatura);

const expirar = (criatura) => (criatura.efeitos ? passarTurno(criatura) : criatura);

const velocidadeDe = (criatura) => valorEfetivo(criatura, "velocidade");

const registro = (quem, acao, extra = {}) => ({
  quem, acao, golpeId: null, acertou: false, dano: 0, relacao: null, ...extra,
});

const identificador = (criatura) => criatura.id ?? criatura.nome;

const incluirParticipante = (lista, criatura) =>
  (lista.includes(identificador(criatura)) ? lista : [...lista, identificador(criatura)]);

const normalizarAcao = (acao) => {
  if (acao && typeof acao === "object" && acao.tipo === "golpe") return acao.golpe;
  if (acao && typeof acao === "object" && acao.tipo === "basico") return "basico";
  return acao;
};

const escolherAcaoDoRobo = (robo, jogador, golpes, inventario, random) =>
  (robo.deTreinador
    ? escolherAcaoRoboTreinador(robo, jogador, golpes, inventario, random)
    : escolherAcaoRobo(robo, jogador, golpes, random));

function agir(quem, atacante, defensor, acao, random) {
  const escolhido = acao === "basico" ? "basico" : escolherAcao(atacante, acao);

  if (escolhido === "basico") {
    const dano = calcularDano(atacante, defensor);
    return {
      atacante: desgastarResistencia(atacante),
      defensor: aplicarDano(defensor, dano),
      evento: registro(quem, "basico", { acertou: true, dano }),
    };
  }

  const atacanteDesgastado = desgastarResistencia(gastarFolego(atacante, escolhido));
  const relacao = escolhido.tipo === "normal" ? null : relacaoElemento(escolhido.elemento, defensor.elemento);

  if (!golpeAcerta(escolhido, random)) {
    return {
      atacante: atacanteDesgastado,
      defensor,
      evento: registro(quem, "golpe", { golpeId: escolhido.id, relacao }),
    };
  }

  const dano = danoDoGolpe[escolhido.tipo](atacante, escolhido, defensor);
  return {
    atacante: atacanteDesgastado,
    defensor: aplicarDano(defensor, dano),
    evento: registro(quem, "golpe", { golpeId: escolhido.id, acertou: true, dano, relacao }),
  };
}

function aplicarItem(quem, outro, estado, item) {
  if (item.tipo === "pocao") {
    return { ...estado, [quem]: usarPocao(estado[quem], item) };
  }
  if (item.tipo === "buff") {
    return { ...estado, [quem]: aplicarEfeito(estado[quem], item) };
  }
  return { ...estado, [outro]: aplicarEfeito(estado[outro], item) };
}

export function executarTurno({
  jogador, robo, acaoJogador, acaoRobo, golpesRobo = [], grupoCheio, participantes = null, grupo = [],
  inventario: inventarioInicial, inventarioRobo: inventarioRoboInicial, tetoNivel, random,
}) {
  const acoes = {
    jogador: acaoJogador,
    robo: normalizarAcao(acaoRobo ?? escolherAcaoDoRobo(robo, jogador, golpesRobo, inventarioRoboInicial ?? { itens: [] }, random)),
  };
  const ordem = velocidadeDe(jogador) >= velocidadeDe(robo) ? ["jogador", "robo"] : ["robo", "jogador"];
  let estado = { jogador, robo };
  let inventario = inventarioInicial;
  let invRobo = inventarioRoboInicial;
  let saiu = null;
  const eventos = [];
  let fadigaDelta = 0;
  let parts = participantes ?? [identificador(jogador)];

  const encerrar = (extra) => ({
    ...estado,
    jogador: expirar(estado.jogador),
    robo: expirar(estado.robo),
    eventos,
    fadigaDelta,
    participantes: parts,
    inventario,
    inventarioRobo: invRobo,
    saiu,
    ...extra,
  });

  for (const quem of ordem) {
    const outro = quem === "jogador" ? "robo" : "jogador";
    const acao = acoes[quem];

    if (caiu(estado[quem])) continue;

    if (acao && typeof acao === "object" && acao.tipo === "trocar") {
      const ehDoGrupo = grupo.some((c) => identificador(c) === identificador(acao.criatura));
      const ehAtiva = identificador(acao.criatura) === identificador(estado[quem]);
      if (caiu(acao.criatura) || ehAtiva || !ehDoGrupo) {
        eventos.push(registro(quem, "troca_recusada"));
        continue;
      }
      saiu = desgastarResistencia(estado[quem]);
      estado = { ...estado, [quem]: acao.criatura };
      parts = incluirParticipante(parts, acao.criatura);
      eventos.push(registro(quem, "troca"));
      continue;
    }

    if (acao && typeof acao === "object" && acao.tipo === "item") {
      const inv = quem === "jogador" ? inventario : invRobo;
      const armazenado = inv?.itens.find((i) => i.id === acao.item.id && i.quantidade > 0);
      if (!armazenado) {
        eventos.push(registro(quem, "item_recusado"));
        continue;
      }
      const novoInv = consumirItem(inv, armazenado.id);
      if (quem === "jogador") inventario = novoInv;
      else invRobo = novoInv;
      estado = { ...estado, [quem]: desgastarResistencia(estado[quem]) };
      estado = aplicarItem(quem, outro, estado, armazenado);
      eventos.push(registro(quem, "item"));
      continue;
    }

    if (acao && typeof acao === "object" && acao.tipo === "captura") {
      estado = { ...estado, [quem]: desgastarResistencia(estado[quem]) };
      const alvo = estado[outro];
      if (!alvo.selvagem) {
        fadigaDelta += 15;
        eventos.push(registro(quem, "captura_recusada"));
        continue;
      }
      const dentroDoTeto = tetoNivel !== undefined && alvo.nivel <= tetoNivel;
      if (grupoCheio !== false || !dentroDoTeto) {
        fadigaDelta += 15;
        eventos.push(registro(quem, "captura_falhou"));
        continue;
      }
      if (tentarCaptura(acao.base, alvo, random, false)) {
        eventos.push(registro(quem, "captura"));
        return encerrar({ fadigaDelta: fadigaDelta + 5, resultado: "captura", capturada: alvo });
      }
      fadigaDelta += 15;
      eventos.push(registro(quem, "captura_falhou"));
      continue;
    }

    if (acao === "fugir") {
      estado = { ...estado, [quem]: desgastarResistencia(estado[quem]) };
      const chance = chanceFuga(velocidadeDe(estado[quem]), velocidadeDe(estado[outro]));
      if (tentarFuga(chance, random)) {
        eventos.push(registro(quem, "fuga"));
        return encerrar({ resultado: "fuga" });
      }
      eventos.push(registro(quem, "fuga_falhou"));
      continue;
    }

    const r = agir(quem, estado[quem], estado[outro], acao, random);
    estado = { ...estado, [quem]: r.atacante, [outro]: r.defensor };
    eventos.push(r.evento);

    if (estado[outro].vida === 0) {
      const atacanteCaiu = caiu(estado[quem]);
      return encerrar({ resultado: atacanteCaiu ? "robo" : quem });
    }
  }

  let resultado = null;
  if (caiu(estado.jogador)) {
    resultado = "robo";
  } else if (caiu(estado.robo)) {
    resultado = "jogador";
  }
  return {
    ...estado,
    jogador: expirar(estado.jogador),
    robo: expirar(estado.robo),
    eventos,
    fadigaDelta,
    participantes: parts,
    inventario,
    inventarioRobo: invRobo,
    saiu,
    resultado,
  };
}

export function executarTurnoComTreinador({ treinador, jogador, robo, acaoJogador, acaoRobo, golpesRobo = [], participantes = null, inventario, inventarioRobo, random }) {
  const tetoNivel = treinador.grupo.criaturas.length === 0
    ? 50
    : treinador.grupo.criaturas[0].vinculo * 50;
  const grupoCheio = treinador.grupo.criaturas.length >= 5;
  return executarTurno({
    jogador, robo, acaoJogador, acaoRobo, golpesRobo, participantes,
    grupo: treinador.grupo.criaturas,
    grupoCheio, tetoNivel, inventario, inventarioRobo, random,
  });
}