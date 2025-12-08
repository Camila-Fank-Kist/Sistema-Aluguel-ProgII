//Onde ocorre de fato a autenticação
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("../models");

// Configuração da estratégia local (username/password)
const configureLocalStrategy = () => {
  passport.use(
    new LocalStrategy(
      {
        //campos usados para o login (cpf e senha)
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // busca o usuário no banco de dados usando Sequelize. É let porque pode mudar de valor (se não encontrar em locador, procura em inquilino)
          let user = await model.Locador.findOne({
            //retorna o 1º elemento correspondente
            where: { cpf: username },
          });

          if (user) {
            user.tipo_usuario = "locador"; //entra aqui se user é o locador
          } else {
            //se o cpf não corresponde ao do locador, verifico se é do inquilino
            user = await model.Inquilino.findOne({
              //retorna o 1º elemento correspondente
              where: { cpf: username },
            });

            if (user) {
              user.tipo_usuario = "inquilino";
            }
          }

          // se não encontrou, retorna erro
          if (!user) {
            return done(null, false, { message: "Usuário incorreto." });
          }

          // compara a senha escrita com a senha criptografada do banco
          const passwordMatch = await bcrypt.compare(password, user.senha);

          // se senha está ok, retorna o objeto usuário
          if (passwordMatch) {
            console.log("Usuário autenticado!");
            return done(null, user);
          } else {
            // senão, retorna um erro
            return done(null, false, { message: "Senha incorreta." });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

// Configuração da estratégia JWT
const configureJwtStrategy = () => {
  passport.use(
    new JwtStrategy(
      {
        //controla os usuários logados usando JWT, extraindo a autorização Bearer
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your-secret-key", //chave para validar token
      },
      async (payload, done) => {
        //buscando cpf do usuário
        try {
          user = await model.Locador.findByPk(payload.username); //findByPk busca pela primary key

          if (user == null) {
            user = await model.Inquilino.findByPk(payload.username); //findByPk busca pela primary key
          }

          if (user) {
            //se encontrou
            done(null, user);
          } else {
            //se não encontrou
            done(null, false);
          }
        } catch (error) {
          //em caso de erro
          done(error, false);
        }
      }
    )
  );
};

// Configuração de serialização do usuário
const configureSerialization = () => {
  passport.serializeUser(function (user, cb) {
    //salva os dados necessários para a sessão (cpf)
    process.nextTick(function () {
      return cb(null, {
        cpf: user.cpf,
        username: user.cpf,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    //restaura a sessão
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};

// Função para criar novo usuário (Locador)
const criarNovoUsuario = async (userData) => {
  const saltRounds = 10;
  const { cpf, senha, opcao, data_nascimento, nome, genero, trabalha, estuda } =
    userData;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPasswd = bcrypt.hashSync(senha, salt); //criptografa a senha e guarda em hashedPasswd

  if (opcao == "locador") {
    //se trata de locador
    await model.Locador.create({
      cpf,
      nome,
      data_nascimento,
      senha: hashedPasswd,
    });

    await model.LocadorPermissao.create({
      //cria a permissão
      cpf: cpf,
      id_permissao: 1,
    });
  } else {
    //se trata de inquilino
    await model.Inquilino.create({
      cpf,
      nome,
      data_nascimento,
      senha: hashedPasswd,
      trabalha,
      estuda,
      genero,
    });

    await model.InquilinoPermissao.create({
      //cria a permissão
      cpf: cpf,
      id_permissao: 2,
    });
  }

  return { cpf }; //retorna cpf porque ele é o único necessário tanto para login quanto para permissão
};

// Função para gerar token JWT
const gerarToken = (username) => {
  //cria token com validade de 1h, username = cpf e a chave
  return jwt.sign({ username: username }, "your-secret-key", {
    expiresIn: "1h",
  });
};

// Middleware para autenticação JWT, usado para proteger rota
const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Função para verificar se um usuário tem uma permissão específica por descrição
const verificarPermissaoPorDescricao = async (cpf, descricaoPermissao) => {
  try {
    // Busca a permissão pela descrição
    const permissao = await model.Permissao.findOne({
      //retorna o primeiro
      where: { descricao: descricaoPermissao },
    });

    if (!permissao) {
      return false;
    }

    // Verifica se o usuário tem essa permissão
    const usuarioPermissao = await model.UsuarioPermissao.findOne({
      //retorna o primeiro
      where: {
        cpf: cpf,
        id_permissao: permissao.id,
      },
    });

    return usuarioPermissao !== null; //retorna se encontrou
  } catch (error) {
    //em caso de erro
    console.error("Erro ao verificar permissão:", error);
    return false;
  }
};

// Função para obter todas as permissões de um usuário
const obterPermissoesUsuario = async (cpf) => {
  try {
    const permissoes = await model.UsuarioPermissao.findAll({
      where: {
        cpf: cpf,
      },
      include: [
        {
          model: model.Permissao,
          as: "Permissao",
        },
      ],
    });

    return permissoes.map((up) => up.Permissao);
  } catch (error) {
    console.error("Erro ao obter permissões do usuário:", error);
    return [];
  }
};

// Middleware reutilizável para verificar permissão específica
// Deve ser usado APÓS o requireJWTAuth
const verificarPermissaoMiddleware = (descricaoPermissao) => {
  return async (req, res, next) => {
    try {
      // Verifica se o usuário está autenticado (req.user deve ser definido pelo requireJWTAuth)
      if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }

      //o usuário está autenticado
      const cpf = req.user.cpf;
      const temPermissao = await verificarPermissaoPorDescricao(
        cpf,
        descricaoPermissao
      );

      if (!temPermissao) {
        return res.status(403).json({
          message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`,
        });
      }

      // Se passou na verificação, continua para o próximo middleware
      next();
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  };
};

// Middleware para verificar JWT e permissão específica
const requirePermissao = (descricaoPermissao) => {
  return [
    requireJWTAuth,
    async (req, res, next) => {
      try {
        // req.user é definido pelo requireJWTAuth
        if (!req.user) {
          return res.status(401).json({ message: "Usuário não autenticado." });
        }

        //identificado o usuário
        const cpf = req.user.cpf;
        const temPermissao = await verificarPermissaoPorDescricao(
          cpf,
          descricaoPermissao
        );

        if (!temPermissao) {
          return res.status(403).json({
            message: `Acesso negado. Permissão necessária: ${descricaoPermissao}`,
          });
        }

        next();
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
      }
    },
  ];
};

module.exports = {
  configureLocalStrategy,
  configureJwtStrategy,
  configureSerialization,
  criarNovoUsuario,
  gerarToken,
  requireJWTAuth,
  verificarPermissaoPorDescricao,
  obterPermissoesUsuario,
  verificarPermissaoMiddleware,
  requirePermissao,
};
