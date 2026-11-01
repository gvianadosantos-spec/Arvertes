import { calcularDano } from "./battle.js";
import { calcularDanoNormal, calcularDanoElemental, calcularDanoHibrido } from "./danos.js";
import { golpeAcerta } from "./acerto.js";
import { escolherAcao, gastarFolego } from "./folego.js";
import { desgastarResistencia, estaNocauteado } from "./resistencia.js";
import { relacaoElemento } from "./elementos.js";
import { chanceFuga, tentarFuga } from "./fuga.js";
import { escolherAcaoRobo } from "./robo.js";
import { usarPocao } from "./pocoes.js";
import { aplicarEfeito, passarTurno } from "./efeitos.js";
import { tentarCaptura } from "./captura.js";

const danoDoGolpe = {
  normal: calcularDanoNormal,
  elemental: calcularDanoElemental,
  hibrido: calcularDanoHibrido,
};

const aplicarDano = (alvo, dano) => ({ ...alvo, vida: Math.max(alvo.vida - dano, 0) });

const caiu = (criatura) => criatura.vida === 0 || estaNocauteado(criatura);

const expirar = (criatura) => (criatura.efeitos ? passarTurno(criatura) : criatura);

const registro = (quem, acao, extra = {}) => ({
  quem, acao, golpeId: null, acertou: false, dano: 0, relacao: null, ...extra,
});

const incluirParticipante = (lista, criatura) =>
  (lista.includes(criatura.nome) ? lista : [...lista, criatura.nome]);

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

function usarItem(quem, outro, estado, item) {
  if (item.tipo === "pocao") {
    return { ...estado, [quem]: usarPocao(estado[quem], item) };
  }
  if (item.tipo === "buff") {
    return { ...estado, [quem]: aplicarEfeito(estado[quem], item) };
  }
  return { ...estado, [outro]: aplicarEfeito(estado[outro], item) };
}

export function executarTurno({
  jogador, robo, acaoJogador, acaoRobo, golpesRobo = [], grupoCheio = false, participantes = null, random,
}) {
  const acoes = { jogador: acaoJogador, robo: acaoRobo ?? escolherAcaoRobo(robo, jogador, golpesRobo, random) };
  const ordem = jogador.velocidade >= robo.velocidade ? ["jogador", "robo"] : ["robo", "jogador"];
  let estado = { jogador, robo };
  const eventos = [];
  let fadigaDelta = 0;
  let parts = participantes ?? [jogador.nome];

  const encerrar = (extra) => ({ ...estado, eventos, fadigaDelta, participantes: parts, ...extra });

  for (const quem of ordem) {
    const outro = quem === "jogador" ? "robo" : "jogador";
    const acao = acoes[quem];

    if (acao && typeof acao === "object" && acao.tipo === "trocar") {
      estado = { ...estado, [quem]: acao.criatura };
      parts = incluirParticipante(parts, acao.criatura);
      eventos.push(registro(quem, "troca"));
      continue;
    }

    if (acao && typeof acao === "object" && acao.tipo === "item") {
      estado = usarItem(quem, outro, estado, acao.item);
      eventos.push(registro(quem, "item"));
      continue;
    }

    if (acao && typeof acao === "object" && acao.tipo === "captura") {
      const alvo = estado[outro];
      if (!alvo.selvagem) {
        fadigaDelta += 15;
        eventos.push(registro(quem, "captura_recusada"));
        continue;
      }
      if (tentarCaptura(acao.base, alvo, random, grupoCheio)) {
        eventos.push(registro(quem, "captura"));
        return encerrar({ fadigaDelta: fadigaDelta + 5, resultado: "captura", capturada: alvo });
      }
      fadigaDelta += 15;
      eventos.push(registro(quem, "captura_falhou"));
      continue;
    }

    if (acao === "fugir") {
      const chance = chanceFuga(estado[quem].velocidade, estado[outro].velocidade);
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
      return encerrar({ resultado: quem });
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
    resultado,
  };
}