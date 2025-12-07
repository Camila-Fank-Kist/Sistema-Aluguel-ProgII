const model = require("../models");

// Função para obter todas as associações inquilino-permissão
const obterTodosInquilinosPermissoes = async () => {
  return await model.InquilinoPermissao.findAll({
    include: [
      {
        model: model.Inquilino,
      },
      {
        model: model.Permissao,
        as: "Permissao",
      },
    ],
  });
};

// Função para obter permissões por cpf do inquilino
const obterPermissoesPorInquilino = async (cpf) => {
  return await model.InquilinoPermissao.findAll({
    where: {
      cpf: cpf,
    },
    include: [
      {
        model: model.Permissao,
        as: "Permissao",
      },
    ],
  });
};

// Função para obter inquilinos por ID da permissão
const obterInquilinosPorPermissao = async (id_permissao) => {
  return await model.InquilinoPermissao.findAll({
    where: {
      id_permissao: id_permissao,
    },
    include: [
      {
        model: model.Inquilino,
      },
    ],
  });
};

// Função para criar uma nova associação inquilino-permissão
const criarInquilinoPermissao = async (inquilinoPermissao) => {
  await model.InquilinoPermissao.create(inquilinoPermissao);
  return inquilinoPermissao;
};

// Função para deletar uma associação inquilino-permissão
const deletarInquilinoPermissao = async (inquilinoPermissao) => {
  try {
    await model.InquilinoPermissao.destroy({
      where: {
        cpf: inquilinoPermissao.cpf,
        id_permissao: inquilinoPermissao.id_permissao,
      },
    });

    return inquilinoPermissao;
  } catch (error) {
    throw error;
  }
};

// Função para verificar se um inquilino tem uma permissão específica
const verificarPermissaoInquilino = async (cpf, id_permissao) => {
  const associacao = await model.InquilinoPermissao.findOne({
    where: {
      cpf: cpf,
      id_permissao: id_permissao,
    },
  });

  return associacao !== null;
};

module.exports = {
  obterTodosInquilinosPermissoes,
  obterPermissoesPorInquilino,
  obterInquilinosPorPermissao,
  criarInquilinoPermissao,
  deletarInquilinoPermissao,
  verificarPermissaoInquilino,
};
