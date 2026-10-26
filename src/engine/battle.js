export function GetTurnOrder(creatures) { // Função que recebe uma lista de criaturas e retorna a lista ordenada pela velocidade (speed) em ordem decrescente  
    return [...creatures].sort((a, b) => {
        if (b.velocidade !== a.velocidade) {
             return b.velocidade - a.velocidade;
         }
         if (a.ehJogador) {
             return -1;
         }
         if (b.ehJogador) {
             return 1;
         }
         return 0;
     });
}

export function calcularDano(atacante, defensor) {
  return Math.max(atacante.ataque - defensor.defesa, 1);
}

export function executarRodada(criaturas) {
  const [primeiro, segundo] = GetTurnOrder(criaturas);

  const novoPrimeiro = { ...primeiro };
  const novoSegundo = { ...segundo };

  if (novoPrimeiro.vida > 0 && novoPrimeiro.resistencia > 0) {
    novoSegundo.vida = Math.max(novoSegundo.vida - calcularDano(novoPrimeiro, novoSegundo), 0);
  }
  if (novoSegundo.vida > 0 && novoSegundo.resistencia > 0) {
    novoPrimeiro.vida = Math.max(novoPrimeiro.vida - calcularDano(novoSegundo, novoPrimeiro), 0);
  }

  novoPrimeiro.resistencia = Math.max(novoPrimeiro.resistencia - 1, 0);
  novoSegundo.resistencia = Math.max(novoSegundo.resistencia - 1, 0);

  return criaturas.map(c => (c === primeiro ? novoPrimeiro : novoSegundo));
}

export function vencedor(criaturas) {
  const vivos = criaturas.filter(c => c.vida > 0 && c.resistencia > 0);

  if (vivos.length === 1) {
    return vivos[0];
  }
  if (vivos.length === 0) {
    return criaturas.find(c => !c.ehJogador);
  }
  return null;
}

export function executarBatalha(criaturas) {
  let estado = criaturas;
  let vitoria = vencedor(estado);

  while (vitoria === null) {
    estado = executarRodada(estado);
    vitoria = vencedor(estado);
  }
  return vitoria;
}

