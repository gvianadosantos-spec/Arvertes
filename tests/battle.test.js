import { describe, it, expect } from 'vitest';
import { getTurnOrder } from '../src/engine/battle.js';

describe('ordem de turno', () => {
 it('a criatura com maior speed age primeiro', () => {
  const arverte1 = { name: 'player', speed: 10 };
  const arverte2 = { name: 'robo', speed: 5 };

  const resultado = getTurnOrder([arverte2, arverte1]); // entrada com arverte2 primeiro, de propósito

  expect(resultado).toEqual([arverte1, arverte2]); // a lista na ordem certa
})
})
