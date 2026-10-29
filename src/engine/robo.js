import { sortearEntre } from "./createArverte.js";
import { calcularDanoNormal, calcularDanoElemental, calcularDanoHibrido } from "./danos.js";
import regras from "../../data/regras.json" with { type: "json" };

const danoDoGolpe = {
  normal: calcularDanoNormal,
  elemental: calcularDanoElemental,
  hibrido: calcularDanoHibrido,
};

const { golpeAleatorio, golpeMaiorDano } = regras.robo.selvagem;

function maiorDano(robo, golpes, jogador) {
  return golpes.reduce((melhor, g) =>
    danoDoGolpe[g.tipo](robo, g, jogador) > danoDoGolpe[melhor.tipo](robo, melhor, jogador) ? g : melhor
  );
}

export function escolherAcaoRobo(robo, jogador, golpes, random) {
  const sorteio = sortearEntre(random, 1, 100);
  if (sorteio > golpeAleatorio + golpeMaiorDano) {
    return "fugir";
  }

  const disponiveis = golpes.filter((g) => robo.folego >= g.custoFolego);
  if (disponiveis.length === 0) {
    return "basico";
  }

  if (sorteio <= golpeAleatorio) {
    return disponiveis[sortearEntre(random, 0, disponiveis.length - 1)];
  }

  return maiorDano(robo, disponiveis, jogador);
}