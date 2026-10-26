import { sortearEntre } from './createArverte.js';

export function golpeAcerta(golpe, random) {
  const sorteio = sortearEntre(random, 1, 100);
  return golpe.chanceAcerto >= sorteio;
}