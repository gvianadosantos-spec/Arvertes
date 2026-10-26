import { describe, it, expect } from 'vitest';
import { relacaoElemento } from '../src/engine/elementos.js';

describe('elemento', () => {
  it('Água é superior contra Fogo, e Fogo é inferior contra Água', () => {
    expect(relacaoElemento('Agua', 'Fogo')).toBe('superior');
    expect(relacaoElemento('Fogo', 'Agua')).toBe('inferior');
  });

  it('Água é superior contra Terra, e Terra é inferior contra Água', () => {
    expect(relacaoElemento('Agua', 'Terra')).toBe('superior');
    expect(relacaoElemento('Terra', 'Agua')).toBe('inferior');
  });

  it('Água é inferior contra Gelo, e Gelo é superior contra Água', () => {
    expect(relacaoElemento('Agua', 'Gelo')).toBe('inferior');
    expect(relacaoElemento('Gelo', 'Agua')).toBe('superior');
  });

  it('Água é inferior contra Raio, e Raio é superior contra Água', () => {
    expect(relacaoElemento('Agua', 'Raio')).toBe('inferior');
    expect(relacaoElemento('Raio', 'Agua')).toBe('superior');
  });

  it('Fogo é superior contra Gelo, e Gelo é inferior contra Fogo', () => {
    expect(relacaoElemento('Fogo', 'Gelo')).toBe('superior');
    expect(relacaoElemento('Gelo', 'Fogo')).toBe('inferior');
  });

  it('Gelo é superior contra Ar, e Ar é inferior contra Gelo', () => {
    expect(relacaoElemento('Gelo', 'Ar')).toBe('superior');
    expect(relacaoElemento('Ar', 'Gelo')).toBe('inferior');
  });

  it('Raio é superior contra Ar, e Ar é inferior contra Raio', () => {
    expect(relacaoElemento('Raio', 'Ar')).toBe('superior');
    expect(relacaoElemento('Ar', 'Raio')).toBe('inferior');
  });

  it('Raio é inferior contra Terra, e Terra é superior contra Raio', () => {
    expect(relacaoElemento('Raio', 'Terra')).toBe('inferior');
    expect(relacaoElemento('Terra', 'Raio')).toBe('superior');
  });

  it('Terra e Ar são superiores entre si', () => {
    expect(relacaoElemento('Terra', 'Ar')).toBe('superior');
    expect(relacaoElemento('Ar', 'Terra')).toBe('superior');
  });

  it('Luz e Sombra são superiores entre si', () => {
    expect(relacaoElemento('Luz', 'Sombra')).toBe('superior');
    expect(relacaoElemento('Sombra', 'Luz')).toBe('superior');
  });

  it('pares sem relação são neutros', () => {
    expect(relacaoElemento('Fogo', 'Raio')).toBe('neutro');
    expect(relacaoElemento('Raio', 'Fogo')).toBe('neutro');
  });

  it('Físico é neutro contra todos', () => {
    expect(relacaoElemento('Fisico', 'Agua')).toBe('neutro');
    expect(relacaoElemento('Agua', 'Fisico')).toBe('neutro');
    expect(relacaoElemento('Fisico', 'Luz')).toBe('neutro');
  });
});