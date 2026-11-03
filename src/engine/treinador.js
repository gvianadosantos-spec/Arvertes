import { criarGrupo, adicionarCriatura } from "./grupo.js";
import { criarComId } from "./ids.js";
import { subirNivel, recompensaBatalha } from "./xp.js";

const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function nomeValido(nome) {
  return typeof nome === "string" && nome.length >= 1 && nome.length <= 16;
}

function dataValida(dataNascimento) {
  if (typeof dataNascimento !== "string" || !/^\d{4}$/.test(dataNascimento)) return false;
  const dia = Number(dataNascimento.slice(0, 2));
  const mes = Number(dataNascimento.slice(2, 4));
  return mes >= 1 && mes <= 12 && dia >= 1 && dia <= diasPorMes[mes - 1];
}

export function criarTreinador({ nome, dataNascimento }) {
  if (!nomeValido(nome)) throw new Error("nome deve ter de 1 a 16 caracteres");
  if (!dataValida(dataNascimento)) throw new Error("data de nascimento invalida");
  return { nome, dataNascimento, registroIds: {}, grupo: criarGrupo([]) };
}

export function registrarCriatura(treinador, especie) {
  const { criatura, registro } = criarComId(especie, treinador.registroIds);
  return {
    ...treinador,
    registroIds: registro,
    grupo: adicionarCriatura(treinador.grupo, criatura),
  };
}

export function capturarCriatura(treinador, criatura) {
  const { criatura: comId, registro } = criarComId(criatura, treinador.registroIds);
  return {
    ...treinador,
    registroIds: registro,
    grupo: adicionarCriatura(treinador.grupo, { ...comId, selvagem: false }),
  };
}

export function aplicarXpBatalha(treinador, recompensas, random) {
  const criaturas = treinador.grupo.criaturas.map((c) => {
    if (!(c.id in recompensas)) return c;
    return subirNivel({ ...c, xp: c.xp + recompensas[c.id] }, random);
  });
  return { ...treinador, grupo: { ...treinador.grupo, criaturas } };
}

export function aplicarFimBatalha(treinador, turno, random) {
  const recompensas = recompensaBatalha(turno.resultado, turno.robo.nivel, turno.jogador.id, turno.participantes);
  return aplicarXpBatalha(treinador, recompensas, random);
}