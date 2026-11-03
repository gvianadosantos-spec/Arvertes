import regras from "../../data/regras.json" with { type: "json" };

const LIMITE = 5;

export function criarGrupo(criaturas) {
  if (criaturas.length > LIMITE) {
    throw new Error("grupo acima do limite de 5 criaturas");
  }
  return { criaturas: [...criaturas], ativa: 0 };
}

export function adicionarCriatura(grupo, criatura) {
  if (grupo.criaturas.length >= LIMITE) {
    throw new Error("grupo cheio: limite de 5 criaturas");
  }
  return { ...grupo, criaturas: [...grupo.criaturas, criatura] };
}

export function criaturaAtiva(grupo) {
  return grupo.criaturas[grupo.ativa];
}

export function aplicarResultadoBatalha(grupo, criaturaBatalhada) {
  const criaturas = grupo.criaturas.map((c, i) => (i === grupo.ativa ? criaturaBatalhada : c));
  return { ...grupo, criaturas };
}

export function recuperarFolegoGrupo(grupo, resultado) {
  if (resultado !== "jogador") return grupo;
  const criaturas = grupo.criaturas.map((c, i) => {
    if (i !== grupo.ativa) return c;
    const folego = Math.min(c.folego + regras.folego.recuperacaoVitoria, c.folegoMaximo);
    return { ...c, folego };
  });
  return { ...grupo, criaturas };
}

export function trocarAtiva(grupo, indice) {
  if (indice === grupo.ativa) {
    throw new Error("criatura já está ativa");
  }
  const alvo = grupo.criaturas[indice];
  if (!alvo || alvo.vida <= 0 || alvo.resistencia <= 0) {
    throw new Error("criatura nocauteada ou inexistente");
  }
  return { ...grupo, ativa: indice, entrouNaRodada: true };
}

export function podeAgir(grupo) {
  return !grupo.entrouNaRodada;
}

export function fimDaRodada(grupo) {
  return { ...grupo, entrouNaRodada: false };
}