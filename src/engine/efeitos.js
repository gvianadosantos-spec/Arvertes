export function aplicarEfeito(criatura, item) {
  const mesmoTipo = criatura.efeitos.some(
    (e) => e.tipo === item.tipo && e.atributo === item.atributo,
  );
  if (mesmoTipo) {
    return criatura;
  }
  const novo = {
    id: item.id,
    tipo: item.tipo,
    atributo: item.atributo,
    multiplicador: item.multiplicador,
    turnosRestantes: item.duracaoTurnos,
  };
  return { ...criatura, efeitos: [...criatura.efeitos, novo] };
}

export function fatorAtributo(criatura, atributo) {
  return criatura.efeitos
    .filter((e) => e.atributo === atributo)
    .reduce((fator, e) => fator * e.multiplicador, 1);
}

export function passarTurno(criatura) {
  const efeitos = criatura.efeitos
    .map((e) => ({ ...e, turnosRestantes: e.turnosRestantes - 1 }))
    .filter((e) => e.turnosRestantes > 0);
  return { ...criatura, efeitos };
}

export function valorEfetivo(criatura, atributo) {
  const base = criatura[atributo];
  if (!criatura.efeitos) return base;
  return base * fatorAtributo(criatura, atributo);
}