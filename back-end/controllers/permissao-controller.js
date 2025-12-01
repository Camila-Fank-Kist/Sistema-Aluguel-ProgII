const express = require("express");
const permissaoService = require("../services/permissao-service");

const permissaoRouter = express.Router();

// POST /permissao - Criar nova permissão
permissaoRouter.post("/", permissaoService.criaPermissao);

// GET /permissao/todos - Retornar todas as permissões
permissaoRouter.get("/todos", permissaoService.retornaTodasPermissoes);

// GET /permissao/:id - Retornar permissão por ID
permissaoRouter.get("/:id", permissaoService.retornaPermissaoPorId);

// PUT /permissao/:id - Atualizar permissão
permissaoRouter.put("/:id", permissaoService.atualizaPermissao);

// DELETE /permissao/:id - Deletar permissão
permissaoRouter.delete("/:id", permissaoService.deletaPermissao);

module.exports = permissaoRouter;
