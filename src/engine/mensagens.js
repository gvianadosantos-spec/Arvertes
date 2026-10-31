export function textoEvento(evento, ctx, modelo) {
  const preencher = (texto, valores) =>
    texto.replace(/\{(\w+)\}/g, (_, chave) => String(valores[chave] ?? ""));

  if (evento.acao === "fuga") return preencher(modelo.fuga, ctx);
  if (evento.acao === "fuga_falhou") return preencher(modelo.fuga_falhou, ctx);

  if (evento.acao === "basico") {
    return preencher(modelo.basico.acertou, { ...ctx, dano: evento.dano });
  }

  if (!evento.acertou) {
    return preencher(modelo.golpe.erro, ctx);
  }

  const frase = preencher(modelo.golpe.acertou, { ...ctx, dano: evento.dano });
  const complemento = evento.relacao ? modelo.relacao[evento.relacao] : "";
  return frase + complemento;
}