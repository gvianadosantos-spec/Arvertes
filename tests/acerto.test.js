import { describe, it, expect } from 'vitest';
import { golpeAcerta } from '../src/engine/acerto.js';

describe('acerto', () => {
  it('acerta quando o sorteio é igual à chance (limite)', () => {
    const golpe = { chanceAcerto: 90 };
    const random = () => 0.895; // sorteio 90

    expect(golpeAcerta(golpe, random)).toBe(true);
  });

  it('erra quando o sorteio passa da chance', () => {
    const golpe = { chanceAcerto: 90 };
    const random = () => 0.905; // sorteio 91

    expect(golpeAcerta(golpe, random)).toBe(false);
  });

  it('chance 100 sempre acerta, inclusive no maior sorteio', () => {
    const golpe = { chanceAcerto: 100 };
    const random = () => 0.995; // sorteio 100

    expect(golpeAcerta(golpe, random)).toBe(true);
  });

  it('chance baixa acerta no menor sorteio possível', () => {
    const golpe = { chanceAcerto: 33 };
    const random = () => 0.005; // sorteio 1

    expect(golpeAcerta(golpe, random)).toBe(true);
  });

  it('chance baixa erra logo acima do limite', () => {
    const golpe = { chanceAcerto: 33 };
    const random = () => 0.335; // sorteio 34

    expect(golpeAcerta(golpe, random)).toBe(false);
  });
});