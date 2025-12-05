const express = require("express");
const locadorPermissaoService = require("../services/locador_permissao-service");

const locadorPermissaoRouter = express.Router();

// POST /locador_permissao - Criar nova associação locador-permissão
locadorPermissaoRouter.post("/", locadorPermissaoService.criaLocadorPermissao);

// GET /locador_permissao/todos - Retornar todas as associações locador-permissão
locadorPermissaoRouter.get(
  "/todos",
  locadorPermissaoService.retornaTodosLocadorPermissoes
);

// GET /locador_permissao/locador/:cpf - Retornar todas as permissões de um locador
locadorPermissaoRouter.get(
  "/locador/:cpf",
  locadorPermissaoService.retornaPermissoesPorLocador
);

// GET /locador_permissao/permissao/:id_permissao - Retornar todos os locadores com uma permissão
locadorPermissaoRouter.get(
  "/permissao/:id_permissao",
  locadorPermissaoService.retornaLocadoresPorPermissao
);

// GET /locador_permissao/verificar/:cpf/:id_permissao - Verificar se locador tem permissão
locadorPermissaoRouter.get(
  "/verificar/:cpf/:id_permissao",
  locadorPermissaoService.verificaPermissaoLocador
);

// DELETE /locador_permissao/:cpf/:id_permissao - Deletar associação locador-permissão
locadorPermissaoRouter.delete(
  "/:cpf/:id_permissao",
  locadorPermissaoService.deletaLocadorPermissao
);

module.exports = locadorPermissaoRouter;
