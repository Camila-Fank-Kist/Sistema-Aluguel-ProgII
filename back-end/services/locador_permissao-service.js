const locadorPermissaoRepository = require("../repositories/locador_permissao-repository");

// Função para retornar todas as associações locador-permissão
const retornaTodosLocadorPermissoes = async (req, res) => {
  try {
    const locadorPermissoes =
      await locadorPermissaoRepository.obterTodosLocadoresPermissoes();
    res.status(200).json({ locadorPermissoes: locadorPermissoes });
  } catch (error) {
    console.log("Erro ao buscar locador-permissões:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todas as permissões de um locador
const retornaPermissoesPorLocador = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const permissoes =
      await locadorPermissaoRepository.obterPermissoesPorLocador(cpf);
    res.status(200).json({ permissoes: permissoes });
  } catch (error) {
    console.log("Erro ao buscar permissões do locador:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todos os locadores com uma permissão específica
const retornaLocadoresPorPermissao = async (req, res) => {
  try {
    const id_permissao = parseInt(req.params.id_permissao);
    const locadores =
      await locadorPermissaoRepository.obterLocadoresPorPermissao(id_permissao);
    res.status(200).json({ locadores: locadores });
  } catch (error) {
    console.log("Erro ao buscar locadores por permissão:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma nova associação locador-permissão
const criaLocadorPermissao = async (req, res) => {
  const { cpf, id_permissao } = req.body;
  try {
    if (!cpf || !id_permissao) {
      return res
        .status(400)
        .json({ message: "CPF e ID da permissão são obrigatórios." });
    }

    const locadorPermissao =
      await locadorPermissaoRepository.criarLocadorPermissao({
        cpf,
        id_permissao,
      });
    res.status(201).json(locadorPermissao);
  } catch (error) {
    console.log("Erro ao criar locador-permissão:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma associação locador-permissão
const deletaLocadorPermissao = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const id_permissao = parseInt(req.params.id_permissao);
    const locadorPermissaoRemovida =
      await locadorPermissaoRepository.deletarLocadorPermissao({
        cpf,
        id_permissao,
      });

    if (locadorPermissaoRemovida) {
      res.status(200).json({
        message: "Associação locador-permissão removida com sucesso.",
        locadorPermissao: locadorPermissaoRemovida,
      });
    } else {
      res
        .status(404)
        .json({ message: "Associação locador-permissão não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao deletar locador-permissão:", error);
    res.status(500).json({ message: "Erro ao deletar locador-permissão" });
  }
};

// Função para verificar se um locador tem uma permissão específica
const verificaPermissaoLocador = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const id_permissao = parseInt(req.params.id_permissao);
    const temPermissao =
      await locadorPermissaoRepository.verificarPermissaoLocador(
        cpf,
        id_permissao
      );

    res.status(200).json({
      cpf: cpf,
      id_permissao: id_permissao,
      temPermissao: temPermissao,
    });
  } catch (error) {
    console.log("Erro ao verificar permissão do locador:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosLocadorPermissoes,
  retornaPermissoesPorLocador,
  retornaLocadoresPorPermissao,
  criaLocadorPermissao,
  deletaLocadorPermissao,
  verificaPermissaoLocador,
};
