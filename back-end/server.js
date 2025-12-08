const express = require("express");
const cors = require("cors");

const imovelRouter = require("./controllers/imovel-controller");
const unidadeRouter = require("./controllers/unidade_moradia-controller");
const contratoRouter = require("./controllers/contrato-controller");
const locadorRouter = require("./controllers/locador-controller");
const inquilinoRouter = require("./controllers/inquilino-controller");
const locador_permissaoRouter = require("./controllers/locador_permissao-controller");
const inquilino_permissaoRouter = require("./controllers/inquilino_permissao-controller");
const permissaoRouter = require("./controllers/permissao-controller");
const authRouter = require("./controllers/auth-controller");
const authService = require("./services/auth-service");

const session = require("express-session"); //sessão da autenticação (o usuário interage naquele momento)
const passport = require("passport"); //integra diferentes métodos de applicação nas autenticações

const app = express();
app.use(express.json());
app.use(cors());

// Configurar express-session ANTES do passport.session(). É aquela frase secreta
app.use(
  session({
    secret: "e_segredo",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // false para desenvolvimento (true requer HTTPS)
  })
);

app.use(passport.initialize()); //inicializa o passport
app.use(passport.session()); //ativa o uso das sessões

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

const PORT = 3002;
const server = app.listen(PORT, () =>
  console.log(`Servidor está rodando na porta ${PORT}.`)
);

// Manter referência do servidor para evitar garbage collection
server.on("error", (err) => {
  console.error("Erro no servidor:", err);
});

// Usar o router de autenticação (tela de login)
app.use("/", authRouter);
app.use("/imovel", imovelRouter);
app.use("/unidade-moradia", unidadeRouter);
//app.use("/contrato", contratoRouter);
app.use("/locador", locadorRouter);
app.use("/inquilino", inquilinoRouter);
app.use("/locador_permissao", locador_permissaoRouter);
app.use("/inquilino_permissao", inquilino_permissaoRouter);
app.use("/permissao", permissaoRouter);
