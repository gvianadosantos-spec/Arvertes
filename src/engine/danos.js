import { relacaoElemento } from './elementos.js';

const multiplicadorRelacao = {
  superior: 1.5,
  neutro: 1,
  inferior: 0.5,
};

export function calcularDanoNormal(atacante, golpe, defensor) {
  return Math.max(Math.floor(atacante.ataque * golpe.ataqueGolpe - defensor.defesa), 1);
}

// Sem piso: pode dar zero ou negativo. O híbrido usa isso e trata valores abaixo de zero como zero.
function danoElementalSemPiso(atacante, golpe, defensor) {
  const forca = atacante.ataqueElemento * atacante.afinidade * golpe.afinidadeGolpe;
  const relacao = relacaoElemento(golpe.elemento, defensor.elemento);
  const forcaAjustada = forca * multiplicadorRelacao[relacao];
  return Math.floor(forcaAjustada - defensor.defesaElemento);
}

export function calcularDanoElemental(atacante, golpe, defensor) {
  return Math.max(danoElementalSemPiso(atacante, golpe, defensor), 1);
}

export function calcularDanoHibrido(atacante, golpe, defensor) {
  const danoFisico = calcularDanoNormal(atacante, golpe, defensor);
  const danoElemental = Math.max(danoElementalSemPiso(atacante, golpe, defensor), 0);
  return danoFisico + danoElemental;
}