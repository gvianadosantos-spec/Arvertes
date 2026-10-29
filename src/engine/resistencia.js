
import regras from "../../data/regras.json" with { type: "json" };

export function desgastarResistencia(criatura) {
  const resistencia = Math.max(criatura.resistencia - regras.resistencia.desgastePorRodada, 0);
  return { ...criatura, resistencia };
}

export function estaNocauteado(criatura) {
  return criatura.resistencia <= 0;
}