export function usarPocao(criatura, pocao) {
  const maximo = pocao.atributo === "vida" ? criatura.vidaMaxima : criatura.folegoMaximo;
  const recuperado = Math.floor((maximo * pocao.recuperacaoPercentual) / 100);
  const novo = Math.min(criatura[pocao.atributo] + recuperado, maximo);
  return { ...criatura, [pocao.atributo]: novo };
}