const inquilinoRepository = require("../repositories/inquilino-repository");

// Função para retornar todos os inquilinos
const retornaTodosInquilinos = async (req, res) => {
  try {
    const inquilinos = await inquilinoRepository.obterTodosInquilinos();
    res.status(200).json({ inquilinos: inquilinos });
  } catch (error) {
    console.log("Erro ao buscar inquilinos:", error);
    res.sendStatus(500);
  }
};

// Função para criar um novo inquilino
const criarInquilinos = async (req, res) => {
  const { cpf, nome, data_nascimento, senha, genero, trabalha, estuda } =
    req.body;
  console.log({ cpf, nome, data_nascimento, senha, genero, trabalha, estuda });
  try {
    if (
      !cpf ||
      !nome ||
      !data_nascimento ||
      !senha ||
      !genero ||
      trabalha == null ||
      estuda == null
    ) {
      return res
        .status(400)
        .json({ message: "A inserção de todos os elementos é obrigatória." });
    }

    const inquilino = await inquilinoRepository.criarInquilino({
      cpf,
      nome,
      data_nascimento,
      senha,
      genero,
      trabalha,
      estuda,
    });
    res.status(201).json(inquilino);
  } catch (error) {
    console.log("Erro ao criar inquilino:", error);
    res.sendStatus(500);
  }
};

module.exports = { retornaTodosInquilinos, criarInquilinos };
