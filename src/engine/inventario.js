import itens from "../../data/itens.json" with { type: "json" };

export function gerarTiposItens() {
  const tipos = [];
  for (const atributo of itens.atributos) {
    for (const tipo of ["buff", "debuff"]) {
      for (const nivel of itens.niveis) {
        for (const tamanho of Object.keys(itens.tamanhos)) {
          tipos.push({
            id: `${tipo}_${atributo}_${nivel}_${tamanho}`,
            tipo,
            atributo,
            nivel,
            tamanho,
            multiplicador: itens[tipo][nivel],
            duracaoTurnos: itens.tamanhos[tamanho].duracaoTurnos,
          });
        }
      }
    }
  }
  for (const atributo of itens.pocoes.atributos) {
    for (const nivel of itens.niveis) {
      tipos.push({
        id: `pocao_${atributo}_${nivel}`,
        tipo: "pocao",
        atributo,
        nivel,
        recuperacaoPercentual: itens.pocoes.recuperacaoPercentual[nivel],
      });
    }
  }
  return tipos;
}

export function criarInventario(tipos, quantidadeInicial) {
  return { itens: tipos.map((t) => ({ ...t, quantidade: quantidadeInicial })) };
}

export function totalUnidades(inventario) {
  return inventario.itens.reduce((soma, i) => soma + i.quantidade, 0);
}

export function usarItem(inventario, id) {
  const item = inventario.itens.find((i) => i.id === id);
  if (!item || item.quantidade <= 0) {
    throw new Error("item indisponível");
  }
  const itens = inventario.itens
    .map((i) => (i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i))
    .filter((i) => i.quantidade > 0);
  return { ...inventario, itens };
}