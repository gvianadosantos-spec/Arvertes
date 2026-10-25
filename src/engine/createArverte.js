// src/engine/createArverte.js

// Sorteia um inteiro entre min e max, inclusive, usando o random injetado
function sortearEntre(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

export function createArverte(nome, random, ehJogador = false) {
  return {
    nome,
    ehJogador,
    vida: sortearEntre(random, 20, 50),
    ataque: sortearEntre(random, 5, 20),
    defesa: sortearEntre(random, 1, 20),
    ataqueElemento: sortearEntre(random, 1, 20),
    defesaElemento: sortearEntre(random, 1, 20),
    velocidade: sortearEntre(random, 1, 20),
    folego: sortearEntre(random, 20, 30),
    resistencia: sortearEntre(random, 200, 300),
  };
}