const model = require("../models");

// Função para obter todos os imóveis
const obterTodosImoveis = async () => {
  return await model.Imovel.findAll();
};

// Função para obter imóvel por ID
const obterImovelPorId = async (imovel) => {
  return await model.Imovel.findByPk(imovel.id);
};

// Função para obter imóvel por CPF
const obterImovelPorCPF = async (imovel) => {
  return await model.Imovel.findAll({
    where: { locador_cpf: imovel.locador_cpf },
  });
};

// Função para criar um novo imóvel
const criarImovel = async (imovel) => {
  await model.Imovel.create(imovel);
  return imovel;
};

// Função para atualizar um imóvel
const atualizarImovel = async (imovel) => {
  try {
    // Atualizar o imóvel
    await model.Imovel.update(imovel, { where: { id: imovel.id } });

    // Retornar o imóvel atualizado
    return await model.Imovel.findByPk(imovel.id);
  } catch (error) {
    throw error;
  }
};

// Função para deletar um imóvel
const deletarImovel = async (imovel) => {
  try {
    //adicionado para tentar remover um imóvel que exite e caso ele não exista, retornar a mensagem de que ele não existe
    const removendoImovel = await model.Imovel.destroy({
      where: { id: imovel.id },
    });

    if (removendoImovel === 0) {
      return null; //nenhum imóvel deletado
    }
    return imovel;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obterTodosImoveis,
  obterImovelPorId,
  obterImovelPorCPF,
  criarImovel,
  atualizarImovel,
  deletarImovel,
};
