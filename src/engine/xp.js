import atributos from "../../data/atributos.json" with { type: "json" };
import { sortearEntre } from "./createArverte.js";

const { curvaXp, xpPorVitoria, xpPorCaptura } = atributos.nivel;

export function xpGanho(acao, nivelInimigo) {
  if (acao === "vitoria") return nivelInimigo * xpPorVitoria;
  if (acao === "captura") return nivelInimigo * xpPorCaptura;
  return 0;
}

export function xpParaProximoNivel(nivel, vinculo) {
  return nivel * nivel * curvaXp.multiplicador * curvaXp.fatorPorVinculo ** (vinculo - 1);
}

export function subirNivel(criatura, random) {
  const teto = criatura.vinculo * atributos.vinculo.nivelPorVinculo;
  let atual = criatura;
  while (true) {
    const necessario = xpParaProximoNivel(atual.nivel, atual.vinculo);
    if (!(atual.xp >= necessario) || atual.nivel >= teto) {
      return atual;
    }
    const crescimento = {};
    for (const atributo of Object.keys(atributos.atributos)) {
      const { min, max } = atributos.atributos[atributo].porNivel;
      crescimento[atributo] = sortearEntre(random, min, max);
    }
    const proximo = {
      ...atual,
      nivel: atual.nivel + 1,
      xp: atual.xp - necessario,
      crescimento,
    };
    for (const atributo of Object.keys(crescimento)) {
      proximo[atributo] = atual[atributo] + crescimento[atributo];
    }
    atual = proximo;
  }
}

export function distribuirXp(total, ativa, participantes) {
  if (total <= 0) return {};
  const todos = [...new Set([ativa, ...participantes])];
  const fracaoAtiva = atributos.nivel.xpAtivaFracao;
  const parte = (total * (1 - fracaoAtiva)) / todos.length;
  const resultado = {};
  for (const p of todos) {
    resultado[p] = Math.max(Math.floor(parte), 1);
  }
  resultado[ativa] = Math.max(Math.floor(total * fracaoAtiva + parte), 1);
  return resultado;
}

export function recompensaBatalha(resultado, nivelInimigo, ativa, participantes) {
  if (resultado === "jogador") return distribuirXp(xpGanho("vitoria", nivelInimigo), ativa, participantes);
  if (resultado === "captura") return distribuirXp(xpGanho("captura", nivelInimigo), ativa, participantes);
  return {};
}