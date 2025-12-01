const express = require("express");
const usuarioPermissaoService = require("../services/usuario_permissao-service");

const usuarioPermissaoRouter = express.Router();

// POST /usuario_permissao - Criar nova associação usuário-permissão
usuarioPermissaoRouter.post("/", usuarioPermissaoService.criaUsuarioPermissao);

// GET /usuario_permissao/todos - Retornar todas as associações usuário-permissão
usuarioPermissaoRouter.get(
  "/todos",
  usuarioPermissaoService.retornaTodosUsuarioPermissoes
);

// GET /usuario_permissao/usuario/:cpf - Retornar todas as permissões de um usuário
usuarioPermissaoRouter.get(
  "/usuario/:cpf",
  usuarioPermissaoService.retornaPermissoesPorUsuario
);

// GET /usuario_permissao/permissao/:id_permissao - Retornar todos os usuários com uma permissão
usuarioPermissaoRouter.get(
  "/permissao/:id_permissao",
  usuarioPermissaoService.retornaUsuariosPorPermissao
);

// GET /usuario_permissao/verificar/:cpf/:id_permissao - Verificar se usuário tem permissão
usuarioPermissaoRouter.get(
  "/verificar/:cpf/:id_permissao",
  usuarioPermissaoService.verificaPermissaoUsuario
);

// DELETE /usuario_permissao/:cpf/:id_permissao - Deletar associação usuário-permissão
usuarioPermissaoRouter.delete(
  "/:cpf/:id_permissao",
  usuarioPermissaoService.deletaUsuarioPermissao
);

module.exports = usuarioPermissaoRouter;
