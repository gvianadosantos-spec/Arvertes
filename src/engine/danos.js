import { relacaoElemento } from "./elementos.js";
import { valorEfetivo } from "./efeitos.js";
import regras from "../../data/regras.json" with { type: "json" };

const multiplicadorRelacao = {
  superior: regras.dano.multiplicadorSuperior,
  neutro: regras.dano.multiplicadorNeutro,
  inferior: regras.dano.multiplicadorInferior,
};

export function calcularDanoNormal(atacante, golpe, defensor) {
  return Math.max(Math.floor(valorEfetivo(atacante, "ataque") * golpe.ataqueGolpe - valorEfetivo(defensor, "defesa")), 1);
}

function danoElementalSemPiso(atacante, golpe, defensor) {
  const forca = valorEfetivo(atacante, "ataqueElemento") * atacante.afinidade * golpe.afinidadeGolpe;
  const relacao = relacaoElemento(golpe.elemento, defensor.elemento);
  const forcaAjustada = forca * multiplicadorRelacao[relacao];
  return Math.floor(forcaAjustada - valorEfetivo(defensor, "defesaElemento"));
}

export function calcularDanoElemental(atacante, golpe, defensor) {
  return Math.max(danoElementalSemPiso(atacante, golpe, defensor), regras.dano.pisoElementalPuro);
}

export function calcularDanoHibrido(atacante, golpe, defensor) {
  const danoFisico = calcularDanoNormal(atacante, golpe, defensor);
  const danoElemental = Math.max(danoElementalSemPiso(atacante, golpe, defensor), 0);
  return danoFisico + danoElemental;
}