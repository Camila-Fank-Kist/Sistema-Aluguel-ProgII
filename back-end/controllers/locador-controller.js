const express = require("express");
const locadorService = require("../services/locador-service");

const locadorRouter = express.Router();

// POST /locador - Criar locador
locadorRouter.post("/", locadorService.criarLocadores);

// GET /locador/:cpf - Retornares locadores
locadorRouter.get("/todos", locadorService.retornaTodosLocadores);

module.exports = locadorRouter;
