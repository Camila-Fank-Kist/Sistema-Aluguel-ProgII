const model = require("../models");

// Função para criar um novo imóvel
const criarCadastro = async (cadastro) => {
  await model.Imovel.create(imovel);
  return imovel;
};
