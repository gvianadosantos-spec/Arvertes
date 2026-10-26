const vantagens = [
  ['Agua', 'Fogo'],
  ['Agua', 'Terra'],
  ['Fogo', 'Gelo'],
  ['Gelo', 'Agua'],
  ['Gelo', 'Ar'],
  ['Raio', 'Agua'],
  ['Raio', 'Ar'],
  ['Terra', 'Raio'],
  ['Terra', 'Ar'],
  ['Ar', 'Terra'],
  ['Luz', 'Sombra'],
  ['Sombra', 'Luz'],
];

export function relacaoElemento(atacante, defensor) {
  if (vantagens.some(([superior, inferior]) => superior === atacante && inferior === defensor)) {
    return 'superior';
  }
  if (vantagens.some(([superior, inferior]) => superior === defensor && inferior === atacante)) {
    return 'inferior';
  }
  return 'neutro';
}