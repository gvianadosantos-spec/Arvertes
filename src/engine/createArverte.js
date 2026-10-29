import atributos from "../../data/atributos.json" with { type: "json" };

export function sortearEntre(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

export function createArverte(
  nome,
  random,
  ehJogador = false,
  modificadorAtributos = {},
  tabela = atributos.atributos,
) {
  
  const sortear = (atributo) => {
    const { min, max } = tabela[atributo].base;
    const fator = modificadorAtributos[atributo] ?? 1;
    return Math.floor(sortearEntre(random, min, max) * fator);
  };

  return {
    nome,
    ehJogador,
    vida: sortear("vida"),
    ataque: sortear("ataque"),
    defesa: sortear("defesa"),
    ataqueElemento: sortear("ataqueElemento"),
    defesaElemento: sortear("defesaElemento"),
    velocidade: sortear("velocidade"),
    folego: sortear("folego"),
    resistencia: sortear("resistencia"),
  };
}