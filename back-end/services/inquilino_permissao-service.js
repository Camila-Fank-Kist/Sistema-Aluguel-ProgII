const inquilinoPermissaoRepository = require("../repositories/inquilino_permissao-repository");

// Função para retornar todas as associações inquilino-permissão
const retornaTodosInquilinoPermissoes = async (req, res) => {
  try {
    const inquilinoPermissoes =
      await inquilinoPermissaoRepository.obterTodosInquilinosPermissoes();
    res.status(200).json({ inquilinoPermissoes: inquilinoPermissoes });
  } catch (error) {
    console.log("Erro ao buscar inquilino-permissões:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todas as permissões de um inquilino
const retornaPermissoesPorInquilino = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const permissoes =
      await inquilinoPermissaoRepository.obterPermissoesPorInquilino(cpf);
    res.status(200).json({ permissoes: permissoes });
  } catch (error) {
    console.log("Erro ao buscar permissões do inquilino:", error);
    res.sendStatus(500);
  }
};

// Função para retornar todos os inquilinos com uma permissão específica
const retornaInquilinosPorPermissao = async (req, res) => {
  try {
    const id_permissao = parseInt(req.params.id_permissao);
    const inquilinos =
      await inquilinoPermissaoRepository.obterInquilinosPorPermissao(
        id_permissao
      );
    res.status(200).json({ inquilinos: inquilinos });
  } catch (error) {
    console.log("Erro ao buscar inquilinos por permissão:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma nova associação inquilino-permissão
const criaInquilinoPermissao = async (req, res) => {
  const { cpf, id_permissao } = req.body;
  try {
    if (!cpf || !id_permissao) {
      return res
        .status(400)
        .json({ message: "CPF e ID da permissão são obrigatórios." });
    }

    const inquilinoPermissao =
      await inquilinoPermissaoRepository.criarInquilinoPermissao({
        cpf,
        id_permissao,
      });
    res.status(201).json(inquilinoPermissao);
  } catch (error) {
    console.log("Erro ao criar inquilino-permissão:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma associação inquilino-permissão
const deletaInquilinoPermissao = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const id_permissao = parseInt(req.params.id_permissao);
    const inquilinoPermissaoRemovida =
      await inquilinoPermissaoRepository.deletarInquilinoPermissao({
        cpf,
        id_permissao,
      });

    if (inquilinoPermissaoRemovida) {
      res.status(200).json({
        message: "Associação inquilino-permissão removida com sucesso.",
        inquilinoPermissao: inquilinoPermissaoRemovida,
      });
    } else {
      res
        .status(404)
        .json({ message: "Associação inquilino-permissão não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao deletar inquilino-permissão:", error);
    res.status(500).json({ message: "Erro ao deletar inquilino-permissão" });
  }
};

// Função para verificar se um inquilino tem uma permissão específica
const verificaPermissaoInquilino = async (req, res) => {
  try {
    const cpf = req.params.cpf;
    const id_permissao = parseInt(req.params.id_permissao);
    const temPermissao =
      await inquilinoPermissaoRepository.verificarPermissaoInquilino(
        cpf,
        id_permissao
      );

    res.status(200).json({
      cpf: cpf,
      id_permissao: id_permissao,
      temPermissao: temPermissao,
    });
  } catch (error) {
    console.log("Erro ao verificar permissão do inquilino:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosInquilinoPermissoes,
  retornaPermissoesPorInquilino,
  retornaInquilinosPorPermissao,
  deletaInquilinoPermissao,
  criaInquilinoPermissao,
  verificaPermissaoInquilino,
};
