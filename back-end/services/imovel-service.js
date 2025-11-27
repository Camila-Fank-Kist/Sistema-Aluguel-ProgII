const imovelRepository = require("../repositories/imovel-repository");
//const umRepository = require("../repositories/um-repository");

// Função para retornar todos os imóveis
const retornaTodosImoveis = async (req, res) => {
  try {
    const imoveis = await imovelRepository.obterTodosImoveis();
    res.status(200).json({ imoveis: imoveis });
  } catch (error) {
    console.log("Erro ao buscar imóveis:", error);
    res.sendStatus(500);
  }
};

// Função para criar um novo imóvel
const criarImovel = async (req, res) => {
  const {
    regras_convivencia,
    publico,
    endereco_rua,
    endereco_bairro,
    endereco_numero,
    endereco_cidade,
    endereco_estado,
    endereco_pais,
    endereco_cep,
    endereco_complemento,
    tipo_imovel,
    nome_imovel,
  } = req.body;
  console.log({
    regras_convivencia,
    publico,
    endereco_rua,
    endereco_bairro,
    endereco_numero,
    endereco_cidade,
    endereco_estado,
    endereco_pais,
    endereco_cep,
    endereco_complemento,
    tipo_imovel,
    nome_imovel,
  });
  try {
    if (
      !regras_convivencia ||
      !publico ||
      !endereco_rua ||
      !endereco_bairro ||
      !endereco_numero ||
      !endereco_cidade ||
      !endereco_estado ||
      !endereco_pais ||
      !endereco_cep ||
      !endereco_complemento ||
      !tipo_imovel ||
      !nome_imovel
    ) {
      return res
        .status(400)
        .json({ message: "A inserção de todos os elementos é obrigatória." });
    }

    const imovel = await imovelRepository.criarImovel({
      regras_convivencia,
      publico,
      endereco_rua,
      endereco_bairro,
      endereco_numero,
      endereco_cidade,
      endereco_estado,
      endereco_pais,
      endereco_cep,
      endereco_complemento,
      tipo_imovel,
      nome_imovel,
    });
    res.status(201).json(imovel);
  } catch (error) {
    console.log("Erro ao criar imóvel:", error);
    res.sendStatus(500);
  }
};

// Função para atualizar um imóvel
const atualizaImovel = async (req, res) => {
  const {
    regras_convivencia,
    publico,
    endereco_rua,
    endereco_bairro,
    endereco_numero,
    endereco_cidade,
    endereco_estado,
    endereco_pais,
    endereco_cep,
    endereco_complemento,
    tipo_imovel,
    nome_imovel,
  } = req.body;
  const id = parseInt(req.params.id);
  try {
    const imovelAtualizado = await imovelRepository.atualizarImovel({
      id,
      regras_convivencia,
      publico,
      endereco_rua,
      endereco_bairro,
      endereco_numero,
      endereco_cidade,
      endereco_estado,
      endereco_pais,
      endereco_cep,
      endereco_complemento,
      tipo_imovel,
      nome_imovel,
    });

    if (imovelAtualizado) {
      res.status(200).json(imovelAtualizado);
    } else {
      res.status(404).json({ message: "Imóvel não encontrado" });
    }
  } catch (error) {
    console.log("Erro ao atualizar imóvel:", error);
    res.sendStatus(500);
  }
};

// Função para deletar um imóvel - preciso de ajuda
const deletaImovel = async (req, res) => {
  try {
    const id = parseInt(req.params.id); //fica no endereço

    // Primeiro devo deletar a(s) unidades de moradia que pertencem ao imóvel
    const todasUM_do_imovel = await umRepository.obterUMPorIdImovel(id); //Camila, aqui voce pode trocar pelo nome que você colocou na UM

    //Deletando todos as unidades de moradia do imóvel
    for (const um of todasUM_do_imovel) {
      //Camila, aqui voce pode trocar pelo nome que você colocou na UM
      await umRepository.deletarUM({
        //Camila, aqui voce pode trocar pelo nome que você colocou na UM
        id_imovel: id,
        id_um: um.id, //Camila, aqui voce pode trocar pelo nome que você colocou na UM
      });
    }
    //Depois deleto o imóvel
    const imovelRemovido = await imovelRepository.deletarImovel({ id });

    if (imovelRemovido) {
      res.status(200).json({
        message: "Imóvel removido com sucesso.",
        imovel: imovelRemovido,
      });
    } else {
      res.status(404).json({ message: "Imóvel não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao deletar imóvel:", error);
    res.status(500).json({ message: "Erro ao deletar imóvel" });
  }
};

// Função para buscar imóvel por ID
const retornaImovelPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id); //fica no endereço
    const imovel = await imovelRepository.obterImovelPorId({
      id,
    });

    if (imovel) {
      res.status(200).json(imovel);
    } else {
      res.status(404).json({ message: "Imóvel não encontrado." });
    }
  } catch (error) {
    console.log("Erro ao buscar imóvel:", error);
    res.sendStatus(500);
  }
};

module.exports = {
  retornaTodosImoveis,
  criarImovel,
  atualizaImovel,
  deletaImovel,
  retornaImovelPorId,
};
