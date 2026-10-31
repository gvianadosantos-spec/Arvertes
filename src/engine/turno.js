import { calcularDano } from "./battle.js";
import { calcularDanoNormal, calcularDanoElemental, calcularDanoHibrido } from "./danos.js";
import { golpeAcerta } from "./acerto.js";
import { escolherAcao, gastarFolego } from "./folego.js";
import { desgastarResistencia } from "./resistencia.js";
import { relacaoElemento } from "./elementos.js";
import { chanceFuga, tentarFuga } from "./fuga.js";
import { escolherAcaoRobo } from "./robo.js";

const danoDoGolpe = {
  normal: calcularDanoNormal,
  elemental: calcularDanoElemental,
  hibrido: calcularDanoHibrido,
};

const aplicarDano = (alvo, dano) => ({ ...alvo, vida: Math.max(alvo.vida - dano, 0) });

function agir(quem, atacante, defensor, acao, random) {
  const escolhido = acao === "basico" ? "basico" : escolherAcao(atacante, acao);

  if (escolhido === "basico") {
    const dano = calcularDano(atacante, defensor);
    return {
      atacante: desgastarResistencia(atacante),
      defensor: aplicarDano(defensor, dano),
      evento: { quem, acao: "basico", golpeId: null, acertou: true, dano, relacao: null },
    };
  }

  const atacanteDesgastado = desgastarResistencia(gastarFolego(atacante, escolhido));
  const relacao = escolhido.tipo === "normal" ? null : relacaoElemento(escolhido.elemento, defensor.elemento);

  if (!golpeAcerta(escolhido, random)) {
    return {
      atacante: atacanteDesgastado,
      defensor,
      evento: { quem, acao: "golpe", golpeId: escolhido.id, acertou: false, dano: 0, relacao },
    };
  }

  const dano = danoDoGolpe[escolhido.tipo](atacante, escolhido, defensor);
  return {
    atacante: atacanteDesgastado,
    defensor: aplicarDano(defensor, dano),
    evento: { quem, acao: "golpe", golpeId: escolhido.id, acertou: true, dano, relacao },
  };
}

export function executarTurno({ jogador, robo, acaoJogador, acaoRobo, golpesRobo = [], random }) {
  const acoes = { jogador: acaoJogador, robo: acaoRobo ?? escolherAcaoRobo(robo, jogador, golpesRobo, random) };
  const ordem = jogador.velocidade >= robo.velocidade ? ["jogador", "robo"] : ["robo", "jogador"];
  let estado = { jogador, robo };
  const eventos = [];

  for (const quem of ordem) {
    const outro = quem === "jogador" ? "robo" : "jogador";
    const acao = acoes[quem];

  if (acao === "fugir") {
  const chance = chanceFuga(estado[quem].velocidade, estado[outro].velocidade);
  if (tentarFuga(chance, random)) {
    eventos.push({ quem, acao: "fuga", golpeId: null, acertou: false, dano: 0, relacao: null });
    return { ...estado, eventos, resultado: "fuga" };
  }
  eventos.push({ quem, acao: "fuga_falhou", golpeId: null, acertou: false, dano: 0, relacao: null });
  continue;
}

    const r = agir(quem, estado[quem], estado[outro], acao, random);
    estado = { ...estado, [quem]: r.atacante, [outro]: r.defensor };
    eventos.push(r.evento);

    if (estado[outro].vida === 0) {
      return { ...estado, eventos, resultado: quem };
    }
  }

  return { ...estado, eventos, resultado: null };
}