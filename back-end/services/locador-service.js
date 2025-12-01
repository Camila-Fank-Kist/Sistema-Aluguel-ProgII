const locadorRepository = require("../repositories/locador-repository");

// Função para retornar todos os locadores
const retornaTodosLocadores = async (req, res) => {
  try {
    const locadores = await locadorRepository.obterTodosLocadores();
    res.status(200).json({ locadores: locadores });
  } catch (error) {
    console.log("Erro ao buscar locadores:", error);
    res.sendStatus(500);
  }
};

// Função para criar um novo locador
const criarLocadores = async (req, res) => {
  const { cpf, nome, data_nascimento, senha } = req.body;
  console.log({ cpf, nome, data_nascimento, senha });
  try {
    if (!cpf || !nome || !data_nascimento || !senha) {
      return res
        .status(400)
        .json({ message: "A inserção de todos os elementos é obrigatória." });
    }

    const locador = await locadorRepository.criarLocador({
      cpf,
      nome,
      data_nascimento,
      senha,
    });
    res.status(201).json(locador);
  } catch (error) {
    console.log("Erro ao criar locador:", error);
    res.sendStatus(500);
  }
};

module.exports = { retornaTodosLocadores, criarLocadores };
