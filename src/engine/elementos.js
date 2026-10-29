import tabela from "../../data/elementos.json" with { type: "json" };

const vantagens = tabela.vantagens;
export function relacaoElemento(atacante, defensor) {
  if (vantagens.some(([superior, inferior]) => superior === atacante && inferior === defensor)) {
    return 'superior';
  }
  if (vantagens.some(([superior, inferior]) => superior === defensor && inferior === atacante)) {
    return 'inferior';
  }
  return 'neutro';
}