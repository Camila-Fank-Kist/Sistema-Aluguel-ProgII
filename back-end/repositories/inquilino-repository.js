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

<<<<<<< HEAD
module.exports = {
  obterTodosInquilinos,
  obterInquilinoPorCpf,
  criarInquilino,
=======
module.exports = { 
  obterTodosInquilinos, 
  obterInquilinoPorCpf,
  criarInquilino 
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
};
