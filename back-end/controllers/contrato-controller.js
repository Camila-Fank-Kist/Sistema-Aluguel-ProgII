const express = require("express");
const contratoService = require("../services/contrato-service");
const authService = require("../services/auth-service");

const contratoRouter = express.Router();

// -- rotas para os dois tipos de usuário: locador e inquilino --

<<<<<<< HEAD
// GET /contrato/locador - listar contratos das unidades do locador
contratoRouter.get(
  "/locador",
  authService.requireJWTAuth,
  contratoService.listaContratosDoLocador
);
// para o locador, listar todos os contratos das unidades de moradia dos imóveis que ele possui

// GET /contrato/inquilino - listar contratos do inquilino
contratoRouter.get(
  "/inquilino",
  authService.requireJWTAuth,
  contratoService.listaContratosDoInquilino
);
=======

// GET /contrato/locador - listar contratos das unidades do locador
contratoRouter.get("/locador", authService.requireJWTAuth, contratoService.listaContratosDoLocador);
// para o locador, listar todos os contratos das unidades de moradia dos imóveis que ele possui

// GET /contrato/inquilino - listar contratos do inquilino
contratoRouter.get("/inquilino", authService.requireJWTAuth, contratoService.listaContratosDoInquilino);
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
// para o inquilino, listar todos os contratos dele (onde inquilino_cpf é o cpf do inquilino)

// obs.: para buscar os contratos por FILTROS, deixamos o GET geral ("/locador" e "/inquilino"), e passamos parâmetros para filtrar a listagem
// FILTROS: contrato_ativo, id_um???????????, inquilino_cpf (só para locador)

<<<<<<< HEAD
//

// GET /contrato/:id - Detalhar contrato por id
contratoRouter.get(
  "/:id",
  authService.requireJWTAuth,
  contratoService.retornaContratoPorId
);

// --------------------------------------------------------------

// -- as demais rotas são só do locador --

// POST /contrato - Criar novo contrato
contratoRouter.post(
  "/",
  authService.requireJWTAuth,
  contratoService.criaContrato
);
=======
// 

// GET /contrato/:id - Detalhar contrato por id
contratoRouter.get("/:id", authService.requireJWTAuth, contratoService.retornaContratoPorId);


// --------------------------------------------------------------


// -- as demais rotas são só do locador --


// POST /contrato - Criar novo contrato
contratoRouter.post("/", authService.requireJWTAuth, contratoService.criaContrato); 
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
// lembrar que ao criar um contrato, tem que mudar o campo "disponivel" da unidade de moradia associada para false
// e se a unidade já estiver ocupada, não pode criar o contrato
// quando criamos o contrato, ele ficar automaticamente ativo (contrato_ativo=true)

<<<<<<< HEAD
// PUT /contrato/:id - Atualizar contrato
contratoRouter.put(
  "/:id",
  authService.requireJWTAuth,
  contratoService.atualizaContrato
);
=======

// PUT /contrato/:id - Atualizar contrato
contratoRouter.put("/:id", authService.requireJWTAuth, contratoService.atualizaContrato); 
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
// obs1.: aqui NÃO alteramos o atributo "contrato_ativo" do contrato
// obs2.: os atributos data_inicio e data_fim vão ser setados automaticamente (data_inicio na criação do contrato, data_fim na hora de encerrar o contrato), e não podem ser alterados

// rota própria para encerrar o contrato (contrato_ativo=false), para que, nessa rota específica, a gente já implemente toda a lógica necessária para encerrar o contrato e atualizar a unidade de moradia (atualizar o campo "disponivel" da unidade de moradia para true)
// POST /contrato/:id/encerrar - Encerrar contrato
<<<<<<< HEAD
contratoRouter.post(
  "/:id/encerrar",
  authService.requireJWTAuth,
  contratoService.encerraContrato
);
// obs3.: uma vez que o contrato_ativo for false, não vai ser possível reativar o contrato nem fazer qualquer alteração nele

=======
contratoRouter.post("/:id/encerrar", authService.requireJWTAuth, contratoService.encerraContrato);
// obs3.: uma vez que o contrato_ativo for false, não vai ser possível reativar o contrato nem fazer qualquer alteração nele



>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
// proibimos a exclusão do contrato, pois essas coisas são dados legais e devem ser mantidos. Ou seja, não criamos uma rota para isso
// DELETE /contrato/:id - Remover contrato
// contratoRouter.delete("/:id", contratoService.deletarContrato);

<<<<<<< HEAD
// obs.:: a rota para listar contratos de uma unidade específica foi movida para "unidade_moradia-controller"

module.exports = contratoRouter;
=======

// obs.:: a rota para listar contratos de uma unidade específica foi movida para "unidade_moradia-controller"


module.exports = contratoRouter;
>>>>>>> c68eebaa42fed46e4f809f6e4965c9aa14fca47d
