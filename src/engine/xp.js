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
  const necessario = xpParaProximoNivel(criatura.nivel, criatura.vinculo);
  if (criatura.xp < necessario) {
    return criatura;
  }
  const crescimento = {};
  for (const atributo of Object.keys(atributos.atributos)) {
    const { min, max } = atributos.atributos[atributo].porNivel;
    crescimento[atributo] = sortearEntre(random, min, max);
  }
  const atualizado = {
    ...criatura,
    nivel: criatura.nivel + 1,
    xp: criatura.xp - necessario,
    crescimento,
  };
  for (const atributo of Object.keys(crescimento)) {
    atualizado[atributo] = criatura[atributo] + crescimento[atributo];
  }
  return atualizado;
}