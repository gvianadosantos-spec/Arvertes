
export function sortearEntre(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

export function createArverte(nome, random, ehJogador = false, modificadorAtributos = 1) {
  const aplicar = (valor) => Math.floor(valor * modificadorAtributos);

  return {
    nome,
    ehJogador,
    vida: aplicar(sortearEntre(random, 20, 50)),
    ataque: aplicar(sortearEntre(random, 5, 20)),
    defesa: aplicar(sortearEntre(random, 1, 20)),
    ataqueElemento: aplicar(sortearEntre(random, 1, 20)),
    defesaElemento: aplicar(sortearEntre(random, 1, 20)),
    velocidade: aplicar(sortearEntre(random, 1, 20)),
    folego: aplicar(sortearEntre(random, 20, 30)),
    resistencia: aplicar(sortearEntre(random, 200, 300)),
  };
}