const express = require("express");
const inquilinoPermissaoService = require("../services/inquilino_permissao-service");

const inquilinoPermissaoRouter = express.Router();

// POST /inquilino_permissao - Criar nova associação inquilino-permissão
inquilinoPermissaoRouter.post(
  "/",
  inquilinoPermissaoService.criaInquilinoPermissao
);

// GET /inquilino_permissao/todos - Retornar todas as associações inquilino-permissão
inquilinoPermissaoRouter.get(
  "/todos",
  inquilinoPermissaoService.retornaTodosInquilinoPermissoes
);

// GET /inquilino_permissao/inquilino/:cpf - Retornar todas as permissões de um inquilino
inquilinoPermissaoRouter.get(
  "/inquilino/:cpf",
  inquilinoPermissaoService.retornaPermissoesPorInquilino
);

// GET /inquilino_permissao/permissao/:id_permissao - Retornar todos os inquilinos com uma permissão
inquilinoPermissaoRouter.get(
  "/permissao/:id_permissao",
  inquilinoPermissaoService.retornaInquilinosPorPermissao
);

// GET /inquilino_permissao/verificar/:cpf/:id_permissao - Verificar se inquilino tem permissão
inquilinoPermissaoRouter.get(
  "/verificar/:cpf/:id_permissao",
  inquilinoPermissaoService.verificaPermissaoInquilino
);

// DELETE /inquilino_permissao/:cpf/:id_permissao - Deletar associação inquilino-permissão
inquilinoPermissaoRouter.delete(
  "/:cpf/:id_permissao",
  inquilinoPermissaoService.deletaInquilinoPermissao
);

module.exports = inquilinoPermissaoRouter;
