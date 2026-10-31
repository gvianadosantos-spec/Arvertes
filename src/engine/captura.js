import { sortearEntre } from "./createArverte.js";

const BASE_PISO = 0.1;
const TETO = 90;

export function chanceCaptura(base, criatura) {
  const perdaPercentual = 100 - (criatura.vida / criatura.vidaMaxima) * 100;
  const chance = base + perdaPercentual;
  return Math.min(Math.max(chance, BASE_PISO), TETO);
}

export function tentarCaptura(base, criatura, random, grupoCheio) {
  if (grupoCheio) return false;
  const sorteio = random() * 100;
  return sorteio < chanceCaptura(base, criatura);
}