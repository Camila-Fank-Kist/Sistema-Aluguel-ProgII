const express = require("express");
const inquilinoService = require("../services/inquilino-service");

const inquilinoRouter = express.Router();

// POST /inquilino - Criar inquilino
inquilinoRouter.post("/", inquilinoService.criarInquilino);

// GET /inquilino/:cpf - Retornar inquilinos
inquilinoRouter.get("/todos", inquilinoService.retornaTodosInquilinos);

module.exports = inquilinoRouter;
