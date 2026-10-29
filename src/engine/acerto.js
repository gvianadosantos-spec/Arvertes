import { sortearEntre } from "./createArverte.js";
import regras from "../../data/regras.json" with { type: "json" };

export function golpeAcerta(golpe, random) {
  const sorteio = sortearEntre(random, regras.acerto.sorteioMinimo, regras.acerto.sorteioMaximo);
  return golpe.chanceAcerto >= sorteio;
}