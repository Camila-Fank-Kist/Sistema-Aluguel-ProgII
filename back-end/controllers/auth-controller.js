//auth fará o gerenciamento em login e informará quem é em tipo_usuario (front decide se vai para tela locador ou vai para tela inquilino)
const express = require("express");
const passport = require("passport");
const authService = require("../services/auth-service");

const authRouter = express.Router();

// POST /login - Autenticação de usuário
authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }), //faz usuário+senha e verifica automaticamente se está certo ou errado
  (req, res) => {
    // Cria o token JWT usando CPF
    const token = authService.gerarToken(req.user.cpf);

    res.json({
      //se der tudo certo
      message: "Login successful",
      token: token, //retorna JWT
      tipo_usuario: req.user.tipo_usuario, //tipo_usuario refere-se a se é locador ou inquilino
    });
  }
);

// POST /logout - Logout (saída do sistema) do usuário
authRouter.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    //volta para tela de login
    if (err) {
      return next(err); //se erro, retorna erro
    }
    res.redirect("/"); //retorna para tela de login
  });
});

// POST /novoUsuario - Criar novo usuário
authRouter.post("/novoUsuario", async (req, res) => {
  //endereço para criar um usuário
  try {
    await authService.criarNovoUsuario(req.body); //usuário insere seus dados (como no Insmonia)
    console.log("Usuário inserido");
    res.sendStatus(200);
  } catch (error) {
    //em caso de erro
    console.log(error);
    res.sendStatus(400);
  }
});

module.exports = authRouter;
