const model = require("../models");

// Função para obter todas as associações usuário-permissão
const obterTodosUsuarioPermissoes = async () => {
  return await model.UsuarioPermissao.findAll({
    include: [
      {
        model: model.Locador,
      },
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

// Função para obter permissões por cpf do usuário
const obterPermissoesPorUsuario = async (cpf) => {
  return await model.UsuarioPermissao.findAll({
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

// Função para obter usuários por ID da permissão
const obterUsuariosPorPermissao = async (id_permissao) => {
  return await model.UsuarioPermissao.findAll({
    where: {
      id_permissao: id_permissao,
    },
    include: [
      {
        model: model.Locador,
      },
      {
        model: model.Inquilino,
      },
    ],
  });
};

// Função para criar uma nova associação usuário-permissão
const criarUsuarioPermissao = async (usuarioPermissao) => {
  await model.UsuarioPermissao.create(usuarioPermissao);
  return usuarioPermissao;
};

// Função para deletar uma associação usuário-permissão
const deletarUsuarioPermissao = async (usuarioPermissao) => {
  try {
    await model.UsuarioPermissao.destroy({
      where: {
        cpf: usuarioPermissao.cpf,
        id_permissao: usuarioPermissao.id_permissao,
      },
    });

    return usuarioPermissao;
  } catch (error) {
    throw error;
  }
};

// Função para verificar se um usuário tem uma permissão específica
const verificarPermissaoUsuario = async (cpf, id_permissao) => {
  const associacao = await model.UsuarioPermissao.findOne({
    where: {
      cpf: cpf,
      id_permissao: id_permissao,
    },
  });

  return associacao !== null;
};

module.exports = {
  obterTodosUsuarioPermissoes,
  obterPermissoesPorUsuario,
  obterUsuariosPorPermissao,
  criarUsuarioPermissao,
  deletarUsuarioPermissao,
  verificarPermissaoUsuario,
};
