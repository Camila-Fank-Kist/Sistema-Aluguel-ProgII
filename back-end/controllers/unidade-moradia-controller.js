const express = require("express");
const unidadeService = require("../services/unidade_moradia-service");

const unidadeRouter = express.Router();

// POST /unidade-moradia - Criar nova unidade
unidadeRouter.post("/", unidadeService.criarUnidade);

// GET /unidade-moradia - Listar unidades (paginação/filtros)
unidadeRouter.get("/", unidadeService.listarUnidades);

// GET /unidade-moradia/disponiveis - Listar unidades disponíveis
unidadeRouter.get("/disponiveis", unidadeService.unidadesDisponiveis);

// GET /unidade-moradia/:id - Detalhe da unidade
unidadeRouter.get("/:id", unidadeService.retornaUnidadePorId);

// PUT /unidade-moradia/:id - Atualizar unidade (substituir)
unidadeRouter.put("/:id", unidadeService.atualizaUnidade);

// PATCH /unidade-moradia/:id - Atualização parcial
unidadeRouter.patch("/:id", unidadeService.atualizaUnidadeParcial);

// POST /unidade-moradia/:id/status - Mudar status (disponivel/ocupada/manutencao)
unidadeRouter.post("/:id/status", unidadeService.mudaStatusUnidade);

// GET /unidade-moradia/imovel/:imovelId - Listar unidades de um imóvel
unidadeRouter.get("/imovel/:imovelId", unidadeService.unidadesPorImovel);

// POST /unidade-moradia/:id/upload-foto - Upload de foto/galeria
unidadeRouter.post("/:id/upload-foto", unidadeService.uploadFoto);

// DELETE /unidade-moradia/:id - Remover unidade (preferir soft-delete)
unidadeRouter.delete("/:id", unidadeService.deletaUnidade);

module.exports = unidadeRouter;
