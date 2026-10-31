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

function itemDisponivel(inventario, random) {
  const disponiveis = inventario.itens;
  if (disponiveis.length === 0) return null;
  return disponiveis[sortearEntre(random, 0, disponiveis.length - 1)];
}

export function escolherAcaoRoboTreinador(robo, jogador, golpes, inventario, random) {
  const sorteio = sortearEntre(random, 1, 100);
  const disponiveis = golpes.filter((g) => robo.folego >= g.custoFolego);

  if (disponiveis.length === 0) {
    return { tipo: "basico" };
  }

  if (sorteio <= golpeAleatorio) {
    return { tipo: "golpe", golpe: disponiveis[sortearEntre(random, 0, disponiveis.length - 1)] };
  }

  if (sorteio <= golpeAleatorio + golpeMaiorDano) {
    return { tipo: "golpe", golpe: maiorDano(robo, disponiveis, jogador) };
  }

  const item = itemDisponivel(inventario, random);
  if (item === null) {
    return { tipo: "golpe", golpe: maiorDano(robo, disponiveis, jogador) };
  }
  return { tipo: "item", item };
}