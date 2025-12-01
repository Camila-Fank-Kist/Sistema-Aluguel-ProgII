const model = require("../models");

// Função para obter todos os inquilinos
const obterTodosInquilinos = async () => {
  return await model.Inquilino.findAll();
};

// Função para criar um novo inquilino
const criarInquilino = async (inquilino) => {
  await model.Inquilino.create(inquilino);
  return inquilino;
};

module.exports = { obterTodosInquilinos, criarInquilino };
