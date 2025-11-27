const express = require("express");
const CadastroService = require("../services/cadastro-service");

const cadastroRouter = express.Router();

// POST /imovel - Criar novo imóvel
imovelRouter.post("/", imovelService.criarImovel);

// GET /imovel - Retornar todos os imóveis
imovelRouter.get("/todos", imovelService.retornaTodosImoveis);

// GET /imovel/:id - Retornar imóvel por id
imovelRouter.get("/:id", imovelService.retornaImovelPorId);

// PUT /imovel/:id - Atualizar imóvel
imovelRouter.put("/:id", imovelService.atualizaImovel);

// DELETE /imovel/:id - Deletar imóvel
imovelRouter.delete("/:id", imovelService.deletaImovel);

module.exports = imovelRouter;
