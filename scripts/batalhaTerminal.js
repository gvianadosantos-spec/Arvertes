import { executarTurno } from "../src/engine/turno.js";
import { createArverte } from "../src/engine/createArverte.js";
import { estaNocauteado } from "../src/engine/resistencia.js";
import { textoEvento } from "../src/engine/mensagens.js";
import { escolherAcao } from "../src/engine/folego.js";
import golpes from "../data/testes/golpes.json" with { type: "json" };
import mensagens from "../data/mensagens.json" with { type: "json" };

const aleatorio = Math.random;
const escolher = (lista) => lista[Math.floor(aleatorio() * lista.length)];
const nomeDoGolpe = (id) => golpes.find((g) => g.id === id)?.nome ?? id;

const preparar = (nome, elemento) => {
  const base = createArverte(nome, aleatorio, nome === "Jogador");
  return { ...base, elemento, afinidade: 1, folegoMaximo: base.folego };
};

let jogador = preparar("Jogador", "Agua");
let robo = preparar("Robo", "Fogo");

console.log(`Batalha: ${jogador.nome} (vida ${jogador.vida}, fôlego ${jogador.folego}, resistência ${jogador.resistencia}) x ${robo.nome} (vida ${robo.vida}, fôlego ${robo.folego}, resistência ${robo.resistencia})`);

let rodada = 0;
let resultado = null;

while (resultado === null && rodada < 200) {
  rodada++;
   const golpeEscolhido = escolher(golpes);
  const tentaFugir = aleatorio() < 0.05;
  console.log(`\n--- Rodada ${rodada} ---`);
  if (tentaFugir) {
    console.log("Jogador escolhe: fugir");
  } else {
    const usado = escolherAcao(jogador, golpeEscolhido);
    const aviso = usado === "basico" ? " (sem fôlego, usa básico)" : "";
    console.log(`Jogador escolhe: ${golpeEscolhido.id} "${golpeEscolhido.nome}" (${golpeEscolhido.tipo}, custo ${golpeEscolhido.custoFolego})${aviso}`);
  }
  const r = executarTurno({ jogador, robo, acaoJogador: tentaFugir ? "fugir" : golpeEscolhido, golpesRobo: golpes, random: aleatorio });
  jogador = r.jogador;
  robo = r.robo;
  resultado = r.resultado;

  for (const e of r.eventos) {
    const nome = e.quem === "jogador" ? jogador.nome : robo.nome;
    const usado = e.golpeId ? nomeDoGolpe(e.golpeId) : "";
    const golpeLog = e.golpeId ? ` golpe=${e.golpeId} "${usado}"` : "";
    console.log(`  [${e.quem}] ação=${e.acao}${golpeLog} acertou=${e.acertou} dano=${e.dano} relacao=${e.relacao ?? "-"}`);
    console.log(`  → ${textoEvento(e, { nome, golpe: usado }, mensagens)}`);
  }

  console.log(`  Vida: ${jogador.nome} ${jogador.vida} | ${robo.nome} ${robo.vida}`);
  console.log(`  Fôlego: ${jogador.nome} ${jogador.folego} | ${robo.nome} ${robo.folego}`);
  console.log(`  Resistência: ${jogador.nome} ${jogador.resistencia} | ${robo.nome} ${robo.resistencia}`);

  if (resultado === null) {
    if (estaNocauteado(jogador)) resultado = "robo";
    else if (estaNocauteado(robo)) resultado = "jogador";
  }
}

console.log(`\nResultado: ${resultado ?? "sem fim (limite de 200 rodadas)"}`);