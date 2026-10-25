import { describe, it, expect } from 'vitest';
import  GetTurnOrder  from '../src/engine/battle.js';

describe('ordem de turno', () => {
 it('a criatura com maior speed age primeiro', () => {
  const arverte1 = { name: 'player', speed: 10 };
  const arverte2 = { name: 'robo', speed: 5 };

  const resultado = GetTurnOrder([arverte2, arverte1]); 

  expect(resultado).toEqual([arverte1, arverte2]);
})
})
