import regras from "../../data/regras.json" with { type: "json" };

export function gastarFolego(criatura, golpe) {
  return { ...criatura, folego: criatura.folego - golpe.custoFolego };
}

export function escolherAcao(criatura, golpe) {
  if (criatura.folego >= golpe.custoFolego) {
    return golpe;
  }
  return "basico";
}

export function recuperarFolegoVitoria(criatura) {
  const folego = Math.min(criatura.folego + regras.folego.recuperacaoVitoria, criatura.folegoMaximo);
  return { ...criatura, folego };
}