const express = require("express");
const imovelService = require("../services/imovel-service");

const imovelRouter = express.Router();

// POST /imovel - Criar novo imóvel
imovelRouter.post("/", imovelService.criarImovel);

// GET /imovel - Retornar todos os imóveis
imovelRouter.get("/todos", imovelService.retornaTodosImoveis);

// GET /imovel/:id - Retornar imóveis por cpf
imovelRouter.get("/:cpf", imovelService.retornaImovelPorCPF);

// GET /imovel/:id - Retornar imóvel por id (detalhar imóvel)
imovelRouter.get("/:cpf/:id", imovelService.retornaImovelPorId);

// PUT /imovel/:id - Atualizar imóvel
imovelRouter.put("/:cpf/:id/editar", imovelService.atualizaImovel);

// DELETE /imovel/:id - Deletar imóvel
imovelRouter.delete("/:id/excluir", imovelService.deletaImovel);

module.exports = imovelRouter;
