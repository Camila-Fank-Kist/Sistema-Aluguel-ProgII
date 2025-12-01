const model = require("../models");

// Função para obter todos os locadores
const obterTodosLocadores = async () => {
  return await model.Locador.findAll();
};

// Função para criar um novo locador
const criarLocador = async (locador) => {
  await model.Locador.create(locador);
  return locador;
};

module.exports = { obterTodosLocadores, criarLocador };
