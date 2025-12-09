const model = require("../models");

// Função para obter todas as associações locador-permissão
const obterTodosLocadoresPermissoes = async () => {
  return await model.LocadorPermissao.findAll({
    include: [
      {
        model: model.Locador,
      },
      {
        model: model.Permissao,
        as: "Permissao",
      },
    ],
  });
};

// Função para obter permissões por cpf do locador
const obterPermissoesPorLocador = async (cpf) => {
  return await model.LocadorPermissao.findAll({
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

// Função para obter locadores por ID da permissão
const obterLocadoresPorPermissao = async (id_permissao) => {
  return await model.LocadorPermissao.findAll({
    where: {
      id_permissao: id_permissao,
    },
    include: [
      {
        model: model.Locador,
      },
    ],
  });
};

// Função para criar uma nova associação locador-permissão
const criarLocadorPermissao = async (locadorPermissao) => {
  await model.LocadorPermissao.create(locadorPermissao);
  return locadorPermissao;
};

// Função para deletar uma associação locador-permissão
const deletarLocadorPermissao = async (locadorPermissao) => {
  try {
    await model.LocadorPermissao.destroy({
      where: {
        cpf: locadorPermissao.cpf,
        id_permissao: locadorPermissao.id_permissao,
      },
    });

    return locadorPermissao;
  } catch (error) {
    throw error;
  }
};

// Função para verificar se um locador tem uma permissão específica
const verificarPermissaoLocador = async (cpf, id_permissao) => {
  const associacao = await model.LocadorPermissao.findOne({
    where: {
      cpf: cpf,
      id_permissao: id_permissao,
    },
  });

  return associacao !== null;
};

module.exports = {
  obterTodosLocadoresPermissoes,
  obterPermissoesPorLocador,
  obterLocadoresPorPermissao,
  deletarLocadorPermissao,
  criarLocadorPermissao,
  verificarPermissaoLocador,
};
