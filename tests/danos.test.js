import { describe, it, expect } from 'vitest';
import { calcularDanoNormal, calcularDanoElemental, calcularDanoHibrido } from '../src/engine/danos.js';

describe('dano normal', () => {
  it('ataque vezes multiplicador do golpe, menos defesa do alvo', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 1 };
    const defensor = { defesa: 10 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(15);
  });

  it('multiplicador menor que 1 reduz o ataque antes da defesa', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 0.8 };
    const defensor = { defesa: 10 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(10);
  });

  it('dano nunca é menor que 1', () => {
    const atacante = { ataque: 5 };
    const golpe = { tipo: 'normal', ataqueGolpe: 1 };
    const defensor = { defesa: 20 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(1);
  });

  it('o resultado é arredondado para baixo', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 0.85 };
    const defensor = { defesa: 10 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(11);
  });

  it('multiplicador 0 ainda causa dano mínimo de 1', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 0 };
    const defensor = { defesa: 10 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(1);
  });

  it('ataque igual à defesa causa dano mínimo de 1', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 1 };
    const defensor = { defesa: 25 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(1);
  });

  it('multiplicador alto com defesa alta ainda aplica a subtração', () => {
    const atacante = { ataque: 20 };
    const golpe = { tipo: 'normal', ataqueGolpe: 1.5 };
    const defensor = { defesa: 12 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(18);
  });

  it('ignora a afinidade do golpe, que não se aplica ao normal', () => {
    const atacante = { ataque: 25 };
    const golpe = { tipo: 'normal', ataqueGolpe: 1, afinidadeGolpe: 0 };
    const defensor = { defesa: 10 };

    expect(calcularDanoNormal(atacante, golpe, defensor)).toBe(15);
  });
});
describe('dano elemental', () => {
  it('relação superior multiplica a força por 1,5 antes da defesa', () => {
    const atacante = { ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'elemental', elemento: 'Agua', afinidadeGolpe: 1 };
    const defensor = { elemento: 'Fogo', defesaElemento: 10 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(20);
  });

  it('relação neutra não altera a força', () => {
    const atacante = { ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'elemental', elemento: 'Fogo', afinidadeGolpe: 1 };
    const defensor = { elemento: 'Raio', defesaElemento: 10 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(10);
  });

  it('relação inferior reduz a força pela metade', () => {
    const atacante = { ataqueElemento: 40, afinidade: 1 };
    const golpe = { tipo: 'elemental', elemento: 'Agua', afinidadeGolpe: 1 };
    const defensor = { elemento: 'Gelo', defesaElemento: 10 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(10);
  });

  it('dano mínimo de 1', () => {
    const atacante = { ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'elemental', elemento: 'Fogo', afinidadeGolpe: 1 };
    const defensor = { elemento: 'Raio', defesaElemento: 30 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(1);
  });

  it('afinidade da espécie reduz a força elemental', () => {
    const atacante = { ataqueElemento: 20, afinidade: 0.5 };
    const golpe = { tipo: 'elemental', elemento: 'Fogo', afinidadeGolpe: 1 };
    const defensor = { elemento: 'Raio', defesaElemento: 5 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(5);
  });

  it('afinidade do golpe reduz a força elemental', () => {
    const atacante = { ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'elemental', elemento: 'Fogo', afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Raio', defesaElemento: 5 };

    expect(calcularDanoElemental(atacante, golpe, defensor)).toBe(5);
  });
});

describe('dano híbrido', () => {
  it('soma a parte física com a parte elemental', () => {
    const atacante = { ataque: 25, ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'hibrido', elemento: 'Fogo', ataqueGolpe: 1, afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Raio', defesa: 10, defesaElemento: 5 };

    expect(calcularDanoHibrido(atacante, golpe, defensor)).toBe(20);
  });

  it('se a parte elemental der zero, o golpe causa só o dano físico', () => {
    const atacante = { ataque: 25, ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'hibrido', elemento: 'Fogo', ataqueGolpe: 1, afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Raio', defesa: 10, defesaElemento: 10 };

    expect(calcularDanoHibrido(atacante, golpe, defensor)).toBe(15);
  });

  it('se a parte elemental der negativo, ela não reduz o dano físico', () => {
    const atacante = { ataque: 25, ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'hibrido', elemento: 'Fogo', ataqueGolpe: 1, afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Raio', defesa: 10, defesaElemento: 30 };

    expect(calcularDanoHibrido(atacante, golpe, defensor)).toBe(15);
  });

  it('a parte física tem piso de 1, e a elemental continua somando', () => {
    const atacante = { ataque: 5, ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'hibrido', elemento: 'Fogo', ataqueGolpe: 1, afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Raio', defesa: 20, defesaElemento: 1 };

    expect(calcularDanoHibrido(atacante, golpe, defensor)).toBe(10);
  });

  it('relação superior também vale para a parte elemental', () => {
    const atacante = { ataque: 25, ataqueElemento: 20, afinidade: 1 };
    const golpe = { tipo: 'hibrido', elemento: 'Agua', ataqueGolpe: 1, afinidadeGolpe: 0.5 };
    const defensor = { elemento: 'Fogo', defesa: 10, defesaElemento: 5 };

    expect(calcularDanoHibrido(atacante, golpe, defensor)).toBe(25);
  });
});