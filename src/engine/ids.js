import elementos from "../../data/elementos.json" with { type: "json" };

export function numeroElemento(nome) {
  return elementos.elementos.indexOf(nome) + 1;
}

export function atribuirId(registro, especie, elemento) {
  const contador = (registro[especie] ?? 0) + 1;
  const id = `${String(especie).padStart(2, "0")}${numeroElemento(elemento)}${contador}`;
  return { id, registro: { ...registro, [especie]: contador } };
}
export function criarComId(especie, registro) {
  const { id, registro: novoRegistro } = atribuirId(registro, especie.numero, especie.elemento);
  return { criatura: { ...especie, id }, registro: novoRegistro };
}