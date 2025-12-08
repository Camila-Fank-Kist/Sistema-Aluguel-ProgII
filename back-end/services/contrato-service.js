const contratoRepository = require("../repositories/contrato-repository");
const unidadeRepository = require("../repositories/unidade_moradia-repository");
const inquilinoRepository = require("../repositories/inquilino-repository");

// -- ROTAS PARA LOCADOR E INQUILINO --

// :) aprovado para locador
const listaContratosDoLocador = async (req, res) => {
  try {
    const locador_cpf = req.user.cpf;

    const filtros = {};

    // descobri que se eu tiver um objeto "x" e fizer "x.atributo1 = valor", mesmo que atributo1 não exista em x, ele cria esse atributo

    if (req.query.contrato_ativo) {
      filtros.contrato_ativo =
        req.query.contrato_ativo === "true" ? true : false;
    }
    if (req.query.id_um) {
      filtros.id_um = parseInt(req.query.id_um);
    }
    if (req.query.inquilino_cpf) {
      filtros.inquilino_cpf = req.query.inquilino_cpf;
    }

    const contratos_locador = await contratoRepository.listarContratosDoLocador(
      locador_cpf,
      filtros
    );

    return res.status(200).json(contratos_locador);
  } catch (error) {
    console.error("Erro ao buscar contratos do locador:", error);
    return res.sendStatus(500);
  }
};

// :) aprovado para inquilino
const listaContratosDoInquilino = async (req, res) => {
  try {
    const inquilino_cpf = req.user.cpf;

    const filtros = {};

    if (req.query.contrato_ativo) {
      filtros.contrato_ativo =
        req.query.contrato_ativo === "true" ? true : false;
    }
    if (req.query.id_um) {
      filtros.id_um = parseInt(req.query.id_um);
    }

    const contratos_inquilino =
      await contratoRepository.listarContratosDoInquilino(
        inquilino_cpf,
        filtros
      );

    return res.status(200).json(contratos_inquilino);
  } catch (error) {
    console.error("Erro ao buscar contratos do inquilino:", error);
    return res.sendStatus(500);
  }
};

// :) aprovado para locador e inquilino
// obs.: só pode ver o contrato se for o locador dono da unidade ou o inquilino do contrato
const retornaContratoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const usuario_cpf = req.user.cpf;

    // obs.: pensei em obterContratoPorId já trazer a unidade de moradia, o imóvel e o o inquilino, para poder fazer as verificações de permissão sem ter que ficar fazendo várias consultas no banco por aqui
    const contrato = await contratoRepository.obterContratoPorId(id);

    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    // verificando se o usuário tem permissão pra ver esse contrato
    // pode ver se é o inquilino do contrato OU é o locador da unidade
    if (
      !(contrato.inquilino_cpf === usuario_cpf) &&
      !(contrato.Unidade_moradia?.Imovel?.locador_cpf === usuario_cpf)
    ) {
      return res
        .status(403)
        .json({ message: "Sem permissão para visualizar esse contrato." });
    }

    return res.status(200).json(contrato);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    return res.sendStatus(500);
  }
};

// -- ROTAS SÓ PRO LOCADOR --

// :) aprovado para locador
// obs1.: ao criar um contrato, mudar o campo "disponivel" da unidade para false
// obs2.: se a unidade estiver indisponível, não pode criar um contrato
// obs3.: o contrato é criado automaticamente como ativo
// obs4.: data_inicio é setada automaticamente para a data atual
const criaContrato = async (req, res) => {
  try {
    const locador_cpf = req.user.cpf;
    const { id_um, inquilino_cpf } = req.body; // se a propriedade não existe no objeto da requisição, o valor dela fica undefined
    const preco = req.body.preco ? parseFloat(req.body.preco) : null;

    if (!id_um || !inquilino_cpf || !preco) {
      return res
        .status(400)
        .json({
          message: "Unidade de moradia, inquilino e preço são obrigatórios.",
        }); // ok
    }

    if (preco < 0) {
      return res
        .status(400)
        .json({ message: "O preço não pode ser negativo." }); // ok
    }

    // verificando se a unidade existe
    const unidade = await unidadeRepository.obterUnidadePorId(id_um);
    if (!unidade) {
      return res
        .status(404)
        .json({ message: "Unidade de moradia não encontrada." }); // ok
    }
    // verificando se a unidade pertence ao locador autenticado
    if (unidade.Imovel?.locador_cpf != locador_cpf) {
      // !==
      return res
        .status(403)
        .json({ message: "Sem permissão para criar contrato nessa unidade." }); // ok
    }

    // verificando se a unidade está disponível
    if (unidade.disponivel === false) {
      return res
        .status(409)
        .json({
          message:
            "Não é possível criar um contrato. A unidade está indisponível.",
        }); // ok
    }

    // verificando se o inquilino existe
    const inquilino =
      await inquilinoRepository.obterInquilinoPorCpf(inquilino_cpf);
    if (!inquilino) {
      return res.status(404).json({ message: "Inquilino não encontrado." });
    }

    const contrato_criado = await contratoRepository.criarContrato({
      // ok
      id_um,
      inquilino_cpf,
      preco,
      // pdf e data_fim são sempre null na criação
      // data_inicio pega a data atual automaticamente
      // contrato_ativo é sempre true na criação do contrato
    });

    // atualizando a unidade de moradia associada para indisponível
    await unidadeRepository.atualizarUnidade({
      // ok
      id: id_um,
      nome_um: unidade.nome_um,
      preco_aluguel: unidade.preco_aluguel,
      descricao: unidade.descricao,
      id_imovel: unidade.id_imovel,
      id_categoria_um: unidade.id_categoria_um,
      completo: unidade.completo,
      disponivel: false, // só esse campo muda
    });

    return res.status(201).json(contrato_criado);
  } catch (error) {
    console.error("Erro ao criar contrato:", error);
    return res.sendStatus(500);
  }
};

// :) aprovado para locador
// obs1.: NÃO pode alterar contrato_ativo aqui => criamos rota própria para encerrar
// obs2.: e não pode reativar contrato encerrado
// obs3.: NÃO pode alterar data_inicio nem data_fim nunca (elas são setadas automaticamente)
// obs4.: só pode atualizar o contrato se ele estiver ativo
// obs5.: se alterar a unidade, a unidade antiga fica disponível e a nova fica indisponível
const atualizaContrato = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const locador_cpf = req.user.cpf;
    const { pdf, inquilino_cpf, id_um } = req.body;
    const preco = req.body.preco ? parseFloat(req.body.preco) : null;

    if (!id_um || !inquilino_cpf || !preco) {
      return res
        .status(400)
        .json({
          message: "Unidade de moradia, inquilino e preço são obrigatórios.",
        }); // ok
    }

    // buscando o contrato, que já vem com unidade, imóvel e inquilino
    const contrato = await contratoRepository.obterContratoPorId(id);
    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado." }); // ok
    }

    // verificando se o locador é dono da unidade ao qual o contrato pertence
    if (contrato.Unidade_moradia?.Imovel?.locador_cpf != locador_cpf) {
      // !==
      return res
        .status(403)
        .json({ message: "Sem permissão para atualizar esse contrato." }); // ok
    }

    // verificando se o contrato está ativo
    if (contrato.contrato_ativo === false) {
      return res
        .status(409)
        .json({ message: "Não é possível atualizar um contrato encerrado." }); // ok
    }

    if (preco < 0) {
      return res
        .status(400)
        .json({ message: "O preço não pode ser negativo." }); // ok
    }

    // verificando se o novo inquilino existe, se estiver alterando o inquilino
    if (inquilino_cpf && inquilino_cpf != contrato.inquilino_cpf) {
      // !==
      const novo_inquilino =
        await inquilinoRepository.obterInquilinoPorCpf(inquilino_cpf);
      if (!novo_inquilino) {
        return res
          .status(404)
          .json({ message: "Novo inquilino não encontrado." }); // ok
      }
    }

    // se estiver alterando a unidade de moradia
    let trocarUnidade = false;
    let nova_unidade = null;
    if (id_um && id_um != contrato.id_um) {
      // !==
      // verificando se a nova unidade existe e pertence ao locador autenticado
      nova_unidade = await unidadeRepository.obterUnidadePorId(id_um);
      if (!nova_unidade) {
        return res
          .status(404)
          .json({ message: "Nova unidade de moradia não encontrada." }); // ok
      }
      if (nova_unidade.Imovel?.locador_cpf !== locador_cpf) {
        return res
          .status(403)
          .json({
            message: "Sem permissão para mover o contrato para essa unidade.",
          }); // ok
      }
      // verificar se a nova unidade está disponível
      if (nova_unidade.disponivel === false) {
        return res
          .status(409)
          .json({ message: "A nova unidade está indisponível." }); // ok
      }
      trocarUnidade = true;
    }

    const contrato_atualizado = await contratoRepository.atualizarContrato(
      // ok
      id,
      {
        preco, // só esses 4 podem mudar
        pdf, // só esses 4 podem mudar
        inquilino_cpf, // só esses 4 podem mudar
        id_um, // só esses 4 podem mudar
        contrato_ativo: contrato.contrato_ativo,
        data_inicio: contrato.data_inicio,
        data_fim: contrato.data_fim,
      }
    );

    if (trocarUnidade) {
      // percebi que só dá pra mudar a unidade depois que o contrato já foi atualizado, pq se der erro na atualização do contrato, geraria inconsistência se isso fosse antes
      await unidadeRepository.atualizarUnidade({
        // ok
        id: contrato.id_um,
        nome_um: contrato.Unidade_moradia.nome_um,
        preco_aluguel: contrato.Unidade_moradia.preco_aluguel,
        descricao: contrato.Unidade_moradia.descricao,
        id_imovel: contrato.Unidade_moradia.id_imovel,
        id_categoria_um: contrato.Unidade_moradia.id_categoria_um,
        completo: contrato.Unidade_moradia.completo,
        disponivel: true, // só esse campo muda >> antiga unidade fica disponível
      });
      await unidadeRepository.atualizarUnidade({
        // ok
        id: id_um,
        nome_um: nova_unidade.nome_um,
        preco_aluguel: nova_unidade.preco_aluguel,
        descricao: nova_unidade.descricao,
        id_imovel: nova_unidade.id_imovel,
        id_categoria_um: nova_unidade.id_categoria_um,
        completo: nova_unidade.completo,
        disponivel: false, // só esse campo muda >> nova unidade fica indisponível
      });
    }

    return res.status(200).json(contrato_atualizado);
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    return res.sendStatus(500);
  }
};

// :) aprovado para locador
// obs1.: seta contrato_ativo = false
// obs2.: seta data_fim = data atual
// obs3.: atualiza a unidade associada para disponível
// obs4.: uma vez encerrado o contrato, não pode reativar nem alterar
const encerraContrato = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const locador_cpf = req.user.cpf;

    // buscar o contrato (já vem com Unidade_moradia, Imovel e Inquilino)
    const contrato = await contratoRepository.obterContratoPorId(id);
    if (!contrato) {
      return res.status(404).json({ message: "Contrato não encontrado." }); // ok
    }

    if (contrato.Unidade_moradia?.Imovel?.locador_cpf !== locador_cpf) {
      return res
        .status(403)
        .json({ message: "Sem permissão para encerrar este contrato." }); // ok
    }

    if (contrato.contrato_ativo === false) {
      return res
        .status(409)
        .json({ message: "Este contrato já está encerrado." }); // ok
    }

    const contrato_encerrado = await contratoRepository.atualizarContrato(
      // ok
      id,
      {
        preco: contrato.preco,
        pdf: contrato.pdf,
        inquilino_cpf: contrato.inquilino_cpf,
        id_um: contrato.id_um,
        data_inicio: contrato.data_inicio,
        contrato_ativo: false, // só esses dois mudam
        data_fim: new Date(), // só esses dois mudam
      }
    );

    await unidadeRepository.atualizarUnidade({
      // ok
      id: contrato.id_um,
      nome_um: contrato.Unidade_moradia.nome_um,
      preco_aluguel: contrato.Unidade_moradia.preco_aluguel,
      descricao: contrato.Unidade_moradia.descricao,
      id_imovel: contrato.Unidade_moradia.id_imovel,
      id_categoria_um: contrato.Unidade_moradia.id_categoria_um,
      completo: contrato.Unidade_moradia.completo,
      disponivel: true, // só esse muda, para deixar a unidade disponível
    });

    return res.status(200).json({
      message: "Contrato encerrado com sucesso.",
      contrato: contrato_encerrado,
    });
  } catch (error) {
    console.error("Erro ao encerrar contrato:", error);
    return res.sendStatus(500);
  }
};

module.exports = {
  listaContratosDoLocador,
  listaContratosDoInquilino,
  retornaContratoPorId,
  criaContrato,
  atualizaContrato,
  encerraContrato,
};
