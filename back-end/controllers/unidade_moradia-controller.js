const express = require("express");
const unidadeService = require("../services/unidade_moradia-service");
const authService = require("../services/auth-service");

const unidadeRouter = express.Router();

// -- rotas para locador e público geral --

// ROTAS ESPECÍFICAS POR USUÁRIO (get das unidades para locador e publico geral, que não é autenticado):
// GET /unidade-moradia/locador - listar unidades do locador
unidadeRouter.get(
  "/locador",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.listaUnidadesLocador
);
// GET /unidade-moradia/publico-geral - listar unidades para o público geral
unidadeRouter.get(
  "/publico-geral",
  unidadeService.listaTodasAsUnidadesPublicoGeral
);
// FILTROS (que vão ser passados como parâmetros (query param?)): disponivel (true/false), id_imovel????????, id_categoria_um, nome_um (como fazer para aparecer se for parcialmente igual?)

// GET /unidade-moradia/:id - Detalhe da unidade
unidadeRouter.get("/:id", unidadeService.retornaUnidadePorId);
// a princípio o que vai mudar aqui do locador para o inquilino são as coisas que aparecem na tela (botões de editar, excluir, etc.), então pensei em deixar só uma rota mesmo, e daí controlar o que é exibido no front

// --

// -- rotas só para o locador autenticado --

// POST /unidade-moradia - Criar nova unidade
unidadeRouter.post(
  "/",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.criaUnidade
);

// POST /unidade-moradia/:id/upload-foto - Upload de foto/galeria
// é assim que faz upload de foto???
unidadeRouter.post(
  "/:id/upload-foto",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.uploadFoto
);

// PUT /unidade-moradia/:id - Atualizar unidade
unidadeRouter.put(
  "/:id",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.atualizaUnidade
);
// obs. não permitir alterar o campo "disponivel" aqui

// PATCH /unidade-moradia/:id/disponivel - Mudar disponibilidade da unidade
unidadeRouter.patch(
  "/:id/disponivel",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.mudaDisponibilidade
);
// obs.: só vai ser possível mudar a disponibilidade da unidade se não tiver um contrato ativo associado a ela

// DELETE /unidade-moradia/:id - Remover unidade
unidadeRouter.delete(
  "/:id",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.deletaUnidade
);

// GET /unidade-moradia/:id/contratos - listar contratos da unidade (incluir ativos e não ativos)
unidadeRouter.get(
  "/:id/contratos",
  authService.requireJWTAuth,
  authService.verificarSeIsLocador,
  unidadeService.listaContratosDaUnidade
);

module.exports = unidadeRouter;
