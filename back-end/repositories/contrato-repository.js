const model = require("../models");

const listarContratosDoLocador = async (locador_cpf, filtros) => {  
  return await model.Contrato.findAll({
    where: filtros, // "WHERE" do banco de dados => filtros que vão ser aplicados na tabela Contrato
    // os atributos do objeto "filtros", que vão para o where, devem ter o mesmo nome das colunas do modelo (model.Contrato)
    include: [ // "JOIN" do banco de dados
      {
        model: model.Unidade_moradia,
        as: "Unidade_moradia", // defini pois vinha com um nome estranho (m no final)
        include: [
          {
            model: model.Imovel,
            where: {
              locador_cpf: locador_cpf
            } // precisa obrigatoriamente ter {} no where
          }
        ]
      }
    ],
    order: [['data_inicio', 'DESC']],
  });
};

const listarContratosDoInquilino = async (inquilino_cpf, filtros) => {
  return await model.Contrato.findAll({
    where: {
      ...filtros,
      inquilino_cpf
    },
    include: [ // pra mostrar o nome da unidade de moradia
      {
        model: model.Unidade_moradia,
        as: "Unidade_moradia",
      }
    ],
    order: [['data_inicio', 'DESC']],
  });
};

// fiz para retornar também unidade de moradia e imovel (pra verificar o locador) e inquilino (pra verificar o inquilino)
const obterContratoPorId = async (id) => {
  return await model.Contrato.findByPk(id, {
    include: [
      {
        model: model.Unidade_moradia,
        as: "Unidade_moradia",
        include: [{ model: model.Imovel }],
      },
      { model: model.Inquilino },
    ],
  });
};

const criarContrato = async (contrato) => {
  return await model.Contrato.create({
    // inseridos pelo usuário:
    id_um: contrato.id_um,
    inquilino_cpf: contrato.inquilino_cpf,
    preco: contrato.preco,
    // padrão:
    pdf: null,
    data_inicio: new Date(),
    data_fim: null,
    contrato_ativo: true,
  });
};

const atualizarContrato = async (id, contrato) => {
  try {
    await model.Contrato.update(contrato, { where: { id: id } });
    return await model.Contrato.findByPk(id);
  } catch (error) {
    throw error;
  }
};

// criei para verificar se existe um contrato ativo na unidade de moradia (importante pra saber se pode mudar a disponibilidade da unidade)
const existeContratoAtivoNaUnidade = async (id_um) => {
  try {
    const count = await model.Contrato.count({
      where: {
        id_um: id_um,
        contrato_ativo: true,
      },
    });
    return count > 0;
  } catch (error) {
    throw error;
  }
};

const listarContratosDaUnidade = async (id_um) => {
  try {
    return await model.Contrato.findAll({
      where: { id_um: id_um },
      order: [['data_inicio', 'DESC']],
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listarContratosDoLocador,
  listarContratosDoInquilino,
  obterContratoPorId,
  criarContrato,
  atualizarContrato,
  existeContratoAtivoNaUnidade,
  listarContratosDaUnidade,
};
