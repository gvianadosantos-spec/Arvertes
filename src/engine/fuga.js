import { sortearEntre } from "./createArverte.js";
import regras from "../../data/regras.json" with { type: "json" };

export function chanceFuga(velocidadeJogador, velocidadeAdversario) {
  const razao = velocidadeJogador / velocidadeAdversario;
  const chance = (razao / (razao + 1)) * 100;
  return Math.min(Math.max(chance, regras.fuga.pisoChance), regras.fuga.tetoChance);
}

export function tentarFuga(chance, random) {
  const sorteio = sortearEntre(random, regras.acerto.sorteioMinimo, regras.acerto.sorteioMaximo);
  return sorteio <= chance;
}