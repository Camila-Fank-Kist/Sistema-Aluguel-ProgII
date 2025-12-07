const model = require("../models");

// Função para obter todos os inquilinos
const obterTodosInquilinos = async () => {
  return await model.Inquilino.findAll();
};

// Função para obter inquilino por CPF
const obterInquilinoPorCpf = async (cpf) => {
  return await model.Inquilino.findByPk(cpf);
};

// Função para criar um novo inquilino
const criarInquilino = async (inquilino) => {
  await model.Inquilino.create(inquilino);
  return inquilino;
};

module.exports = {
  obterTodosInquilinos,
  obterInquilinoPorCpf,
  criarInquilino,
};
