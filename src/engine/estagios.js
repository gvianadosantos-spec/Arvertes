import atributos from "../../data/atributos.json" with { type: "json" };

export function estagioAtual(criatura) {
  const candidatos = atributos.estagios.filter((e) => {
    if (e.id === "ovo") return false;
    if (e.viaDeificacao && !criatura.eDeificavel) return false;
    return criatura.nivel >= e.nivelMinimo && criatura.diasVida >= e.diasMinimos;
  });
  return candidatos.at(-1).id;
}