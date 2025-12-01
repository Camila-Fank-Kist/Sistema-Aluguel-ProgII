const permissaoRepository = require("../repositories/permissoes-repository");

// Função para retornar todas as permissões
const retornaTodasPermissoes = async (req, res) => {
  try {
    const permissoes = await permissaoRepository.obterTodasPermissoes();
    res.status(200).json({ permissoes: permissoes });
  } catch (error) {
    console.log("Erro ao buscar permissões:", error);
    res.sendStatus(500);
  }
};

// Função para criar uma nova permissão
const criaPermissao = async (req, res) => {
  const { id, descricao } = req.body;
  console.log({ id, descricao });
  try {
    if (!id || !descricao) {
      return res
        .status(400)
        .json({ message: "ID e descrição são obrigatórios." });
    }

    const permissao = await permissaoRepository.criarPermissao({
      id,
      descricao,
    });
    res.status(201).json(permissao);
  } catch (error) {
    console.log("Erro ao criar permissão:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar uma permissão
const atualizaPermissao = async (req, res) => {
  const { descricao } = req.body;
  const id = parseInt(req.params.id);
  try {
    const permissaoAtualizada = await permissaoRepository.atualizarPermissao({
      id,
      descricao,
    });

    if (permissaoAtualizada) {
      res.status(200).json(permissaoAtualizada);
    } else {
      res.status(404).json({ message: "Permissão não encontrada" });
    }
  } catch (error) {
    console.log("Erro ao atualizar permissão:", error);
    res.sendStatus(500);
  }
};

// Função para deletar uma permissão
const deletaPermissao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const permissaoRemovida = await permissaoRepository.deletarPermissao({
      id,
    });

    if (permissaoRemovida) {
      res.status(200).json({
        message: "Permissão removida com sucesso.",
        permissao: permissaoRemovida,
      });
    } else {
      res.status(404).json({ message: "Permissão não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao deletar permissão:", error);
    res.status(500).json({ message: "Erro ao deletar permissão" });
  }
};

// Função para buscar permissão por ID
const retornaPermissaoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const permissao = await permissaoRepository.obterPermissaoPorId({
      id,
    });

    if (permissao) {
      res.status(200).json(permissao);
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (error) {
    console.log("Erro ao buscar permissão:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodasPermissoes,
  criaPermissao,
  atualizaPermissao,
  deletaPermissao,
  retornaPermissaoPorId,
};
