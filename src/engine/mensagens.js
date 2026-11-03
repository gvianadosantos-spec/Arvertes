export function textoEvento(evento, ctx, modelo) {
  const preencher = (texto, valores) =>
    texto.replace(/\{(\w+)\}/g, (_, chave) => String(valores[chave] ?? ""));

  if (typeof modelo[evento.acao] === "string") {
    return preencher(modelo[evento.acao], ctx);
  }

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