import { describe, it, expect } from 'vitest';

import { createArverte } from '../src/engine/createArverte.js';
import { GetTurnOrder, calcularDano, executarRodada, vencedor,executarBatalha  } from '../src/engine/battle.js';


function criarGeradorFixo(valores) {
  let i = 0;
  return () => valores[i++];
}

describe('ordem de turno', () => {
  it('a criatura com maior velocidade age primeiro', () => {
    const arverte1 = { nome: 'player', ehJogador: true, velocidade: 11 };
    const arverte2 = { nome: 'robo', ehJogador: false, velocidade: 10 };

    const resultado = GetTurnOrder([arverte2, arverte1]);

    expect(resultado).toEqual([arverte1, arverte2]);
  });

  it('não altera a lista original', () => {
    const arverte1 = { nome: 'player', ehJogador: true, velocidade: 11 };
    const arverte2 = { nome: 'robo', ehJogador: false, velocidade: 10 };
    const lista = [arverte2, arverte1];

    GetTurnOrder(lista);

    expect(lista).toEqual([arverte2, arverte1]);
  });

  it('em empate de velocidade, o jogador age primeiro', () => {
    const robo = { nome: 'robo', ehJogador: false, velocidade: 10 };
    const jogador = { nome: 'player', ehJogador: true, velocidade: 10 };

    const resultado = GetTurnOrder([robo, jogador]);

    expect(resultado).toEqual([jogador, robo]);
  });
});

describe('calcularDano', () => {
  it('dano nunca é menor que 1', () => {
    const atacante = { ataque: 3 };
    const defensor = { defesa: 10 };

    expect(calcularDano(atacante, defensor)).toBe(1);
  });

  it('dano é ataque menos defesa, quando maior que 1', () => {
    const atacante = { ataque: 15 };
    const defensor = { defesa: 5 };

    expect(calcularDano(atacante, defensor)).toBe(10);
  });
});

describe('executarRodada', () => {
  it('o primeiro ataca o segundo, e o segundo revida', () => {
    const jogador = { nome: 'player', ehJogador: true, velocidade: 11, ataque: 10, defesa: 2, vida: 30, resistencia: 200 };
    const robo = { nome: 'robo', ehJogador: false, velocidade: 10, ataque: 8, defesa: 3, vida: 25, resistencia: 200 };

    const resultado = executarRodada([robo, jogador]);

    expect(resultado).toEqual([
      { ...robo, vida: 18, resistencia: 199 },
      { ...jogador, vida: 24, resistencia: 199 },
    ]);
  });
    it('quem zera a vida do outro não revida na mesma rodada', () => {
    const jogador = { nome: 'player', ehJogador: true, velocidade: 11, ataque: 20, defesa: 2, vida: 30, resistencia: 200 };
    const robo = { nome: 'robo', ehJogador: false, velocidade: 10, ataque: 8, defesa: 3, vida: 15, resistencia: 200 };

    const resultado = executarRodada([robo, jogador]);

    // jogador causa 20 - 3 = 17 de dano; robô tem 15 de vida -> zera
    // robô não revida, então jogador continua com 30 de vida
    expect(resultado).toEqual([
      { ...robo, vida: 0, resistencia: 199 },
      { ...jogador, vida: 30, resistencia: 199 },
    ]);
  });
});

describe('vencedor', () => {
  it('devolve a criatura que ainda está de pé', () => {
    const jogador = { nome: 'player', ehJogador: true, vida: 30, resistencia: 199 };
    const robo = { nome: 'robo', ehJogador: false, vida: 0, resistencia: 199 };

    const resultado = vencedor([robo, jogador]);

    expect(resultado).toEqual(jogador);
  });

  it('devolve a criatura com resistência, quando a vida ainda está cheia', () => {
    const jogador = { nome: 'player', ehJogador: true, vida: 30, resistencia: 0 };
    const robo = { nome: 'robo', ehJogador: false, vida: 25, resistencia: 150 };

    const resultado = vencedor([robo, jogador]);

    expect(resultado).toEqual(robo);
  });
  it('se ninguém sobra, o robô vence (jogador perde no empate)', () => {
  const jogador = { nome: 'player', ehJogador: true, vida: 0, resistencia: 0 };
  const robo = { nome: 'robo', ehJogador: false, vida: 0, resistencia: 0 };

  expect(vencedor([jogador, robo])).toEqual(robo);
});

it('se as duas continuam de pé, ainda não há vencedor', () => {
  const jogador = { nome: 'player', ehJogador: true, vida: 10, resistencia: 100 };
  const robo = { nome: 'robo', ehJogador: false, vida: 10, resistencia: 100 };

  expect(vencedor([jogador, robo])).toBeNull();
});
});

describe('executarBatalha', () => {
  it('repete rodadas até sair um vencedor', () => {
    const jogador = { nome: 'player', ehJogador: true, velocidade: 11, ataque: 10, defesa: 2, vida: 30, resistencia: 200 };
    const robo = { nome: 'robo', ehJogador: false, velocidade: 10, ataque: 8, defesa: 3, vida: 25, resistencia: 200 };

    const resultado = executarBatalha([robo, jogador]);

    expect(resultado).toEqual(expect.objectContaining({ nome: 'player', vida: 12 }));
  });
});

describe('determinismo', () => {
  it('a mesma semente gera as mesmas criaturas e a mesma batalha', () => {
    const sementeA = criarGeradorFixo([0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4, 0.6]);
    const sementeB = criarGeradorFixo([0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.8, 0.4, 0.6]);

    const a = createArverte('player', sementeA, true);
    const b = createArverte('player', sementeB, true);

    expect(a).toEqual(b);
  });
  it('com random em 0, cada atributo sai no mínimo do seu intervalo', () => {
    const zero = criarGeradorFixo([0, 0, 0, 0, 0, 0, 0, 0]);
    const criatura = createArverte('player', zero, true);

    expect(criatura).toEqual({
      nome: 'player',
      ehJogador: true,
      vida: 20,
      ataque: 5,
      defesa: 1,
      ataqueElemento: 1,
      defesaElemento: 1,
      velocidade: 1,
      folego: 20,
      resistencia: 200,
    });
  });
  it('com random perto de 1, cada atributo sai no máximo do seu intervalo', () => {
    const quase1 = criarGeradorFixo([0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999]);
    const criatura = createArverte('player', quase1, true);

    expect(criatura).toEqual({
      nome: 'player',
      ehJogador: true,
      vida: 50,
      ataque: 20,
      defesa: 20,
      ataqueElemento: 20,
      defesaElemento: 20,
      velocidade: 20,
      folego: 30,
      resistencia: 300,
    });
  });
   it('modificador 0,5 reduz os atributos pela metade', () => {
    const maximo = criarGeradorFixo([0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999, 0.9999]);
    const fraco = createArverte('fraco', maximo, false, { vida: 0.5, resistencia: 0.5 });

    expect(fraco.vida).toBe(25);
    expect(fraco.resistencia).toBe(150);
});
});