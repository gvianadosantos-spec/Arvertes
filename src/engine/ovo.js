import atributos from "../../data/atributos.json" with { type: "json" };

const { chanceTita, chanceDeificavel, multiplicadorTita, multiplicadorTitaDeificavel } = atributos.titaDeificacao;

const atributosCombate = ["vida", "ataque", "defesa", "ataqueElemento", "defesaElemento", "velocidade", "folego", "resistencia"];

const faixa = (intervalo, random) => intervalo.min + random() * (intervalo.max - intervalo.min);

export function criarOvo(especie, random) {
  const eTita = random() < chanceTita / 100;
  const eDeificavel = random() < chanceDeificavel / 100;
  let multiplicadorAltura = 1;
  let fatoresTita = {};
  if (eTita) {
    const intervalo = eDeificavel ? multiplicadorTitaDeificavel : multiplicadorTita;
    multiplicadorAltura = faixa(intervalo, random);
    fatoresTita = Object.fromEntries(atributosCombate.map((a) => [a, faixa(intervalo, random)]));
  }
  return {
    especie: especie.id,
    fisico: especie.fisico,
    diasParaChocar: especie.diasParaChocar,
    eTita,
    eDeificavel,
    multiplicadorAltura,
    fatoresTita,
    diasOvo: 0,
    altura: 0,
    peso: 0,
  };
}

export function crescerOvoUmDia(ovo, random) {
  const crescimentoDia = faixa(ovo.fisico.crescimentoOvoPorDia, random) * ovo.multiplicadorAltura;
  return {
    ...ovo,
    altura: ovo.altura + crescimentoDia,
    peso: ovo.peso + crescimentoDia * ovo.fisico.fatorPeso,
    diasOvo: ovo.diasOvo + 1,
  };
}

export function chocarOvo(ovo, random) {
  const fatorEclosao = faixa(ovo.fisico.fatorEclosao, random);
  return {
    especie: ovo.especie,
    fisico: ovo.fisico,
    eTita: ovo.eTita,
    eDeificavel: ovo.eDeificavel,
    multiplicadorAltura: ovo.multiplicadorAltura,
    fatoresTita: ovo.fatoresTita,
    altura: ovo.altura * fatorEclosao,
    peso: ovo.peso,
    diasVida: 0,
  };
}